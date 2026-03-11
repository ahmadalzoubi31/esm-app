import { PartialType } from '@nestjs/swagger';
import { CreateCaseCommentDto } from './create-case-comment.dto';

export class UpdateCaseCommentDto extends PartialType(CreateCaseCommentDto) {}
