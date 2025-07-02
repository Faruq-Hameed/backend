import { Request } from 'express';
import { UserRole } from 'src/utils/userRole';

/**Request with user information
from the jwt */
export interface RequestWithUser extends Request {
  user: {
    id: number;
    email: string;
    role: UserRole;
  };
}
