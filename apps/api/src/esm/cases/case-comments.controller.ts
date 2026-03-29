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
import { CaseCommentsService } from './case-comments.service';
import { CreateCaseCommentDto } from './dto/create-case-comment.dto';
import { UpdateCaseCommentDto } from './dto/update-case-comment.dto';
import { CaseComment } from './entities/case-comment.entity';
import { PoliciesGuard } from '../../common/guards/policies-guard.guard';
import { CheckPolicies } from '../../common/decorators/check-policies.decorator';
import { AppAbility } from '../../core/casl/casl-ability.factory';
import { ACTION_ENUM } from '../../core/casl/constants/action.constant';

@ApiTags('Cases - Comments')
@ApiBearerAuth()
@Controller('cases/:caseId/comments')
export class CaseCommentsController {
  constructor(private readonly caseCommentsService: CaseCommentsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a case comment',
    description: 'Add a comment to a specific case.',
  })
  @ApiResponse({
    status: 201,
    description: 'The comment has been successfully created.',
    type: CaseComment,
  })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(ACTION_ENUM.Create, CaseComment),
  )
  async create(
    @Param('caseId') caseId: string,
    @Body() createCaseCommentDto: CreateCaseCommentDto,
  ) {
    return await this.caseCommentsService.create(caseId, createCaseCommentDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all comments for a case',
    description: 'Retrieve all comments associated with a case.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all comments for the case.',
    type: [CaseComment],
  })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(ACTION_ENUM.Read, CaseComment),
  )
  async findAll(@Param('caseId') caseId: string) {
    return await this.caseCommentsService.findAll(caseId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a case comment',
    description: 'Update a specific comment by id.',
  })
  @ApiResponse({
    status: 200,
    description: 'The comment has been successfully updated.',
  })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(ACTION_ENUM.Update, CaseComment),
  )
  async update(
    @Param('caseId') caseId: string,
    @Param('id') id: string,
    @Body() updateCaseCommentDto: UpdateCaseCommentDto,
  ) {
    // caseId can be used for extra validation if needed
    return await this.caseCommentsService.update(id, updateCaseCommentDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a case comment',
    description: 'Delete a specific comment by id.',
  })
  @ApiResponse({
    status: 200,
    description: 'The comment has been successfully deleted.',
  })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(ACTION_ENUM.Delete, CaseComment),
  )
  async remove(@Param('caseId') caseId: string, @Param('id') id: string) {
    // caseId can be used for extra validation if needed
    return await this.caseCommentsService.remove(id);
  }
}
