export interface IPublicUser {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phonenumber: string;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}
