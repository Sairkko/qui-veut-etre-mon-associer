import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInterestDto {
  @ApiProperty({
    description: "Nom du centre d'intérêt",
    example: 'Technologie',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: "Description du centre d'intérêt",
    example: "Projets liés à la technologie et à l'innovation",
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
