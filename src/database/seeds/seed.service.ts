import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker/locale/fr';
import * as bcrypt from 'bcrypt';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';
import { Interest } from '../../interests/entities/interest.entity';
import { Investment } from '../../investments/entities/investment.entity';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(Interest)
    private interestsRepository: Repository<Interest>,
    @InjectRepository(Investment)
    private investmentsRepository: Repository<Investment>,
  ) {}

  async seed() {
    this.logger.log('🌱 Démarrage du seeding...');

    // Nettoyer la base de données
    await this.clean();

    // Créer les centres d'intérêt
    const interests = await this.seedInterests();

    // Créer les utilisateurs
    const users = await this.seedUsers(interests);

    // Créer les projets
    const projects = await this.seedProjects(users.entrepreneurs);

    // Créer les investissements
    await this.seedInvestments(users.investors, projects);

    this.logger.log('✅ Seeding terminé avec succès !');
  }

  private async clean() {
    this.logger.log('🧹 Nettoyage de la base de données...');

    await this.investmentsRepository.delete({});
    await this.projectsRepository.delete({});

    // Suppression des relations many-to-many avant de supprimer les entités
    const users = await this.usersRepository.find({ relations: ['interests'] });
    for (const user of users) {
      user.interests = [];
      await this.usersRepository.save(user);
    }

    await this.usersRepository.delete({});
    await this.interestsRepository.delete({});

    this.logger.log('✅ Base de données nettoyée');
  }

  private async seedInterests(): Promise<Interest[]> {
    this.logger.log("🔖 Création des centres d'intérêt...");

    const interestsData = [
      {
        name: 'Technologie',
        description: "Projets liés à la technologie et l'informatique",
      },
      {
        name: 'Finance',
        description: 'Projets liés à la finance et aux investissements',
      },
      {
        name: 'Santé',
        description: 'Projets dans le domaine de la santé et du bien-être',
      },
      {
        name: 'Écologie',
        description: 'Projets écologiques et développement durable',
      },
      {
        name: 'Éducation',
        description: "Projets liés à l'éducation et la formation",
      },
      {
        name: 'Alimentation',
        description: "Projets dans le domaine de l'alimentation",
      },
      {
        name: 'Transport',
        description: 'Projets liés aux transports et à la mobilité',
      },
      {
        name: 'Immobilier',
        description: 'Projets dans le secteur immobilier',
      },
      {
        name: 'Tourisme',
        description: 'Projets liés au tourisme et aux voyages',
      },
      {
        name: 'Mode',
        description: "Projets dans l'univers de la mode et du textile",
      },
    ];

    const interests: Interest[] = [];

    for (const interestData of interestsData) {
      const interest = this.interestsRepository.create(interestData);
      interests.push(await this.interestsRepository.save(interest));
    }

    this.logger.log(`✅ ${interests.length} centres d'intérêt créés`);

    return interests;
  }

  private async seedUsers(
    interests: Interest[],
  ): Promise<{ entrepreneurs: User[]; investors: User[]; admin: User }> {
    this.logger.log('👥 Création des utilisateurs...');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // Créer un admin
    const admin = this.usersRepository.create({
      firstName: 'Admin',
      lastName: 'Système',
      email: 'admin@example.com',
      password: hashedPassword,
      role: Role.ADMIN,
      interests: this.getRandomSubarray(
        interests,
        faker.number.int({ min: 2, max: 5 }),
      ),
    });

    await this.usersRepository.save(admin);

    // Créer des entrepreneurs
    const entrepreneurs: User[] = [];

    for (let i = 0; i < 10; i++) {
      const entrepreneur = this.usersRepository.create({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email({
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
        }),
        password: hashedPassword,
        role: Role.ENTREPRENEUR,
        interests: this.getRandomSubarray(
          interests,
          faker.number.int({ min: 1, max: 5 }),
        ),
      });

      entrepreneurs.push(await this.usersRepository.save(entrepreneur));
    }

    // Créer des investisseurs
    const investors: User[] = [];

    for (let i = 0; i < 8; i++) {
      const investor = this.usersRepository.create({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email({
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
        }),
        password: hashedPassword,
        role: Role.INVESTOR,
        interests: this.getRandomSubarray(
          interests,
          faker.number.int({ min: 1, max: 5 }),
        ),
      });

      investors.push(await this.usersRepository.save(investor));
    }

    this.logger.log(
      `✅ ${entrepreneurs.length + investors.length + 1} utilisateurs créés`,
    );
    return { entrepreneurs, investors, admin };
  }

  private async seedProjects(entrepreneurs: User[]): Promise<Project[]> {
    this.logger.log('📋 Création des projets...');

    const projectCategories = [
      'Application Mobile',
      'Site Web',
      'E-commerce',
      'Fintech',
      'Greentech',
      'Healthtech',
      'Edtech',
      'Foodtech',
      'Transport',
      'Immobilier',
      'Tourisme',
      'Mode',
    ];

    const projects: Project[] = [];

    // Chaque entrepreneur crée entre 1 et 3 projets
    for (const entrepreneur of entrepreneurs) {
      const numProjects = faker.number.int({ min: 1, max: 3 });

      for (let i = 0; i < numProjects; i++) {
        const project = this.projectsRepository.create({
          title: faker.company.name(),
          description:
            faker.company.catchPhrase() + '. ' + faker.lorem.paragraphs(2),
          budget: faker.number.float({
            min: 10000,
            max: 1000000,
            fractionDigits: 2,
          }),
          category: faker.helpers.arrayElement(projectCategories),
          ownerId: entrepreneur.id,
        });

        projects.push(await this.projectsRepository.save(project));
      }
    }

    this.logger.log(`✅ ${projects.length} projets créés`);

    return projects;
  }

  private async seedInvestments(
    investors: User[],
    projects: Project[],
  ): Promise<void> {
    this.logger.log('💰 Création des investissements...');

    const investments: Investment[] = [];

    // Chaque investisseur investit dans plusieurs projets
    for (const investor of investors) {
      const numInvestments = faker.number.int({ min: 2, max: 8 });
      const investmentProjects = this.getRandomSubarray(
        projects,
        numInvestments,
      );

      for (const project of investmentProjects) {
        // S'assurer que l'investisseur n'investit pas dans son propre projet
        if (project.ownerId !== investor.id) {
          const investment = this.investmentsRepository.create({
            investorId: investor.id,
            projectId: project.id,
            amount: faker.number.float({
              min: 1000,
              max: project.budget / 2,
              fractionDigits: 2,
            }),
          });

          investments.push(await this.investmentsRepository.save(investment));
        }
      }
    }

    this.logger.log(`✅ ${investments.length} investissements créés`);
  }

  private getRandomSubarray<T>(arr: T[], size: number): T[] {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, size);
  }
}
