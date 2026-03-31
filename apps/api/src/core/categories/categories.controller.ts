import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CheckPolicies } from 'src/common/decorators/check-policies.decorator';
import { PoliciesGuard } from 'src/common/guards/policies-guard.guard';
import { AppAbility } from '../casl/casl-ability.factory';
import { ACTION_ENUM } from '../casl/constants/action.constant';
import { Category } from './entities/category.entity';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Category' })
  @ApiResponse({
    status: 201,
    description: 'The category has been successfully created.',
  })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(ACTION_ENUM.Create, Category),
  )
  create(@Body() createDto: CreateCategoryDto) {
    return this.categoriesService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Categories' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(ACTION_ENUM.Read, Category),
  )
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a department by ID' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(ACTION_ENUM.Read, Category),
  )
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific Category' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(ACTION_ENUM.Update, Category),
  )
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(ACTION_ENUM.Delete, Category),
  )
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete bulk categories' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(ACTION_ENUM.Delete, Category),
  )
  deleteBulk(@Body() ids: string[]) {
    return this.categoriesService.deleteBulk(ids);
  }
}
