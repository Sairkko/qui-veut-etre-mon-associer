import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Titre du projet',
    example: 'Application mobile innovante',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Description détaillée du projet',
    example:
      'Notre application mobile permet de mettre en relation les entrepreneurs et les investisseurs grâce à une interface intuitive...',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Budget nécessaire pour le projet (en euros)',
    example: 50000,
    minimum: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  budget: number;

  @ApiProperty({
    description: 'Catégorie du projet',
    example: 'Technologie',
  })
  @IsNotEmpty()
  @IsString()
  category: string;
}
