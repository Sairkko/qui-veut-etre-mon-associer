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
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';

@Entity('investments')
export class Investment {
  @ApiProperty({
    description: "Identifiant unique de l'investissement",
    example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiHideProperty()
  @ManyToOne(() => User, (user) => user.investments)
  @JoinColumn({ name: 'investor_id' })
  @Exclude()
  investor: User;

  @ApiProperty({
    description: "Identifiant de l'investisseur",
    example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
  })
  @Column()
  investorId: string;

  @ApiHideProperty()
  @ManyToOne(() => Project, (project) => project.investments)
  @JoinColumn({ name: 'project_id' })
  @Exclude()
  project: Project;

  @ApiProperty({
    description: "Identifiant du projet concerné par l'investissement",
    example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
  })
  @Column()
  projectId: string;

  @ApiProperty({
    description: "Montant de l'investissement en euros",
    example: 5000,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({
    description: "Date de création de l'investissement",
    example: '2023-01-01T00:00:00Z',
  })
  @CreateDateColumn()
  createdAt: Date;
}
