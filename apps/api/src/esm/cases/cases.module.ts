import { Module } from '@nestjs/common';
import { CasesService } from './cases.service';
import { CasesController } from './cases.controller';
import { CaseCommentsController } from './case-comments.controller';
import { CaseCommentsService } from './case-comments.service';
import { CaseAttachmentsController } from './case-attachments.controller';
import { CaseAttachmentsService } from './case-attachments.service';

@Module({
  controllers: [
    CasesController,
    CaseCommentsController,
    CaseAttachmentsController,
  ],
  providers: [CasesService, CaseCommentsService, CaseAttachmentsService],
})
export class CasesModule {}
