import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interest } from './entities/interest.entity';
import { CreateInterestDto } from './dto/create-interest.dto';

@Injectable()
export class InterestsService {
  constructor(
    @InjectRepository(Interest)
    private interestsRepository: Repository<Interest>,
  ) {}

  async create(createInterestDto: CreateInterestDto): Promise<Interest> {
    const interest = this.interestsRepository.create(createInterestDto);
    return this.interestsRepository.save(interest);
  }

  async findAll(): Promise<Interest[]> {
    return this.interestsRepository.find();
  }

  async findOne(id: string): Promise<Interest> {
    const interest = await this.interestsRepository.findOne({
      where: { id },
    });

    if (!interest) {
      throw new NotFoundException(`Intérêt avec l'ID ${id} non trouvé`);
    }

    return interest;
  }

  async findByIds(ids: string[]): Promise<Interest[]> {
    return this.interestsRepository.findByIds(ids);
  }

  async remove(id: string): Promise<void> {
    const interest = await this.findOne(id);
    await this.interestsRepository.remove(interest);
  }
} 