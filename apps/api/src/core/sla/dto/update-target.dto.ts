import { PartialType } from '@nestjs/mapped-types';
import { CreateSlaTargetDto } from './create-target.dto';

export class UpdateSlaTargetDto extends PartialType(CreateSlaTargetDto) {}
