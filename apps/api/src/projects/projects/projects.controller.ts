import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';

@ApiTags('projects')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'List all projects' })
  findAll(@Req() req: any) { return this.projectsService.findAll(req.user.tenantId); }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project with its tasks' })
  findOne(@Req() req: any, @Param('id') id: string) { return this.projectsService.findOne(req.user.tenantId, id); }

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  create(@Req() req: any, @Body() body: any) { return this.projectsService.create(req.user.tenantId, body); }
}
