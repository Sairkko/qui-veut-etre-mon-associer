import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../common/enums/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { Interest } from '../interests/entities/interest.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Récupérer tous les utilisateurs (admin uniquement)',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste de tous les utilisateurs',
    type: [User],
  })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({
    status: 403,
    description: 'Accès interdit - réservé aux administrateurs',
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Mettre à jour un utilisateur par son ID (admin uniquement)',
  })
  @ApiParam({ name: 'id', description: "Identifiant de l'utilisateur" })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur mis à jour avec succès',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 403, description: 'Accès interdit' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Supprimer un utilisateur' })
  @ApiParam({ name: 'id', description: "Identifiant de l'utilisateur" })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur supprimé avec succès',
  })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 403, description: 'Accès interdit' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Get('interests')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: "Récupérer les centres d'intérêt de l'utilisateur connecté",
  })
  @ApiResponse({
    status: 200,
    description: "Liste des centres d'intérêt de l'utilisateur",
    type: [Interest],
  })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  getUserInterests(@CurrentUser() user: User): Promise<Interest[]> {
    return this.usersService.findUserInterests(user.id);
  }

  @Post('interests')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: "Associer des centres d'intérêt à l'utilisateur connecté",
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        interestIds: {
          type: 'array',
          items: { type: 'string', format: 'uuid' },
          description: "Liste des identifiants des centres d'intérêt",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Centres d'intérêt associés avec succès",
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  addInterests(
    @CurrentUser() user: User,
    @Body() body: { interestIds: string[] },
  ) {
    return this.usersService.addInterests(user.id, body.interestIds);
  }
}
