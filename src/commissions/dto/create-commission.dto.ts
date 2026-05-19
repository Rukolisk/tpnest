import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommissionDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsString()
  @IsNotEmpty({ message: 'User ID is required' })
  userId: string;
}
