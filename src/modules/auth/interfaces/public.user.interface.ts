import { UserRole } from 'src/utils/userRole';

export interface IPublicUser {
  id: number;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  role: UserRole;
}
