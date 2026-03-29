import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiConsumes,
} from '@nestjs/swagger';
import { CaseAttachmentsService } from './case-attachments.service';
import { CaseAttachment } from './entities/case-attachment.entity';
import { PoliciesGuard } from '../../common/guards/policies-guard.guard';
import { CheckPolicies } from '../../common/decorators/check-policies.decorator';
import { AppAbility } from '../../core/casl/casl-ability.factory';
import { ACTION_ENUM } from '../../core/casl/constants/action.constant';

@ApiTags('Cases - Attachments')
@ApiBearerAuth()
@Controller('cases/:caseId/attachments')
export class CaseAttachmentsController {
  constructor(
    private readonly caseAttachmentsService: CaseAttachmentsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Upload a case attachment',
    description: 'Upload a file as an attachment to a specific case.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'The attachment has been successfully uploaded.',
    type: CaseAttachment,
  })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(ACTION_ENUM.Create, CaseAttachment),
  )
  @UseInterceptors(FileInterceptor('file'))
  async uploadAttachment(
    @Param('caseId') caseId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error('File is required');
    }
    return await this.caseAttachmentsService.uploadAttachment(caseId, file);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all attachments for a case',
    description: 'Retrieve all attachments associated with a case.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all attachments for the case.',
    type: [CaseAttachment],
  })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(ACTION_ENUM.Read, CaseAttachment),
  )
  async findAll(@Param('caseId') caseId: string) {
    return await this.caseAttachmentsService.findAll(caseId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a case attachment',
    description: 'Retrieve a specific case attachment by ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the case attachment.',
    type: CaseAttachment,
  })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(ACTION_ENUM.Read, CaseAttachment),
  )
  async findOne(@Param('id') id: string) {
    return await this.caseAttachmentsService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a case attachment',
    description: 'Delete a specific attachment by id.',
  })
  @ApiResponse({
    status: 200,
    description: 'The attachment has been successfully deleted.',
  })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(ACTION_ENUM.Delete, CaseAttachment),
  )
  async remove(@Param('caseId') caseId: string, @Param('id') id: string) {
    return await this.caseAttachmentsService.remove(id);
  }
}
