import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const { method, url, body, query, params, headers } = request;

    const startTime = Date.now();
    const requestId = (request as any).id;
    // const requestId = (request as any).id || this.generateRequestId();

    // Log incoming request
    this.logger.log({
      type: 'INCOMING_REQUEST',
      requestId,
      method,
      url,
      body: this.sanitizeBody(body),
      query,
      params,
      // headers,
    });

    return next.handle().pipe(
      tap({
        next: (data) => {
          const duration = Date.now() - startTime;

          // Log successful response
          this.logger.log({
            type: 'OUTGOING_RESPONSE',
            requestId,
            method,
            url,
            statusCode: response.statusCode,
            duration: `${duration}ms`,
            timestamp: new Date().toISOString(),
          });
        },
        error: (error) => {
          const duration = Date.now() - startTime;

          // Log error response
          this.logger.error({
            type: 'ERROR_RESPONSE',
            requestId,
            method,
            url,
            statusCode: error.status || 500,
            errorMessage: error.message,
            errorName: error.name,
            duration: `${duration}ms`,
            timestamp: new Date().toISOString(),
          });
        },
      }),
    );
  }

  /**
   * Sanitize sensitive data from request body
   */
  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sensitiveFields = [
      'password',
      'token',
      'secret',
      'apiKey',
      'creditCard',
    ];
    const sanitized = { ...body };

    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '***REDACTED***';
      }
    }

    return sanitized;
  }

  /**
   * Generate a unique request ID
   */
  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
