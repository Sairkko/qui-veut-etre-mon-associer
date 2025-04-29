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

@Controller('investments')
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.INVESTOR)
  create(
    @Body() createInvestmentDto: CreateInvestmentDto,
    @CurrentUser() user: User,
  ) {
    return this.investmentsService.create(createInvestmentDto, user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.INVESTOR)
  findByInvestor(@CurrentUser() user: User) {
    return this.investmentsService.findByInvestor(user.id);
  }

  @Get('project/:id')
  @UseGuards(JwtAuthGuard)
  findByProject(@Param('id') id: string) {
    return this.investmentsService.findByProject(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.INVESTOR)
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.investmentsService.remove(id, user.id, user.role);
  }
}
