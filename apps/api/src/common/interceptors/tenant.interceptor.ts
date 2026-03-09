import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { EntityManager } from '@mikro-orm/core';
import { Reflector } from '@nestjs/core';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  constructor(
    private readonly em: EntityManager,
    private readonly reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    // Check if the route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Skip tenant filtering for public routes
    if (isPublic) {
      return next.handle();
    }

    // Get HTTP context from request
    const request = context.switchToHttp().getRequest();

    // Get user and tenant ID from request
    const user = request.user;

    // console.debug({
    //   tenantId: user?.tenantId,
    //   method: request.method,
    //   result:
    //     user?.tenantId === '6da67552-faeb-4507-9f58-0161803afca8' &&
    //     request.method === 'GET',
    // });

    if (
      user?.tenantId === '6da67552-faeb-4507-9f58-0161803afca8' &&
      request.method === 'GET'
    ) {
      // console.log('Skipping tenant filtering for system tenant');

      this.em.setFilterParams('tenant', { bypass: true });
      return next.handle();
    }

    // Get tenant ID from request headers or user object
    const tenantId = user?.tenantId || request.headers['x-tenant-id'];

    if (!tenantId) {
      // Missing tenant context
      throw new UnauthorizedException(
        'Tenant context is missing. Please log in again or provide x-tenant-id header.',
      );
    }

    // Default to a dummy UUID to prevent "No arguments provided" error if filter is active
    // This effectively returns 0 results for unauthenticated requests unless the filter is explicitly disabled.
    const effectiveTenantId =
      tenantId || '00000000-0000-0000-0000-000000000000';

    // 1. Set Postgres RLS variable (Safe to set even if dummy)
    // try {
    //   await this.em
    //     .getConnection()
    //     .execute('SELECT set_config(?, ?, false)', [
    //       'app.current_tenant',
    //       effectiveTenantId,
    //     ]);
    // } catch (error) {
    //   console.error('Failed to set RLS variable:', error);
    // }

    // 2. Enable MikroORM Filter
    // console.log("🚀 ~ TenantInterceptor ~ intercept ~ effectiveTenantId:", effectiveTenantId)
    this.em.setFilterParams('tenant', { tenantId: effectiveTenantId });

    return next.handle();
  }
}
