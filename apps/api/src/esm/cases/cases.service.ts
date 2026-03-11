import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { Case } from './entities/case.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { BusinessLine } from 'src/core/business-lines/entities/business-line.entity';
import { CaseCategory } from '../case-categories/entities/case-category.entity';
import { User } from '../../core/users/entities/user.entity';
import { CaseSubcategory } from '../case-subcategories/entities/case-subcategory.entity';
import { CasePriority } from './constants/case-priority.constant';
import { CaseStatus } from './constants/case-status.constant';
import { Group } from '../../core/groups/entities/group.entity';
import { Service } from '../catalog/services/entities/service.entity';

@Injectable()
export class CasesService {
  private async generateCaseNumber(): Promise<string> {
    const result = await this.caseRepo
      .getEntityManager()
      .getConnection()
      .execute("SELECT nextval('case_number_seq') as nextval");
    const nextval = result[0].nextval;
    return `CS-${String(nextval).padStart(6, '0')}`;
  }

  constructor(
    @InjectRepository(Case)
    private readonly caseRepo: EntityRepository<Case>,
    @InjectRepository(BusinessLine)
    private readonly businessLineRepo: EntityRepository<BusinessLine>,
    @InjectRepository(CaseCategory)
    private readonly categoryRepo: EntityRepository<CaseCategory>,
    @InjectRepository(CaseSubcategory)
    private readonly subcategoryRepo: EntityRepository<CaseSubcategory>,
    @InjectRepository(User)
    private readonly userRepo: EntityRepository<User>,
    @InjectRepository(Group)
    private readonly groupRepo: EntityRepository<Group>,
    @InjectRepository(Service)
    private readonly serviceRepo: EntityRepository<Service>,
  ) {}

  async create(dto: CreateCaseDto): Promise<Case> {
    // 1: Get EntityManager
    const em = this.caseRepo.getEntityManager();

    // 2: Get Tenant ID from Filter
    const tenantFilter = em.getFilterParams('tenant');

    // 3: Get Tenant Reference
    const tenantRef = em.getReference(Tenant, tenantFilter.tenantId);

    // 4: Set up reference validations
    const validations: { id?: string; repo: any; name: string }[] = [
      {
        id: dto.businessLineId,
        repo: this.businessLineRepo,
        name: 'Business line',
      },
      { id: dto.categoryId, repo: this.categoryRepo, name: 'Category' },
      {
        id: dto.subcategoryId,
        repo: this.subcategoryRepo,
        name: 'Subcategory',
      },
      { id: dto.requesterId, repo: this.userRepo, name: 'Requester' },
      { id: dto.assigneeId, repo: this.userRepo, name: 'Assignee' },
      {
        id: dto.assignmentGroupId,
        repo: this.groupRepo,
        name: 'Assignment group',
      },
      {
        id: dto.affectedServiceId,
        repo: this.serviceRepo,
        name: 'Affected service',
      },
    ];

    // 5: Run parallel existence checks
    await Promise.all(
      validations
        .filter((v) => v.id)
        .map(async ({ id, repo, name }) => {
          const exists = await repo.count({ id: id as string });
          if (!exists) throw new NotFoundException(`${name} not found`);
        }),
    );

    // 6: Create new case entity
    const newCase = this.caseRepo.create({
      ...dto,
      tenant: tenantRef,
      number: await this.generateCaseNumber(),
      status: dto.status ?? CaseStatus.NEW,
      priority: dto.priority ?? CasePriority.LOW,
      category: dto.categoryId,
      subcategory: dto.subcategoryId,
      requester: dto.requesterId,
      assignee: dto.assigneeId,
      assignmentGroup: dto.assignmentGroupId,
      businessLine: dto.businessLineId,
      affectedService: dto.affectedServiceId,
    });

    // 7: Persist case to database
    await this.caseRepo.getEntityManager().persist(newCase).flush();
    return newCase;
  }

  async findAll(): Promise<Case[]> {
    return this.caseRepo.findAll({
      populate: [
        'category',
        'requester',
        'assignee',
        'assignmentGroup',
        'businessLine',
        'affectedService',
      ],
    });
  }

  async findOne(id: string): Promise<Case> {
    const caseEntity = await this.caseRepo.findOne(
      { id },
      {
        populate: [
          'category',
          'requester',
          'assignee',
          'assignmentGroup',
          'businessLine',
          'affectedService',
        ],
      },
    );
    if (!caseEntity) {
      throw new NotFoundException(`Case with ID ${id} not found`);
    }
    return caseEntity;
  }

  async update(id: string, dto: UpdateCaseDto): Promise<Case> {
    // 1: Set up reference validations
    const validations: { id?: string; repo: any; name: string }[] = [
      { id: dto.categoryId, repo: this.categoryRepo, name: 'Category' },
      {
        id: dto.subcategoryId,
        repo: this.subcategoryRepo,
        name: 'Subcategory',
      },
      { id: dto.requesterId, repo: this.userRepo, name: 'Requester' },
      { id: dto.assigneeId, repo: this.userRepo, name: 'Assignee' },
      {
        id: dto.assignmentGroupId,
        repo: this.groupRepo,
        name: 'Assignment group',
      },
      {
        id: dto.businessLineId,
        repo: this.businessLineRepo,
        name: 'Business line',
      },
      {
        id: dto.affectedServiceId,
        repo: this.serviceRepo,
        name: 'Affected service',
      },
    ];

    // 2: Run parallel existence checks
    await Promise.all(
      validations
        .filter((v) => v.id)
        .map(async ({ id, repo, name }) => {
          const exists = await repo.count({ id: id as string });
          if (!exists) throw new NotFoundException(`${name} not found`);
        }),
    );

    // 3: Fetch existing case entity
    const caseEntity = await this.findOne(id);

    // 4: Destructure DTO properties
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

    // 5: Construct updates object
    const updates: any = { ...rest };
    if (category !== undefined) updates.category = category;
    if (subcategory !== undefined) updates.subcategory = subcategory;
    if (requester !== undefined) updates.requester = requester;
    if (assignee !== undefined) updates.assignee = assignee;
    if (assignmentGroup !== undefined)
      updates.assignmentGroup = assignmentGroup;
    if (businessLine !== undefined) updates.businessLine = businessLine;
    if (affectedService !== undefined)
      updates.affectedService = affectedService;
    if (requestCard !== undefined) updates.requestCard = requestCard;

    // 6: Assign updates to case entity
    this.caseRepo.assign(caseEntity, updates);

    // 7: Flush changes to database
    await this.caseRepo.getEntityManager().flush();
    return caseEntity;
  }

  async remove(id: string): Promise<void> {
    const caseEntity = await this.findOne(id);
    await this.caseRepo.getEntityManager().removeAndFlush(caseEntity);
  }
}
