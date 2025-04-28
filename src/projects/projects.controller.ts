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
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ENTREPRENEUR)
  create(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser() user: User,
  ) {
    return this.projectsService.create(createProjectDto, user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.projectsService.findAll();
  }

  @Get('recommended')
  @UseGuards(JwtAuthGuard)
  getRecommendedProjects(@CurrentUser() user: User) {
    return this.projectsService.getRecommendedProjects(user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ENTREPRENEUR)
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @CurrentUser() user: User,
  ) {
    return this.projectsService.update(
      id,
      updateProjectDto,
      user.id,
      user.role,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ENTREPRENEUR, Role.ADMIN)
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.projectsService.remove(id, user.id, user.role);
  }
}
