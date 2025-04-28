import { Controller, Post, UseGuards } from '@nestjs/common';
import { SeedService } from './seed.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('seeds')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async seed() {
    await this.seedService.seed();
    return { message: 'Base de données peuplée avec succès !' };
  }
}
