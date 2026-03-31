import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { CaseAttachment } from './entities/case-attachment.entity';
import { Case } from './entities/case.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';

@Injectable()
export class CaseAttachmentsService {
  constructor(
    @InjectRepository(CaseAttachment)
    private readonly attachmentRepo: EntityRepository<CaseAttachment>,
    @InjectRepository(Case)
    private readonly caseRepo: EntityRepository<Case>,
  ) {}

  async uploadAttachment(
    caseId: string,
    file: Express.Multer.File,
  ): Promise<CaseAttachment> {
    // 1: Get EntityManager
    const em = this.attachmentRepo.getEntityManager();

    // 2: Verify case exists
    const caseEntity = await this.caseRepo.findOne({ id: caseId });
    if (!caseEntity) {
      throw new NotFoundException(`Case with ID ${caseId} not found`);
    }

    // 3: Get Tenant ID from Filter
    const tenantFilter = em.getFilterParams('tenant');

    // 4: Get Tenant Reference
    const tenantRef = em.getReference(Tenant, tenantFilter.tenantId);

    // 5: Verify Supabase configuration
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'Supabase configuration is missing in environment variables',
      );
    }

    // 6: Initialize Supabase client
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 7: Generate unique file path
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `case-attachments/${caseId}/${fileName}`;

    // 8: Upload file to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('attachments') // or whatever your bucket name is, assuming 'attachments'
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Failed to upload attachment: ${uploadError.message}`);
    }

    // 9: Get public URL for the uploaded file
    const {
      data: { publicUrl },
    } = supabase.storage.from('attachments').getPublicUrl(filePath);

    // 10: Create new attachment entity
    const newAttachment = this.attachmentRepo.create({
      case: caseId,
      tenant: tenantRef,
      filename: fileName,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      storagePath: publicUrl,
      isActive: true,
    });

    // 11: Persist attachment to database
    await em.persistAndFlush(newAttachment);
    return newAttachment;
  }

  async findAll(caseId: string): Promise<CaseAttachment[]> {
    // 1: Verify case exists
    const caseEntity = await this.caseRepo.count({ id: caseId });
    if (!caseEntity) {
      throw new NotFoundException(`Case with ID ${caseId} not found`);
    }

    // 2: Return all attachments for the case
    return this.attachmentRepo.findAll({
      where: { case: caseId },
      orderBy: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<CaseAttachment> {
    // 1: Find attachment by ID
    const attachment = await this.attachmentRepo.findOne(
      { id },
      { populate: ['case'] },
    );
    if (!attachment) {
      throw new NotFoundException(`Case attachment with ID ${id} not found`);
    }

    // 2: Return attachment
    return attachment;
  }

  async remove(id: string): Promise<void> {
    // 1: Fetch existing attachment
    const attachment = await this.findOne(id);
    const em = this.attachmentRepo.getEntityManager();

    // 2: Optional: Delete from Supabase storage here if required.

    // 3: Remove from database
    await em.removeAndFlush(attachment);
  }
}
