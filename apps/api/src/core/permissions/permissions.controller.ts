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
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { AssignUserPermissionsDto } from './dto/assign-user-permissions.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { PoliciesGuard } from '../../common/guards/policies-guard.guard';
import { CheckPolicies } from '../../common/decorators/check-policies.decorator';
import { AppAbility } from '../casl/casl-ability.factory';
import { ACTION_ENUM } from '../casl/constants/action.constant';
import { Permission } from './entities/permission.entity';

@ApiTags('Permissions')
@ApiBearerAuth()
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new permission',
    description: 'Create a new permission',
  })
  @ApiResponse({
    status: 201,
    description: 'The permission has been successfully created.',
    type: Permission,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    return await this.permissionsService.create(createPermissionDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Find all permissions',
    description: 'Find all permissions',
  })
  @ApiResponse({
    status: 200,
    description: 'Return all permissions.',
    type: [Permission],
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async findAll() {
    return await this.permissionsService.findAll({});
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Find a permission by id',
    description: 'Find a permission by id',
  })
  @ApiResponse({
    status: 200,
    description: 'Return a permission.',
    type: Permission,
  })
  @ApiResponse({ status: 404, description: 'Permission not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async findOne(@Param('id') id: string) {
    return await this.permissionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a permission by id',
    description: 'Update a permission by id',
  })
  @ApiResponse({
    status: 200,
    description: 'The permission has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Permission not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return await this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a permission by id',
    description: 'Delete a permission by id',
  })
  @ApiResponse({
    status: 200,
    description: 'The permission has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Permission not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async remove(@Param('id') id: string) {
    return await this.permissionsService.remove(id);
  }

  @Post('user/:id')
  @ApiOperation({
    summary: 'Assign permissions to a user',
    description: 'Assign multiple permissions to a user',
  })
  @ApiResponse({
    status: 200,
    description: 'Permissions assigned to user successfully.',
    type: Boolean,
  })
  @ApiResponse({ status: 404, description: 'User or permissions not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(ACTION_ENUM.Update, Permission),
  )
  async assignPermissions(
    @Param('id') userId: string,
    @Body() assignUserPermissionsDto: AssignUserPermissionsDto,
  ) {
    return await this.permissionsService.assignPermissionsToUser(
      userId,
      assignUserPermissionsDto.permissionIds,
    );
  }

  @Delete('user/:id')
  @ApiOperation({
    summary: 'Remove permissions from a user',
    description: 'Remove multiple permissions from a user',
  })
  @ApiResponse({
    status: 200,
    description: 'Permissions removed from user successfully.',
    type: Boolean,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(ACTION_ENUM.Update, Permission),
  )
  async removePermissions(
    @Param('id') userId: string,
    @Body() assignUserPermissionsDto: AssignUserPermissionsDto,
  ) {
    return await this.permissionsService.removePermissionsFromUser(
      userId,
      assignUserPermissionsDto.permissionIds,
    );
  }
}
