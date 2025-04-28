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

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  budget: number;

  @Column()
  category: string;

  @ManyToOne(() => User, (user) => user.projects)
  @JoinColumn({ name: 'owner_id' })
  @Exclude()
  owner: User;

  @Column()
  ownerId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Investment, (investment) => investment.project)
  investments: Investment[];
}
