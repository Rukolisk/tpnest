import { User, Commission } from 'src/generated/prisma/client';

type UserWithCommissions = User & { commissions?: Commission[] };
export class GetUserDetailDto implements Partial<User> {
  id?: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  createdAt: Date;
  commissions?: { title: string; description: string | null }[];

  static fromUser(user: UserWithCommissions): GetUserDetailDto {
    const dto = new GetUserDetailDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.firstName = user.firstName;
    dto.lastName = user.lastName;
    dto.fullName = `${user.firstName} ${user.lastName}`;
    dto.createdAt = user.createdAt;
    dto.commissions = (user.commissions ?? []).map((c) => ({
      title: c.title,
      description: c.description,
    }));
    return dto;
  }
}
