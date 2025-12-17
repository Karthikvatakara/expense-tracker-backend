import { NextFunction, Request,Response } from "express";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import { Expense } from "../entities/Expense";
import bcrypt from 'bcrypt';
import { generateJwt } from "../utils/jwt";

const UserRepo = AppDataSource.getRepository(User);
const ExpenseRepo = AppDataSource.getRepository(Expense);

export class AuthController {
    static async signup(req:Request,res:Response) :Promise<Response> {
        try{
            const { name, email, password } = req.body;
            
            const existingUser = await UserRepo.findOne({ where: { email }})

            if(existingUser){
                return res.status(400).json({message:"email already exist"});
            }
            const hashedPassword = await bcrypt.hash(password,10);

            const user = UserRepo.create({
                name,
                email,
                password:hashedPassword
            })
            await UserRepo.save(user);

            const token = generateJwt({userId:user.id, email:user.email})
            
            res.cookie("token",token,{ httpOnly:true, maxAge:24*60*60*1000})
            return res.status(201).json({mesage:"user created succesfully",user});
        }catch(error){
            console.log("signup error",error);
            return res.status(500).json({message:"server error occured",error:error})
        }
    }

    static async login(req:Request,res:Response,next:NextFunction):Promise<Response>{
        try{
            const { email,password } = req.body;

            const existingUser = await UserRepo.findOne({where :{email}});

            if(!existingUser){
                res.status(400).json({message:"user is not exist"});
            }

            const isMatch = await bcrypt.compare(password,existingUser?.password!);

            if(!isMatch){
                return res.status(400).json({message:"email or password invalid"})
            }

            const token = generateJwt({ userId:existingUser?.id!, email:existingUser?.email!})

            res.cookie("token",token,{ httpOnly:true, maxAge:24*60*60*1000});
            
            return res.status(200).json({message:"login succesfull",user:{ id: existingUser?.id,email:existingUser?.email,name:existingUser?.name}})
        }catch(error){
            return res.status(400).json({message:"internal server error occured"})
        }
    }
}