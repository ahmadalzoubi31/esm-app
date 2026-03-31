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
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CheckPolicies } from 'src/common/decorators/check-policies.decorator';
import { PoliciesGuard } from 'src/common/guards/policies-guard.guard';
import { AppAbility } from '../casl/casl-ability.factory';
import { ACTION_ENUM } from '../casl/constants/action.constant';
import { Category } from '../categories/entities/category.entity';
import { Department } from './entities/department.entity';

@ApiTags('Departments')
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new department' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(ACTION_ENUM.Create, Department),
  )
  create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentsService.create(createDepartmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all departments' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(ACTION_ENUM.Read, Department),
  )
  findAll() {
    return this.departmentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a department by ID' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(ACTION_ENUM.Read, Department),
  )
  findOne(@Param('id') id: string) {
    return this.departmentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a department' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(ACTION_ENUM.Update, Department),
  )
  update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentsService.update(id, updateDepartmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a department' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(ACTION_ENUM.Delete, Department),
  )
  remove(@Param('id') id: string) {
    return this.departmentsService.remove(id);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete bulk departments' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(ACTION_ENUM.Delete, Department),
  )
  deleteBulk(@Body() ids: string[]) {
    return this.departmentsService.deleteBulk(ids);
  }
}
