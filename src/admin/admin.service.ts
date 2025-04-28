import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { InvestmentsService } from '../investments/investments.service';
import { User } from '../users/entities/user.entity';
import { Investment } from '../investments/entities/investment.entity';
import { ProjectsService } from '../projects/projects.service';
import { Project } from '../projects/entities/project.entity';
@Injectable()
export class AdminService {
  constructor(
    private usersService: UsersService,
    private investmentsService: InvestmentsService,
    private projectsService: ProjectsService,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  async removeUser(id: string): Promise<void> {
    return this.usersService.remove(id);
  }

  async getAllInvestments(): Promise<Investment[]> {
    return this.investmentsService.findAll();
  }

  async getAllProjects(): Promise<Project[]> {
    return this.projectsService.findAll();
  }
}
