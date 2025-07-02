import { IPublicUser } from "./public.user.interface";

export interface AuthReturn {
  user: IPublicUser;
  token: string;
}