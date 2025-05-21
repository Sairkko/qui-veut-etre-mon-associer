import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('interests')
export class Interest {
  @ApiProperty({
    description: "Identifiant unique du centre d'intérêt",
    example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: "Nom du centre d'intérêt",
    example: 'Technologie',
  })
  @Column({ unique: true })
  name: string;

  @ApiProperty({
    description: "Description du centre d'intérêt",
    example: "Projets liés à la technologie et à l'innovation",
    required: false,
  })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({
    description: "Date de création du centre d'intérêt",
    example: '2023-01-01T00:00:00Z',
  })
  @CreateDateColumn()
  createdAt: Date;
}
