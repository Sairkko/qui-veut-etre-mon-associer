import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { InvestmentsModule } from '../investments/investments.module';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [UsersModule, InvestmentsModule, ProjectsModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
