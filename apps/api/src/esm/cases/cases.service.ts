import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  EntityRepository,
  QueryOrder,
  RequiredEntityData,
} from '@mikro-orm/core';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Case } from './entities/case.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { BusinessLine } from '../../core/business-lines/entities/business-line.entity';
import { Category } from '../../core/categories/entities/category.entity';
import { User } from '../../core/users/entities/user.entity';
import { Group } from '../../core/groups/entities/group.entity';
import { Service } from '../catalog/services/entities/service.entity';
import { CaseStatus } from './constants/case-status.constant';
import { CasePriority } from './constants/case-priority.constant';
import { CASE_EVENTS } from './constants/case-events.constant';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import * as Events from './events/case.events';

@Injectable()
export class CasesService {
  constructor(
    @InjectRepository(Case) private readonly caseRepo: EntityRepository<Case>,
    @InjectRepository(BusinessLine)
    private readonly businessLineRepo: EntityRepository<BusinessLine>,
    @InjectRepository(Category)
    private readonly categoryRepo: EntityRepository<Category>,
    @InjectRepository(User) private readonly userRepo: EntityRepository<User>,
    @InjectRepository(Group)
    private readonly groupRepo: EntityRepository<Group>,
    @InjectRepository(Service)
    private readonly serviceRepo: EntityRepository<Service>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private async generateCaseNumber(): Promise<string> {
    const [result] = await this.caseRepo
      .getEntityManager()
      .getConnection()
      .execute("SELECT nextval('case_number_seq') as nextval");
    return `CS-${String(result.nextval).padStart(6, '0')}`;
  }

  async create(dto: CreateCaseDto): Promise<Case> {
    const em = this.caseRepo.getEntityManager();

    // 1. Parallel Validation
    await this.validateReferences(dto);

    // 2. Safe Tenant Handling
    const tenantFilter = em.getFilterParams('tenant');
    const tenantRef = em.getReference(Tenant, tenantFilter.tenantId);

    // 3. Create Entity
    const newCase = this.caseRepo.create({
      ...dto,
      number: '',
      status: CaseStatus.NEW,
      priority: CasePriority.LOW,
      category: '',
      requester: '',
      assignmentGroup: '',
      businessLine: '',
      affectedService: '',
      tenant: tenantRef,
      createdAt: '',
      updatedAt: '',
      isActive: false,
    });
    await em.persist(newCase).flush();

    // 3. Emit Event
    this.eventEmitter.emit(
      CASE_EVENTS.CREATED,
      new Events.CaseCreatedEvent({
        caseId: newCase.id,
        businessLineId: dto.businessLineId,
        priority: newCase.priority,
        status: newCase.status,
        _event: CASE_EVENTS.CREATED,
      }),
    );

    return newCase;
  }

  async update(id: string, dto: UpdateCaseDto): Promise<Case> {
    await this.validateReferences(dto);
    const caseEntity = await this.findOne(id);
    const em = this.caseRepo.getEntityManager();

    // 1. Snapshot for events
    const snapshot = {
      status: caseEntity.status,
      priority: caseEntity.priority,
      assigneeId: caseEntity.assignee?.id,
      groupId: caseEntity.assignmentGroup?.id,
      categoryId: caseEntity.category?.id,
      subcategoryId: caseEntity.subcategory?.id,
      businessLineId: caseEntity.businessLine?.id,
      serviceId: caseEntity.affectedService?.id,
    };

    // 2. Map DTO to Entity structure
    const {
      categoryId: category,
      subcategoryId: subcategory,
      requesterId: requester,
      assigneeId: assignee,
      assignmentGroupId: assignmentGroup,
      businessLineId: businessLine,
      affectedServiceId: affectedService,
      requestCardId: requestCard,
      ...rest
    } = dto;

    this.caseRepo.assign(caseEntity, {
      ...rest,
      category,
      subcategory,
      requester,
      assignee,
      assignmentGroup,
      businessLine,
      affectedService,
      requestCard,
    });

    await em.flush();

    // 3. Trigger events dynamically
    this.triggerUpdateEvents(id, dto, snapshot);

    return caseEntity;
  }

  async findAll(): Promise<Case[]> {
    return this.caseRepo.find(
      {},
      {
        orderBy: { createdAt: QueryOrder.DESC },
      },
    );
  }

  async findOne(id: string): Promise<Case> {
    return this.caseRepo.findOneOrFail({ id });
  }

  async remove(id: string): Promise<void> {
    const caseEntity = await this.findOne(id);
    await this.caseRepo.getEntityManager().removeAndFlush(caseEntity);
    this.eventEmitter.emit(
      CASE_EVENTS.DELETED,
      new Events.CaseDeletedEvent({
        caseId: id,
        number: caseEntity.number,
      }),
    );
  }

  // --- Helper Methods ---

  private async validateReferences(
    dto: Partial<CreateCaseDto | UpdateCaseDto>,
  ): Promise<void> {
    const checks = [
      {
        id: dto.businessLineId,
        repo: this.businessLineRepo,
        label: 'Business line',
      },
      { id: dto.categoryId, repo: this.categoryRepo, label: 'Category' },
      { id: dto.subcategoryId, repo: this.categoryRepo, label: 'Subcategory' },
      { id: dto.requesterId, repo: this.userRepo, label: 'Requester' },
      { id: dto.assigneeId, repo: this.userRepo, label: 'Assignee' },
      {
        id: dto.assignmentGroupId,
        repo: this.groupRepo,
        label: 'Assignment group',
      },
      {
        id: (dto as any).affectedServiceId,
        repo: this.serviceRepo,
        label: 'Service',
      },
    ].filter((c) => c.id);

    await Promise.all(
      checks.map(async ({ id, repo, label }) => {
        const exists = await repo.count({ id: id as string });
        if (!exists) throw new NotFoundException(`${label} not found`);
      }),
    );
  }

  private triggerUpdateEvents(id: string, dto: UpdateCaseDto, old: any): void {
    const mapping = [
      {
        key: 'status',
        event: CASE_EVENTS.STATUS_UPDATED,
        class: Events.CaseStatusUpdatedEvent,
        oldProp: 'status',
      },
      {
        key: 'assigneeId',
        event: CASE_EVENTS.ASSIGNEE_UPDATED,
        class: Events.CaseAssigneeUpdatedEvent,
        oldProp: 'assigneeId',
      },
      {
        key: 'assignmentGroupId',
        event: CASE_EVENTS.GROUP_UPDATED,
        class: Events.CaseGroupUpdatedEvent,
        oldProp: 'groupId',
      },
      {
        key: 'priority',
        event: CASE_EVENTS.PRIORITY_UPDATED,
        class: Events.CasePriorityUpdatedEvent,
        oldProp: 'priority',
      },
      {
        key: 'categoryId',
        event: CASE_EVENTS.CATEGORY_UPDATED,
        class: Events.CaseCategoryUpdatedEvent,
        oldProp: 'categoryId',
      },
      {
        key: 'subcategoryId',
        event: CASE_EVENTS.SUBCATEGORY_UPDATED,
        class: Events.CaseSubcategoryUpdatedEvent,
        oldProp: 'subcategoryId',
      },
      {
        key: 'businessLineId',
        event: CASE_EVENTS.BUSINESS_LINE_UPDATED,
        class: Events.CaseBusinessLineUpdatedEvent,
        oldProp: 'businessLineId',
      },
      {
        key: 'affectedServiceId',
        event: CASE_EVENTS.SERVICE_UPDATED,
        class: Events.CaseServiceUpdatedEvent,
        oldProp: 'serviceId',
      },
    ];

    for (const m of mapping) {
      const newVal = (dto as any)[m.key];
      if (newVal && newVal !== old[m.oldProp]) {
        this.eventEmitter.emit(
          m.event,
          new (m.class as any)({
            caseId: id,
            [`old${m.key.charAt(0).toUpperCase() + m.key.slice(1)}`]:
              old[m.oldProp],
            [`new${m.key.charAt(0).toUpperCase() + m.key.slice(1)}`]: newVal,
          }),
        );
      }
    }
  }
}
