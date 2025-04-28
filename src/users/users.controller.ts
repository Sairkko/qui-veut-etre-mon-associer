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

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: User) {
    return user;
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  update(@CurrentUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(user.id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Get('interests')
  @UseGuards(JwtAuthGuard)
  getUserInterests(@CurrentUser() user: User): Promise<Interest[]> {
    return this.usersService.findUserInterests(user.id);
  }

  @Post('interests')
  @UseGuards(JwtAuthGuard)
  addInterests(
    @CurrentUser() user: User,
    @Body() body: { interestIds: string[] },
  ) {
    return this.usersService.addInterests(user.id, body.interestIds);
  }
}
