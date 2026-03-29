import { PartialType } from '@nestjs/mapped-types';
import { SlaTargetWriteDto } from './create-target.dto';

export class UpdateSlaTargetDto extends PartialType(SlaTargetWriteDto) {}
