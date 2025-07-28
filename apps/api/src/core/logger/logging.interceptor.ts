import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { InjectLogger, Logger } from '@libs/nestjs-logger';
import { AbstractError, getErrorStatus, IAbstractError } from '@modules/core/exceptions';
import { ENVIRONMENT } from 'config';

import { ENVIRONMENT_NAME } from '../constants';

import { LogObject } from './types';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  @InjectLogger(LoggingInterceptor.name) private readonly logger: Logger;

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { req, user, originalUrl, method, query, params } = this.extractRequestData(context);

    if (!originalUrl) {
      this.logger.warn('originalUrl is undefined, possible issue with request context');
    }

    const body = req?.body ? (Array.isArray(req.body) ? [...req.body] : { ...req.body }) : {};

    if (body.password) {
      body.password = '***';
    }

    const logObject = { body, user, originalUrl, query, params, method };

    this.logger.verbose(`[${method}] ${originalUrl} :: starting`);
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        this.logSuccess(logObject, Date.now() - now);
      }),
      catchError((error: Error | HttpException | AbstractError) => {
        this.logError(error, logObject, Date.now() - now);

        return throwError(error);
      }),
    );
  }

  private extractRequestData(context: ExecutionContext): {
    req: Request | undefined;
    user: any;
    originalUrl: string;
    method: string;
    query: any;
    params: any;
  } {
    if (context.getType<GqlContextType>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context);
      const info = gqlContext.getInfo();

      if (!info) {
        return {
          req: undefined,
          user: undefined,
          originalUrl: '',
          method: '',
          query: {},
          params: {},
        };
      }

      const ctx = gqlContext.getContext();
      const req = ctx?.req;

      return {
        req,
        user: req?.user,
        originalUrl: info.fieldName,
        method: 'GraphQL',
        query: {},
        params: {},
      };
    }

    const req = context.switchToHttp().getRequest<Request>();

    return {
      req,
      user: req?.user,
      originalUrl: decodeURI(req?.originalUrl || ''),
      method: req?.method || 'UNKNOWN',
      query: req?.query,
      params: req?.params,
    };
  }

  private logSuccess(logObject: any, ms: number): void {
    if (!ENVIRONMENT || [ENVIRONMENT_NAME.DEVELOP, ENVIRONMENT_NAME.TEST].includes(ENVIRONMENT)) {
      this.logger.debug(
        `[${logObject.method}] :: [${ms / 1000}s] :: OK :: ${logObject.originalUrl} user(${
          logObject.user?.id || null
        })`,
      );
    } else {
      this.logger.debug({ ...logObject, ms });
    }
  }

  private logError(error: Error | HttpException | AbstractError, logObject: LogObject, ms: number): void {
    const errorName = error.name;
    const errorMessage = error.message;
    const status = getErrorStatus(error);
    const details = this.instanceOfAbstractError(error) ? error.details : null;
    const cause = error instanceof AbstractError ? error.cause : null;

    const message = {
      ...logObject,
      ms,
      status,
      name: errorName,
      message: errorMessage,
      details,
      cause,
    };

    if (!ENVIRONMENT || [ENVIRONMENT_NAME.DEVELOP, ENVIRONMENT_NAME.TEST].includes(ENVIRONMENT)) {
      let str = `[${logObject.method}] :: [${ms / 1000}s] :: status: ${status} :: ${logObject.originalUrl}`;
      str += ` :: user(${logObject.user?.id || null})`;
      str += details && (!Array.isArray(details) || details.length) ? ` :: details (${JSON.stringify(details)})` : '';
      str += ` :: ${errorName}::${errorMessage}`;
      str += cause ? `:: cause (${JSON.stringify(cause)})` : '';
      this.logger.debug(str);
    } else {
      this.logger.debug(message);
    }
  }

  private instanceOfAbstractError(object: any): object is IAbstractError {
    return typeof object === 'object' && object !== null && 'details' in object;
  }
}
