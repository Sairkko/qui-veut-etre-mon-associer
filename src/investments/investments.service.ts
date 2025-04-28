import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Investment } from './entities/investment.entity';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { ProjectsService } from '../projects/projects.service';
import { Role } from '../common/enums/role.enum';
import { User } from '../users/entities/user.entity';

@Injectable()
export class InvestmentsService {
  constructor(
    @InjectRepository(Investment)
    private investmentsRepository: Repository<Investment>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private projectsService: ProjectsService,
  ) {}

  async create(
    createInvestmentDto: CreateInvestmentDto,
    userId: string,
  ): Promise<Investment> {
    // Vérifier que l'utilisateur est un investisseur
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
    }

    if (user.role !== Role.INVESTOR) {
      throw new ForbiddenException(
        'Seuls les investisseurs peuvent investir dans un projet',
      );
    }

    // Vérifier que le projet existe
    const project = await this.projectsService.findOne(
      createInvestmentDto.projectId,
    );

    // Un investisseur ne peut pas investir dans son propre projet
    if (project.ownerId === userId) {
      throw new BadRequestException(
        'Vous ne pouvez pas investir dans votre propre projet',
      );
    }

    // Créer l'investissement
    const investment = this.investmentsRepository.create({
      ...createInvestmentDto,
      investorId: userId,
    });

    return this.investmentsRepository.save(investment);
  }

  async findAll(): Promise<Investment[]> {
    return this.investmentsRepository.find({
      relations: ['investor', 'project'],
    });
  }

  async findOne(id: string): Promise<Investment> {
    const investment = await this.investmentsRepository.findOne({
      where: { id },
      relations: ['investor', 'project'],
    });

    if (!investment) {
      throw new NotFoundException(`Investissement avec l'ID ${id} non trouvé`);
    }

    return investment;
  }

  async findByInvestor(userId: string): Promise<Investment[]> {
    return this.investmentsRepository.find({
      where: { investorId: userId },
      relations: ['project', 'project.owner'],
    });
  }

  async findByProject(projectId: string): Promise<Investment[]> {
    return this.investmentsRepository.find({
      where: { projectId },
      relations: ['investor'],
    });
  }

  async remove(id: string, userId: string, userRole: Role): Promise<void> {
    const investment = await this.findOne(id);

    // Vérifier si l'utilisateur a le droit de supprimer l'investissement
    if (investment.investorId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException(
        "Vous n'êtes pas autorisé à supprimer cet investissement",
      );
    }

    await this.investmentsRepository.remove(investment);
  }
}
