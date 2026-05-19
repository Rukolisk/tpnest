import { User } from 'src/generated/prisma/client.js';

export class GetUserDto implements Partial<User> {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  createdAt: Date;

  static fromUser(user: User): GetUserDto {
    const dto = new GetUserDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.firstName = user.firstName ?? undefined;
    dto.lastName = user.lastName ?? undefined;
    dto.fullName = user.name;
    dto.createdAt = user.createdAt;
    return dto;
  }
}
