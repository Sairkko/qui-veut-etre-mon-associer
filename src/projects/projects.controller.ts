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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { Project } from './entities/project.entity';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ENTREPRENEUR, Role.ADMIN)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Créer un nouveau projet' })
  @ApiBody({ type: CreateProjectDto })
  @ApiResponse({
    status: 201,
    description: 'Projet créé avec succès',
    type: Project,
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 403, description: 'Accès interdit' })
  create(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser() user: User,
  ) {
    return this.projectsService.create(createProjectDto, user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Récupérer tous les projets' })
  @ApiResponse({
    status: 200,
    description: 'Liste de tous les projets',
    type: [Project],
  })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  findAll() {
    return this.projectsService.findAll();
  }

  @Get('recommended')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: "Récupérer les projets recommandés pour l'utilisateur",
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des projets recommandés',
    type: [Project],
  })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  getRecommendedProjects(@CurrentUser() user: User) {
    return this.projectsService.getRecommendedProjects(user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Récupérer un projet par son ID' })
  @ApiParam({ name: 'id', description: 'Identifiant du projet' })
  @ApiResponse({
    status: 200,
    description: 'Projet trouvé',
    type: Project,
  })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 404, description: 'Projet non trouvé' })
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ENTREPRENEUR, Role.ADMIN)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Mettre à jour un projet' })
  @ApiParam({ name: 'id', description: 'Identifiant du projet' })
  @ApiBody({ type: UpdateProjectDto })
  @ApiResponse({
    status: 200,
    description: 'Projet mis à jour avec succès',
    type: Project,
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 403, description: 'Accès interdit' })
  @ApiResponse({ status: 404, description: 'Projet non trouvé' })
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
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Supprimer un projet' })
  @ApiParam({ name: 'id', description: 'Identifiant du projet' })
  @ApiResponse({
    status: 200,
    description: 'Projet supprimé avec succès',
  })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 403, description: 'Accès interdit' })
  @ApiResponse({ status: 404, description: 'Projet non trouvé' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.projectsService.remove(id, user.id, user.role);
  }
}
