import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { SeedService } from './seed.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(SeedModule);
  const seedService = appContext.get(SeedService);
  const logger = new Logger('Seed');

  try {
    logger.log('Démarrage du processus de seeding...');
    await seedService.seed();
    logger.log('Processus de seeding terminé avec succès !');
  } catch (error) {
    logger.error('Une erreur est survenue pendant le seeding');
    logger.error(error);
  } finally {
    await appContext.close();
  }
}

bootstrap();
