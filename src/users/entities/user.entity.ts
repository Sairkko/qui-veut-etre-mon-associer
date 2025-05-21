import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Role } from '../../common/enums/role.enum';
import { Exclude } from 'class-transformer';
import { Interest } from '../../interests/entities/interest.entity';
import { Project } from '../../projects/entities/project.entity';
import { Investment } from '../../investments/entities/investment.entity';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({
    description: "Identifiant unique de l'utilisateur",
    example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: "Prénom de l'utilisateur",
    example: 'Jean',
    maxLength: 100,
  })
  @Column({ length: 100 })
  firstName: string;

  @ApiProperty({
    description: "Nom de l'utilisateur",
    example: 'Dupont',
    maxLength: 100,
  })
  @Column({ length: 100 })
  lastName: string;

  @ApiProperty({
    description: "Adresse email de l'utilisateur",
    example: 'jean.dupont@example.com',
  })
  @Column({ unique: true })
  email: string;

  @ApiHideProperty()
  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @ApiProperty({
    description: "Rôle de l'utilisateur",
    enum: Role,
    example: Role.ENTREPRENEUR,
  })
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.ENTREPRENEUR,
  })
  role: Role;

  @ApiProperty({
    description: 'Date de création du compte',
    example: '2023-01-01T00:00:00Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Date de dernière mise à jour du compte',
    example: '2023-01-01T00:00:00Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: "Centres d'intérêt de l'utilisateur",
    type: [Interest],
  })
  @ManyToMany(() => Interest)
  @JoinTable({
    name: 'user_interests',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'interest_id', referencedColumnName: 'id' },
  })
  interests: Interest[];

  @ApiProperty({
    description: "Projets créés par l'utilisateur",
    type: [Project],
  })
  @OneToMany(() => Project, (project) => project.owner)
  projects: Project[];

  @ApiProperty({
    description: "Investissements réalisés par l'utilisateur",
    type: [Investment],
  })
  @OneToMany(() => Investment, (investment) => investment.investor)
  investments: Investment[];
}
