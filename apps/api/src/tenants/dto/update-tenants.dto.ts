import { PartialType } from '@nestjs/mapped-types';
import { CreateTenantsDto } from './create-tenants.dto';

export class UpdateTenantsDto extends PartialType(CreateTenantsDto) {}
