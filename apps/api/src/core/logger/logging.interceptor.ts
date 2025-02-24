import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { InjectLogger, Logger } from '@libs/nestjs-logger';
import { AbstractError, getErrorStatus, IAbstractError } from '@modules/core/exceptions';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  @InjectLogger('logging.interceptor') private readonly logger: Logger;

  private instanceOfAbstractError(object: any): object is IAbstractError {
    return typeof object === 'object' && object !== null && 'details' in object;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    let req: Request | undefined;
    let user: any;
    let originalUrl = '';
    let method = '';
    let query: any;
    let params: any;

    if (context.getType<GqlContextType>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context);
      const info = gqlContext.getInfo();

      if (info) {
        const ctx = gqlContext.getContext();
        req = ctx?.req;
        user = ctx?.req?.user;
        originalUrl = info.fieldName;
        method = 'GraphQL';
        query = {};
        params = {};
      }
    } else {
      req = context.switchToHttp().getRequest<Request>();
      user = req?.user;
      originalUrl = decodeURI(req?.originalUrl || '');
      method = req?.method || 'UNKNOWN';
      query = req?.query;
      params = req?.params;
    }

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
        const ms = Date.now() - now;
        const message = { ...logObject, ms };

        if (!process.env.NODE_ENV || ['development', 'test'].includes(process.env.NODE_ENV)) {
          this.logger.debug(
            `[${message.method}] :: [${ms / 1000}s] :: OK :: ${message.originalUrl} user(${message.user?.id || null})`,
          );
        } else {
          this.logger.debug(message);
        }
      }),
      catchError((error: Error | HttpException | AbstractError) => {
        const errorName = error.name;
        const errorMessage = error.message;
        const details = this.instanceOfAbstractError(error) ? error.details : null;
        const ms = Date.now() - now;
        const status = getErrorStatus(error);
        const cause = error instanceof AbstractError ? error.cause : null;
        const message = { ...logObject, ms, status, details, cause, name: errorName, message: errorMessage };

        if (!process.env.NODE_ENV || ['development', 'test'].includes(process.env.NODE_ENV)) {
          let str = `[${message.method}] :: [${ms / 1000}s] :: status: ${status} :: ${message.originalUrl}`;
          str += ` :: user(${message.user?.id || null})`;
          str +=
            details && (!Array.isArray(details) || details.length) ? ` :: details (${JSON.stringify(details)})` : '';
          str += ` :: ${errorName}::${errorMessage}`;
          str += cause ? `:: cause (${JSON.stringify(cause)})` : '';
          this.logger.debug(str);
        } else {
          this.logger.debug(message);
        }

        return throwError(error);
      }),
    );
  }
}
