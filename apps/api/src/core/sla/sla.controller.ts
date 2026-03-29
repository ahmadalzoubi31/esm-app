import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Patch,
  Param,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SlaService } from './sla.service';
import { PoliciesGuard } from '../../common/guards/policies-guard.guard';
import { CheckPolicies } from '../../common/decorators/check-policies.decorator';
import { AppAbility } from '../casl/casl-ability.factory';
import { ACTION_ENUM } from '../casl/constants/action.constant';
import { SlaTarget } from './entities/sla-target.entity';
import { SlaTargetWriteDto } from './dto/write-target.dto';

@ApiTags('SLA')
@ApiBearerAuth()
@Controller('sla')
@UseGuards(PoliciesGuard)
export class SlaController {
  private readonly logger = new Logger(SlaController.name);

  constructor(private readonly slaService: SlaService) {
    this.logger.log('SlaController initialized');
  }

  @Post('targets')
  @ApiOperation({ summary: 'Create an SLA target' })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(ACTION_ENUM.Create, SlaTarget),
  )
  createTarget(@Body() dto: SlaTargetWriteDto) {
    this.logger.log('Creating SLA target');
    return this.slaService.createTarget(dto);
  }

  @Get('targets')
  @ApiOperation({ summary: 'List all SLA targets' })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(ACTION_ENUM.Read, SlaTarget),
  )
  listTargets() {
    this.logger.debug('Listing SLA targets');
    return this.slaService.listTargets();
  }

  @Get('targets/:id')
  @ApiOperation({ summary: 'Get an SLA target by ID' })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(ACTION_ENUM.Read, SlaTarget),
  )
  getTarget(@Param('id') id: string) {
    this.logger.debug(`Getting SLA target ${id}`);
    return this.slaService.getTarget(id);
  }

  @Patch('targets/:id')
  @ApiOperation({ summary: 'Update an SLA target' })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(ACTION_ENUM.Update, SlaTarget),
  )
  updateTarget(@Param('id') id: string, @Body() dto: SlaTargetWriteDto) {
    this.logger.log(`Updating SLA target ${id}`);
    return this.slaService.updateTarget(id, dto);
  }

  @Delete('targets/:id')
  @ApiOperation({ summary: 'Remove an SLA target' })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(ACTION_ENUM.Delete, SlaTarget),
  )
  removeTarget(@Param('id') id: string) {
    this.logger.log(`Removing SLA target ${id}`);
    return this.slaService.removeTarget(id);
  }
}
