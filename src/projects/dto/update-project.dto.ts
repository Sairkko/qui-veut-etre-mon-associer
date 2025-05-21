import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProjectDto {
  @ApiProperty({
    description: 'Titre du projet',
    example: 'Application mobile innovante',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Description détaillée du projet',
    example: 'Notre application mobile permet de mettre en relation...',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Budget nécessaire pour le projet (en euros)',
    example: 50000,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  budget?: number;

  @ApiProperty({
    description: 'Catégorie du projet',
    example: 'Technologie',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;
}
