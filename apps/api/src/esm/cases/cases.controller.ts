import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CasesService } from './cases.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { Case } from './entities/case.entity';
import { PoliciesGuard } from '../../common/guards/policies-guard.guard';
import { CheckPolicies } from '../../common/decorators/check-policies.decorator';
import { AppAbility } from '../../core/casl/casl-ability.factory';
import { ACTION_ENUM } from '../../core/casl/constants/action.constant';

@ApiTags('Cases')
@ApiBearerAuth()
@Controller('cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a case',
    description: 'Create a new case.',
  })
  @ApiResponse({
    status: 201,
    description: 'The case has been successfully created.',
    type: Case,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(ACTION_ENUM.Create, Case))
  async create(@Body() createCaseDto: CreateCaseDto) {
    return await this.casesService.create(createCaseDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all cases',
    description: 'Get all cases.',
  })
  @ApiResponse({
    status: 200,
    description: 'Return all cases.',
    type: [Case],
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(ACTION_ENUM.Read, Case))
  async findAll() {
    return await this.casesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a case',
    description: 'Get a case by id.',
  })
  @ApiResponse({
    status: 200,
    description: 'Return a case.',
    type: Case,
  })
  @ApiResponse({ status: 404, description: 'Case not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(ACTION_ENUM.Read, Case))
  async findOne(@Param('id') id: string) {
    return await this.casesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a case',
    description: 'Update a case by id.',
  })
  @ApiResponse({
    status: 200,
    description: 'The case has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Case not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(ACTION_ENUM.Update, Case))
  async update(@Param('id') id: string, @Body() updateCaseDto: UpdateCaseDto) {
    return await this.casesService.update(id, updateCaseDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a case',
    description: 'Delete a case by id.',
  })
  @ApiResponse({
    status: 200,
    description: 'The case has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Case not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(ACTION_ENUM.Delete, Case))
  async remove(@Param('id') id: string) {
    return await this.casesService.remove(id);
  }
}
