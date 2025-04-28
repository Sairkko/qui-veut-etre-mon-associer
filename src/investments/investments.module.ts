import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestmentsService } from './investments.service';
import { InvestmentsController } from './investments.controller';
import { Investment } from './entities/investment.entity';
import { ProjectsModule } from '../projects/projects.module';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Investment, User]), ProjectsModule],
  controllers: [InvestmentsController],
  providers: [InvestmentsService],
  exports: [InvestmentsService],
})
export class InvestmentsModule {}
