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

@Controller('interests')
export class InterestsController {
  constructor(private readonly interestsService: InterestsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createInterestDto: CreateInterestDto) {
    return this.interestsService.create(createInterestDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.interestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.interestsService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.interestsService.remove(id);
  }
}
