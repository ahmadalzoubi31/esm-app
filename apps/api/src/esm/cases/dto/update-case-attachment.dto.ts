import { PartialType } from '@nestjs/swagger';
import { CreateCaseAttachmentDto } from './create-case-attachment.dto';

export class UpdateCaseAttachmentDto extends PartialType(
  CreateCaseAttachmentDto,
) {}
