import { plainToInstance } from "class-transformer";
import { validate, Validate } from "class-validator";
import { Request,Response,NextFunction } from "express";


export const validationMiddleware = (dto:any) => {
    return async ( req: Request, res: Response, next: NextFunction) => {
        const dtoInstance = plainToInstance(dto,req.body);
     

        const errors = await validate(dtoInstance, {
            whitelist: true,
            forbidNonWhitelisted: true,
        });

        if(errors.length > 0) {
            const formattedErrors = errors.map((err) => ({
                field: err.property,
                errors: Object.values(err.constraints || {})
            }))
            return res.status(400).json({ message:"validation failed",error:formattedErrors })
        }   

        req.body = dtoInstance;
        next();
    }
}