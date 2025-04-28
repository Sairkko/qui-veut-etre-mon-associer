import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from '../auth/dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Interest } from '../interests/entities/interest.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Interest)
    private interestsRepository: Repository<Interest>,
  ) {}

  async create(registerDto: RegisterDto): Promise<User> {
    const user = this.usersRepository.create(registerDto);
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['interests'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['interests'],
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['interests'],
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.interestIds) {
      const interests = await this.interestsRepository.find({
        where: { id: In(updateUserDto.interestIds) },
      });
      user.interests = interests;
      delete updateUserDto.interestIds;
    }

    Object.assign(user, updateUserDto);

    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  async findUserInterests(userId: string): Promise<Interest[]> {
    const user = await this.findOne(userId);
    return user.interests;
  }

  async addInterests(userId: string, interestIds: string[]): Promise<User> {
    const user = await this.findOne(userId);
    const interests = await this.interestsRepository.find({
      where: { id: In(interestIds) },
    });

    if (!user.interests) {
      user.interests = [];
    }

    user.interests = [...user.interests, ...interests];

    return this.usersRepository.save(user);
  }
}
