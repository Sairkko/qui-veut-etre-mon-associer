import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';
import { Interest } from '../../interests/entities/interest.entity';
import { Investment } from '../../investments/entities/investment.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 8889),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', 'root'),
        database: configService.get('DB_DATABASE', 'qui_veut_etre_mon_associe'),
        entities: [User, Project, Interest, Investment],
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE', true),
      }),
    }),
    TypeOrmModule.forFeature([User, Project, Interest, Investment]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
