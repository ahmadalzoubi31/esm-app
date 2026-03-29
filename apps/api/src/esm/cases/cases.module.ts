import { Module } from '@nestjs/common';
import { CasesService } from './cases.service';
import { CasesController } from './cases.controller';
import { CaseCommentsController } from './case-comments.controller';
import { CaseCommentsService } from './case-comments.service';
import { CaseAttachmentsController } from './case-attachments.controller';
import { CaseAttachmentsService } from './case-attachments.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Case } from './entities/case.entity';
import { BusinessLine } from '../../core/business-lines/entities/business-line.entity';
import { Category } from '../../core/categories/entities/category.entity';
import { User } from '../../core/users/entities/user.entity';
import { Group } from '../../core/groups/entities/group.entity';
import { Service } from '../catalog/services/entities/service.entity';
import { CaseComment } from './entities/case-comment.entity';
import { CaseAttachment } from './entities/case-attachment.entity';
import { CaslAbilityFactory } from '../../core/casl/casl-ability.factory';
import { PermissionsModule } from '../../core/permissions/permissions.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Case,
      BusinessLine,
      Category,
      User,
      Group,
      Service,
      CaseComment,
      CaseAttachment,
    ]),
    PermissionsModule,
  ],
  controllers: [
    CasesController,
    CaseCommentsController,
    CaseAttachmentsController,
  ],
  providers: [
    CasesService,
    CaseCommentsService,
    CaseAttachmentsService,
    CaslAbilityFactory,
  ],
})
export class CasesModule {}
