import { Inject, Injectable, Scope, BadRequestException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { EntityManager } from '@mikro-orm/postgresql';
import { TenantOrmService } from './tenant-orm.service';

@Injectable({ scope: Scope.REQUEST })
export class TenantEntityManagerProvider {
  private _em: EntityManager | undefined;

  constructor(
    private readonly tenantOrmService: TenantOrmService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async getEntityManager(): Promise<EntityManager> {
    if (this._em) {
      return this._em;
    }

    const tenantCode = this.request.headers['x-tenant-id'] as string;
    if (!tenantCode) {
      throw new BadRequestException(
        'Tenant ID header (x-tenant-id) is missing',
      );
    }

    const orm = await this.tenantOrmService.getOrm(tenantCode);
    this._em = orm.em as EntityManager;
    return this._em;
  }
}
