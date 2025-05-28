import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
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
import { Investment } from './entities/investment.entity';

@ApiTags('investments')
@Controller('investments')
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.INVESTOR, Role.ADMIN)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Créer un nouvel investissement' })
  @ApiBody({ type: CreateInvestmentDto })
  @ApiResponse({
    status: 201,
    description: 'Investissement créé avec succès',
    type: Investment,
  })
  @ApiResponse({
    status: 400,
    description:
      'Données invalides ou vous ne pouvez pas investir dans votre propre projet',
  })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({
    status: 403,
    description: 'Accès interdit - seuls les investisseurs peuvent investir',
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur ou projet non trouvé',
  })
  create(
    @Body() createInvestmentDto: CreateInvestmentDto,
    @CurrentUser() user: User,
  ) {
    return this.investmentsService.create(createInvestmentDto, user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.INVESTOR, Role.ADMIN)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: "Récupérer les investissements de l'utilisateur connecté",
  })
  @ApiResponse({
    status: 200,
    description: "Liste des investissements de l'utilisateur",
    type: [Investment],
  })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({
    status: 403,
    description:
      'Accès interdit - réservé aux investisseurs et administrateurs',
  })
  findByInvestor(@CurrentUser() user: User) {
    return this.investmentsService.findByInvestor(user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Récupérer tous les investissements (admin uniquement)',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste de tous les investissements',
    type: [Investment],
  })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({
    status: 403,
    description: 'Accès interdit - réservé aux administrateurs',
  })
  findAll() {
    return this.investmentsService.findAll();
  }

  @Get('project/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Récupérer les investissements pour un projet spécifique',
  })
  @ApiParam({ name: 'id', description: 'Identifiant du projet' })
  @ApiResponse({
    status: 200,
    description: 'Liste des investissements pour le projet',
    type: [Investment],
  })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 404, description: 'Projet non trouvé' })
  findByProject(@Param('id') id: string) {
    return this.investmentsService.findByProject(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.INVESTOR, Role.ADMIN)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Supprimer un investissement' })
  @ApiParam({ name: 'id', description: "Identifiant de l'investissement" })
  @ApiResponse({
    status: 200,
    description: 'Investissement supprimé avec succès',
  })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({
    status: 403,
    description:
      'Accès interdit - vous ne pouvez supprimer que vos propres investissements',
  })
  @ApiResponse({ status: 404, description: 'Investissement non trouvé' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.investmentsService.remove(id, user.id, user.role);
  }
}
