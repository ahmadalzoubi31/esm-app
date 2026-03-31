import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { AuditLog } from './entities/audit-log.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepo: EntityRepository<AuditLog>,
  ) {}

  async log(params: {
    entityType: string;
    entityId: string;
    event: string;
    payload?: Record<string, any>;
  }): Promise<void> {
    // 1: Get Entity Manager
    const em = this.auditLogRepo.getEntityManager();

    // 3: Get Tenant ID from Filter
    const tenantFilter = em.getFilterParams('tenant');
    // 3.1: Get Tenant Reference
    const tenantRef = em.getReference(Tenant, tenantFilter.tenantId);

    // 4: Create Audit Log
    const auditLog = this.auditLogRepo.create({
      entityType: params.entityType,
      entityId: params.entityId,
      event: params.event,
      payload: params.payload,
      tenant: tenantRef,
      isActive: true,
    });

    // 5: Persist and Flush
    await em.persist(auditLog).flush();
  }

  async findByEntity(
    entityType: string,
    entityId: string,
  ): Promise<AuditLog[]> {
    return this.auditLogRepo.find(
      { entityType, entityId },
      { orderBy: { createdAt: 'ASC' } },
    );
  }
}
