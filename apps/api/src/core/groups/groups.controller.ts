import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CheckPolicies } from 'src/common/decorators/check-policies.decorator';
import { PoliciesGuard } from 'src/common/guards/policies-guard.guard';
import { AppAbility } from '../casl/casl-ability.factory';
import { ACTION_ENUM } from '../casl/constants/action.constant';
import { Group } from './entities/group.entity';
import { caslToMikroOrm } from '../casl/casl-mikroorm.adapter';

@ApiTags('Groups')
@ApiBearerAuth()
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new group',
    description: 'Create a new group',
  })
  @ApiResponse({
    status: 201,
    description: 'The group has been successfully created.',
    type: Group,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(ACTION_ENUM.Create, Group),
  )
  async create(@Body() createGroupDto: CreateGroupDto) {
    return await this.groupsService.create(createGroupDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Return all groups.',
    type: [Group],
  })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(ACTION_ENUM.Manage, Group),
  )
  async findAll(@Req() req: any) {
    // 1.  Get the user's ability
    const where = caslToMikroOrm(req.ability, ACTION_ENUM.Manage, Group);
    // 2. Return the results
    return await this.groupsService.findAll({ where });
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Return a group.',
    type: Group,
  })
  @ApiResponse({ status: 404, description: 'Group not found.' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(ACTION_ENUM.Read, Group))
  async findOne(@Param('id') id: string, @Req() req: any) {
    // 1.  Get the user's ability
    const abilityConditions = caslToMikroOrm(
      req.ability,
      ACTION_ENUM.Read,
      Group,
    );

    // 2. Add the id to the where clause
    const where = abilityConditions ? { ...abilityConditions, id } : { id };

    // 3. Return the results
    return await this.groupsService.findAll({ where });
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'The group has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Group not found.' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(ACTION_ENUM.Update, Group),
  )
  async update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return await this.groupsService.update(id, updateGroupDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'The group has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Group not found.' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(ACTION_ENUM.Delete, Group),
  )
  async remove(@Param('id') id: string) {
    return await this.groupsService.remove(id);
  }

  @Delete()
  @ApiOperation({
    summary: 'Delete bulk groups',
    description: 'Delete bulk groups.',
  })
  @ApiResponse({
    status: 200,
    description: 'Bulk users have been successfully deleted.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(ACTION_ENUM.Delete, Group),
  )
  async deleteBulk(@Body() ids: string[]) {
    return await this.groupsService.deleteBulk(ids);
  }
}
