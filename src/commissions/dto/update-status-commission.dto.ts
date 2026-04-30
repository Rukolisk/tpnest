import { IsNotEmpty, IsString } from 'class-validator';
import { CommissionStatus } from 'src/generated/prisma/enums';

export class UpdateStatusCommissionDto {
  @IsString()
  @IsNotEmpty({ message: 'Status is required' })
  status: CommissionStatus;
}
