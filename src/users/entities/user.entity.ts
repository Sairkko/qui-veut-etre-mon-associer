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

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.ENTREPRENEUR,
  })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Interest)
  @JoinTable({
    name: 'user_interests',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'interest_id', referencedColumnName: 'id' },
  })
  interests: Interest[];

  @OneToMany(() => Project, (project) => project.owner)
  projects: Project[];

  @OneToMany(() => Investment, (investment) => investment.investor)
  investments: Investment[];
}
