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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { AssignRolesDto } from './dto/assign-roles.dto';
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
import { Role } from './entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';

@ApiTags('Roles')
@ApiBearerAuth()
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new role',
    description: 'Create a new role',
  })
  @ApiResponse({
    status: 201,
    description: 'The role has been successfully created.',
    type: Role,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(ACTION_ENUM.Create, Role))
  async create(@Body() createRoleDto: CreateRoleDto) {
    return await this.rolesService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Find all roles',
    description: 'Find all roles',
  })
  @ApiResponse({
    status: 200,
    description: 'Return all roles.',
    type: [Role],
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async findAll() {
    return await this.rolesService.findAll({});
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Find a role by id',
    description: 'Find a role by id',
  })
  @ApiResponse({
    status: 200,
    description: 'Return a role.',
    type: Role,
  })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async findOne(@Param('id') id: string) {
    return await this.rolesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a role by id',
    description: 'Update a role by id',
  })
  @ApiResponse({
    status: 200,
    description: 'The role has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(ACTION_ENUM.Update, Role))
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return await this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a role by id',
    description: 'Delete a role by id',
  })
  @ApiResponse({
    status: 200,
    description: 'The role has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(ACTION_ENUM.Delete, Role))
  async remove(@Param('id') id: string) {
    return await this.rolesService.remove(id);
  }

  @Get(':id/permissions')
  @ApiOperation({
    summary: 'Find permissions of a role',
    description: 'Find permissions of a role',
  })
  @ApiResponse({
    status: 200,
    description: 'Return permissions of a role.',
    type: [Permission],
  })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async findPermissions(@Param('id') id: string) {
    return await this.rolesService.findPermissions(id);
  }

  @Post(':id/permissions')
  @ApiOperation({
    summary: 'Assign permissions to a role',
    description: 'Assign multiple permissions to a role',
  })
  @ApiResponse({
    status: 200,
    description: 'Permissions assigned to role successfully.',
    type: Role,
  })
  @ApiResponse({ status: 404, description: 'Role or permissions not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(ACTION_ENUM.Update, Role))
  async assignPermissions(
    @Param('id') id: string,
    @Body() assignPermissionsDto: AssignPermissionsDto,
  ) {
    return await this.rolesService.assignPermissions(
      id,
      assignPermissionsDto.permissionIds,
    );
  }

  @Delete(':id/permissions')
  @ApiOperation({
    summary: 'Remove permissions from a role',
    description: 'Remove multiple permissions from a role',
  })
  @ApiResponse({
    status: 200,
    description: 'Permissions removed from role successfully.',
    type: Role,
  })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(ACTION_ENUM.Update, Role))
  async removePermissions(
    @Param('id') id: string,
    @Body() assignPermissionsDto: AssignPermissionsDto,
  ) {
    return await this.rolesService.removePermissions(
      id,
      assignPermissionsDto.permissionIds,
    );
  }

  @Post('user/:id')
  @ApiOperation({
    summary: 'Assign roles to a user',
    description: 'Assign multiple roles to a user',
  })
  @ApiResponse({
    status: 200,
    description: 'Roles assigned to user successfully.',
    type: Boolean,
  })
  @ApiResponse({ status: 404, description: 'User or roles not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(ACTION_ENUM.Update, Role))
  async assignRoles(
    @Param('id') userId: string,
    @Body() assignRolesDto: AssignRolesDto,
  ) {
    return await this.rolesService.assignRolesToUser(
      userId,
      assignRolesDto.roleIds,
    );
  }

  @Delete('user/:id')
  @ApiOperation({
    summary: 'Remove roles from a user',
    description: 'Remove multiple roles from a user',
  })
  @ApiResponse({
    status: 200,
    description: 'Roles removed from user successfully.',
    type: Boolean,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(ACTION_ENUM.Update, Role))
  async removeRoles(
    @Param('id') userId: string,
    @Body() assignRolesDto: AssignRolesDto,
  ) {
    return await this.rolesService.removeRolesFromUser(
      userId,
      assignRolesDto.roleIds,
    );
  }

  @Delete()
  @ApiOperation({
    summary: 'Delete bulk roles',
    description: 'Delete bulk roles.',
  })
  @ApiResponse({
    status: 200,
    description: 'Bulk roles have been successfully deleted.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(ACTION_ENUM.Delete, Role))
  async deleteBulk(@Body() ids: string[]) {
    return await this.rolesService.deleteBulk(ids);
  }
}
