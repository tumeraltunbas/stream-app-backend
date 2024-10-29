export class User {
   _id?: string;
   username: string;
   email: string;
   password: string;
   biography?: string;
   profileImageUrl?: string;
   isEmailVerified?: boolean;
   isBlocked?: boolean;
   createdAt?: Date;
   updatedAt?: Date;
}
