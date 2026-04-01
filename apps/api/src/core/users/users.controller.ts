import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BulkUpdateUserDto } from './dto/bulk-update-user.dto';
import { UsersService } from './users.service';
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
import { User } from './entities/user.entity';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a user',
  })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(ACTION_ENUM.Create, User))
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Post('avatar/upload')
  @ApiOperation({
    summary: 'Upload avatar',
    description: 'Upload an avatar image to storage and get the public URL.',
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(ACTION_ENUM.Create, User))
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(@UploadedFile() file: File) {
    // 1: Check if file is uploaded
    if (!file) {
      throw new Error('File is required');
    }
    // 2: Upload file to Supabase storage
    const url = await this.usersService.uploadAvatar(file);
    // 3: Return public URL
    return { url };
  }

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Get all users.',
  })
  @ApiResponse({
    status: 200,
    description: 'Return all users.',
    type: [User],
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(ACTION_ENUM.Read, User))
  async findAll(
    @Query('search') search?: string,
    @Query('isLicensed') isLicensed?: boolean | string,
  ) {
    const where: any = {};
    if (isLicensed !== undefined) {
      where.isLicensed = isLicensed === 'true' || isLicensed === true;
    }
    return await this.usersService.findAll({ search, where });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a user',
    description: 'Get a user by id.',
  })
  @ApiResponse({
    status: 200,
    description: 'Return a user.',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(ACTION_ENUM.Read, User))
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a user',
    description: 'Update a user by id.',
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(ACTION_ENUM.Update, User))
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a user',
    description: 'Delete a user by id.',
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(ACTION_ENUM.Delete, User))
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(id);
  }

  // @Patch()
  // @ApiOperation({
  //   summary: 'Update bulk users',
  //   description: 'Update bulk users.',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Bulk users have been successfully updated.',
  // })
  // @ApiResponse({ status: 400, description: 'Bad Request.' })
  // @ApiResponse({ status: 403, description: 'Forbidden.' })
  // @UseGuards(PoliciesGuard)
  // @CheckPolicies((ability: AppAbility) => ability.can(ACTION_ENUM.Update, User))
  // async updateBulk(@Body() bulkUpdateDto: BulkUpdateUserDto) {
  //   return await this.usersService.updateBulk(
  //     bulkUpdateDto.ids,
  //     bulkUpdateDto.data,
  //   );
  // }

  @Delete()
  @ApiOperation({
    summary: 'Delete bulk users',
    description: 'Delete bulk users.',
  })
  @ApiResponse({
    status: 200,
    description: 'Bulk users have been successfully deleted.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(ACTION_ENUM.Delete, User))
  async deleteBulk(@Body() ids: string[]) {
    return await this.usersService.deleteBulk(ids);
  }
}
