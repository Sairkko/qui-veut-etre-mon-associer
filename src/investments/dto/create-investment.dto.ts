import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class CreateInvestmentDto {
  @IsNotEmpty()
  @IsUUID()
  projectId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;
}
