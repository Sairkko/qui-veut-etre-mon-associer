import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { User } from '../users/entities/user.entity';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    userId: string,
  ): Promise<Project> {
    const project = this.projectsRepository.create({
      ...createProjectDto,
      ownerId: userId,
    });

    return this.projectsRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return this.projectsRepository.find({
      relations: ['owner', 'investments', 'investments.investor'],
    });
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['owner', 'investments', 'investments.investor'],
    });

    if (!project) {
      throw new NotFoundException(`Projet avec l'ID ${id} non trouvé`);
    }

    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    userId: string,
    userRole: Role,
  ): Promise<Project> {
    const project = await this.findOne(id);

    if (project.ownerId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException(
        "Vous n'êtes pas autorisé à modifier ce projet",
      );
    }

    Object.assign(project, updateProjectDto);

    return this.projectsRepository.save(project);
  }

  async remove(id: string, userId: string, userRole: Role): Promise<void> {
    const project = await this.findOne(id);

    if (project.ownerId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException(
        "Vous n'êtes pas autorisé à supprimer ce projet",
      );
    }

    await this.projectsRepository.remove(project);
  }

  async getRecommendedProjects(userId: string): Promise<Project[]> {
    // Récupérer l'utilisateur avec ses intérêts
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['interests'],
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
    }

    // Si l'utilisateur n'a pas d'intérêts définis, renvoyer tous les projets
    if (!user.interests || user.interests.length === 0) {
      return this.findAll();
    }

    // Récupérer les noms des intérêts de l'utilisateur
    const userInterests = user.interests.map((interest) => interest.name);

    // Récupérer tous les projets
    const allProjects = await this.projectsRepository.find({
      relations: ['owner', 'investments', 'investments.investor'],
    });

    // Filtrer les projets en fonction des intérêts de l'utilisateur
    // Ici nous utilisons la catégorie du projet pour la correspondance
    // Une correspondance plus sophistiquée pourrait être implémentée ultérieurement
    const recommendedProjects = allProjects.filter((project) =>
      userInterests.some(
        (interest) =>
          project.category.toLowerCase().includes(interest.toLowerCase()) ||
          project.title.toLowerCase().includes(interest.toLowerCase()) ||
          project.description.toLowerCase().includes(interest.toLowerCase()),
      ),
    );

    return recommendedProjects;
  }
}
