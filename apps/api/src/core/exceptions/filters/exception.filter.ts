import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

import { InjectLogger, Logger } from '@libs/nestjs-logger';
import { AbstractError } from '@modules/core/exceptions';
import { sentry, sentryService } from '@modules/core/sentry';

import { getErrorStatus } from '../helpers';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  @InjectLogger(HttpExceptionFilter.name)
  private readonly logger: Logger;

  @sentry()
  catch(exception: unknown, host: ArgumentsHost): void {
    const contextType = host.getType();

    if (contextType === 'http') {
      return this.handleHttpException(exception, host);
    }

    if (contextType === 'rpc' || contextType === 'ws') {
      return this.handleRpcOrWsException(exception);
    }

    return this.handleGraphQLException(exception);
  }

  private handleHttpException(exception: unknown, host: ArgumentsHost): void {
    const httpContext = host.switchToHttp();
    const response = httpContext.getResponse<Response>();

    if (exception instanceof AbstractError || exception instanceof HttpException) {
      const status = getErrorStatus(exception);
      const details = 'details' in exception ? exception.details : [];
      response.status(status).json({
        status,
        name: exception.name,
        message: exception.message,
        details,
      });

      return;
    }

    const error = exception instanceof Error ? exception : new Error(String(exception));
    this.logger.error(error, error.stack);
    sentryService.error(error);

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
    });
  }

  private handleGraphQLException(exception: unknown): void {
    const error = exception instanceof Error ? exception : new Error(String(exception));

    this.logger.error(`[GraphQL Error] ${error.message}`, error.stack);
    sentryService.error(error);

    throw exception;
  }

  private handleRpcOrWsException(exception: unknown): void {
    const error = exception instanceof Error ? exception : new Error(String(exception));

    this.logger.error(error, error.stack);
    sentryService.error(error);
  }
}
