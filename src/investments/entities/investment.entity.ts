import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';
import { Exclude } from 'class-transformer';
@Entity('investments')
export class Investment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.investments)
  @JoinColumn({ name: 'investor_id' })
  investor: User;

  @Column()
  investorId: string;

  @ManyToOne(() => Project, (project) => project.investments)
  @JoinColumn({ name: 'project_id' })
  @Exclude()
  project: Project;

  @Column()
  projectId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @CreateDateColumn()
  createdAt: Date;
}
