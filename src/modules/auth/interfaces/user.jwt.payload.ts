import { UserRole } from 'src/utils/userRole';

export interface IUserJwtPayload {
  id: string;
  role: UserRole;
}
