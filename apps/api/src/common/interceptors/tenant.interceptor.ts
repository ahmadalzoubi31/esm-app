import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { EntityManager } from '@mikro-orm/postgresql';

export class TenantInterceptor implements NestInterceptor {
  constructor(private readonly em: EntityManager) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const tenantId = user?.tenantId;

    console.log({
      user,
      tenantId,
    });

    if (user && !tenantId) {
      // Authenticated but missing tenantId (Old Token)
      throw new UnauthorizedException(
        'Tenant context is missing. Please log in again.',
      );
    }

    // Default to a dummy UUID to prevent "No arguments provided" error if filter is active
    // This effectively returns 0 results for unauthenticated requests unless the filter is explicitly disabled.
    const effectiveTenantId =
      tenantId || '00000000-0000-0000-0000-000000000000';

    // 1. Set Postgres RLS variable (Safe to set even if dummy)
    await this.em.execute(`SET app.current_tenant = '${effectiveTenantId}'`);

    // 2. Enable MikroORM Filter
    this.em.setFilterParams('tenant', { tenantId: effectiveTenantId });

    return next.handle();
  }
}
