import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiSuccessResponse } from '../dtos/api-response.dto';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiSuccessResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiSuccessResponse<T>> {
    if (context.getType() !== 'http') {
      return next.handle() as any;
    }

    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    return next.handle().pipe(
      map((data: any) => {
        // support returning { data, message, meta } from handlers if you want
        const {
          data: bodyData,
          message,
          meta,
          ...rest
        } = data && typeof data === 'object' && !Array.isArray(data)
          ? (data as any)
          : { data };

        const response: ApiSuccessResponse<T> = {
          success: true,
          data: (bodyData ?? data) as T,
        };

        if (message) response.message = message;
        response.meta = {
          ...(meta || {}),
          requestId: (request as any).id, // i have middleware requestId
          // requestId: (request as any).id || this.generateRequestId(), // if you have request-id middleware
        };
        return response;
      }),
    );
  }
}
