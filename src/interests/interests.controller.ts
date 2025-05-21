import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { InterestsService } from './interests.service';
import { CreateInterestDto } from './dto/create-interest.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Interest } from './entities/interest.entity';

@ApiTags('interests')
@Controller('interests')
export class InterestsController {
  constructor(private readonly interestsService: InterestsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: "Créer un nouveau centre d'intérêt" })
  @ApiResponse({
    status: 201,
    description: "Centre d'intérêt créé avec succès",
    type: Interest,
  })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 403, description: 'Accès interdit' })
  create(@Body() createInterestDto: CreateInterestDto) {
    return this.interestsService.create(createInterestDto);
  }

  @Get()
  @ApiOperation({ summary: "Récupérer tous les centres d'intérêt" })
  @ApiResponse({
    status: 200,
    description: "Liste de tous les centres d'intérêt",
    type: [Interest],
  })
  findAll() {
    return this.interestsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: "Récupérer un centre d'intérêt par son ID" })
  @ApiResponse({
    status: 200,
    description: "Centre d'intérêt trouvé",
    type: Interest,
  })
  @ApiResponse({ status: 404, description: "Centre d'intérêt non trouvé" })
  findOne(@Param('id') id: string) {
    return this.interestsService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: "Supprimer un centre d'intérêt" })
  @ApiResponse({
    status: 200,
    description: "Centre d'intérêt supprimé avec succès",
  })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 403, description: 'Accès interdit' })
  @ApiResponse({ status: 404, description: "Centre d'intérêt non trouvé" })
  remove(@Param('id') id: string) {
    return this.interestsService.remove(id);
  }
}
