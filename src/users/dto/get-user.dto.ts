import { User } from 'src/generated/prisma/client.js';

export class GetUserDto implements Partial<User> {
  id?: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  createdAt: Date;

  static fromUser(user: User): GetUserDto {
    const dto = new GetUserDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.firstName = user.firstName;
    dto.lastName = user.lastName;
    dto.fullName = `${user.firstName} ${user.lastName}`;
    dto.createdAt = user.createdAt;
    return dto;
  }
}
