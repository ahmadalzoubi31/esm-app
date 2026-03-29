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
import { BusinessLineService } from './business-line.service';
import { CreateBusinessLineDto } from './dto/create-business-line.dto';
import { UpdateBusinessLineDto } from './dto/update-business-line.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger';
import { PoliciesGuard } from '../../common/guards/policies-guard.guard';
import { CheckPolicies } from '../../common/decorators/check-policies.decorator';
import { AppAbility } from '../casl/casl-ability.factory';
import { ACTION_ENUM } from '../casl/constants/action.constant';
import { BusinessLine } from './entities/business-line.entity';

@ApiTags('Business Line')
@ApiBearerAuth()
@Controller('business-line')
export class BusinessLineController {
  constructor(private readonly businessLineService: BusinessLineService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new business line',
    description: 'Create a new business line',
  })
  @ApiResponse({
    status: 201,
    description: 'The business line has been successfully created.',
    type: BusinessLine,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(ACTION_ENUM.Create, BusinessLine),
  )
  async create(@Body() createBusinessLineDto: CreateBusinessLineDto) {
    return await this.businessLineService.create(createBusinessLineDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Return all business lines.',
    type: [BusinessLine],
  })
  async findAll() {
    return await this.businessLineService.findAll({});
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Return a business line.',
    type: BusinessLine,
  })
  @ApiResponse({ status: 404, description: 'Business line not found.' })
  async findOne(@Param('id') id: string) {
    return await this.businessLineService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'The business line has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Business line not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateBusinessLineDto: UpdateBusinessLineDto,
  ) {
    return await this.businessLineService.update(id, updateBusinessLineDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'The business line has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Business line not found.' })
  async remove(@Param('id') id: string) {
    return await this.businessLineService.remove(id);
  }
}
