import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCommissionDto {
  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  description: string;
}
