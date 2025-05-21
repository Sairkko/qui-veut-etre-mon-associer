import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Investment } from '../../investments/entities/investment.entity';
import { Exclude } from 'class-transformer';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';

@Entity('projects')
export class Project {
  @ApiProperty({
    description: 'Identifiant unique du projet',
    example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Titre du projet',
    example: 'Application mobile innovante',
  })
  @Column()
  title: string;

  @ApiProperty({
    description: 'Description détaillée du projet',
    example: 'Notre application mobile permet de mettre en relation...',
  })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({
    description: 'Budget nécessaire pour le projet (en euros)',
    example: 50000,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  budget: number;

  @ApiProperty({
    description: 'Catégorie du projet',
    example: 'Technologie',
  })
  @Column()
  category: string;

  @ApiHideProperty()
  @ManyToOne(() => User, (user) => user.projects)
  @JoinColumn({ name: 'owner_id' })
  @Exclude()
  owner: User;

  @ApiProperty({
    description: 'Identifiant du propriétaire du projet',
    example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
  })
  @Column()
  ownerId: string;

  @ApiProperty({
    description: 'Date de création du projet',
    example: '2023-01-01T00:00:00Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Date de dernière mise à jour du projet',
    example: '2023-01-01T00:00:00Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'Liste des investissements pour ce projet',
    type: [Investment],
  })
  @OneToMany(() => Investment, (investment) => investment.project)
  investments: Investment[];
}
