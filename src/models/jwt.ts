export interface JwtPayload {
   _id: string;
   email: string;
}

export interface GenerateTokensObj {
   accessToken: string;
   refreshToken: string;
}
