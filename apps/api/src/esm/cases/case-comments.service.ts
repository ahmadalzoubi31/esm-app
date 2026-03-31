import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { CaseComment } from './entities/case-comment.entity';
import { CreateCaseCommentDto } from './dto/create-case-comment.dto';
import { UpdateCaseCommentDto } from './dto/update-case-comment.dto';
import { Case } from './entities/case.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';

@Injectable()
export class CaseCommentsService {
  constructor(
    @InjectRepository(CaseComment)
    private readonly commentRepo: EntityRepository<CaseComment>,
    @InjectRepository(Case)
    private readonly caseRepo: EntityRepository<Case>,
  ) {}

  async create(
    caseId: string,
    dto: CreateCaseCommentDto,
  ): Promise<CaseComment> {
    // 1: Get EntityManager
    const em = this.commentRepo.getEntityManager();

    // 2: Verify case exists
    const caseEntity = await this.caseRepo.findOne({ id: caseId });
    if (!caseEntity) {
      throw new NotFoundException(`Case with ID ${caseId} not found`);
    }

    // 3: Get Tenant ID from Filter
    const tenantFilter = em.getFilterParams('tenant');

    // 4: Get Tenant Reference
    const tenantRef = em.getReference(Tenant, tenantFilter.tenantId);
    console.log('🚀 ~ CaseCommentsService ~ create ~ tenantRef:', tenantRef);

    // 5: Create new comment entity
    const newComment = this.commentRepo.create({
      case: caseEntity,
      body: dto.body,
      isPrivate: dto.isPrivate,
      tenant: tenantRef,
      isActive: true,
    });

    // 6: Persist comment to database
    await em.persist(newComment).flush();
    return newComment;
  }

  async findAll(caseId: string): Promise<CaseComment[]> {
    // 1: Verify case exists
    const caseExists = await this.caseRepo.count({ id: caseId });
    if (!caseExists) {
      throw new NotFoundException(`Case with ID ${caseId} not found`);
    }

    // 2: Return all comments for the case
    return this.commentRepo.findAll({
      where: { case: caseId },
      orderBy: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<CaseComment> {
    // 1: Find comment by ID
    const comment = await this.commentRepo.findOne(
      { id },
      { populate: ['case'] },
    );
    if (!comment) {
      throw new NotFoundException(`Case comment with ID ${id} not found`);
    }
    // 2: Return comment
    return comment;
  }

  async update(id: string, dto: UpdateCaseCommentDto): Promise<CaseComment> {
    // 1: Fetch existing comment
    const comment = await this.findOne(id);

    // 2: Assign updates to comment entity
    this.commentRepo.assign(comment, dto);

    // 3: Flush changes to database
    await this.commentRepo.getEntityManager().flush();
    return comment;
  }

  async remove(id: string): Promise<void> {
    // 1: Fetch existing comment
    const comment = await this.findOne(id);

    // 2: Remove from database
    await this.commentRepo.getEntityManager().removeAndFlush(comment);
  }
}
