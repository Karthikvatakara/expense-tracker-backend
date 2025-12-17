import jwt from 'jsonwebtoken';

export interface jwtPayload {
    userId: number,
    email: string,
}

export const generateJwt = (payload :jwtPayload): string => {
    return jwt.sign(
       payload,
       process.env.JWT_SECRET as string,
       { expiresIn: "7d"}
    )
}