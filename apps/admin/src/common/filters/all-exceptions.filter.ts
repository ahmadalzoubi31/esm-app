import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiErrorResponse } from '../dtos/api-response.dto';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (host.getType() !== 'http') {
      return;
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_SERVER_ERROR';
    let errors: ApiErrorResponse['errors'];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const r: any = res;

        // Nest/ValidationPipe typically sets "message" and "error"
        if (r.message)
          message = Array.isArray(r.message) ? r.message.join(', ') : r.message;
        if (r.code) code = r.code;
        else if (status === 400) code = 'BAD_REQUEST';
        else if (status === 401) code = 'UNAUTHORIZED';
        else if (status === 403) code = 'FORBIDDEN';
        else if (status === 404) code = 'NOT_FOUND';

        // Map validation errors to { field: [messages] }
        if (Array.isArray(r.message) && status === 400) {
          // if you already format them, you can adapt this
          errors = { general: r.message };
        } else if (r.errors) {
          errors = r.errors;
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message || message;
    }

    const body: ApiErrorResponse = {
      success: false,
      message,
      code,
      statusCode: status,
      errors,
      meta: {
        requestId: (request as any).id,
        path: request.url,
        method: request.method,
      },
    };

    response.status(status).json(body);
  }
}
