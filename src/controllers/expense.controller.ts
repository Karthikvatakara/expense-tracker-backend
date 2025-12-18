import { Request,Response } from "express";
import { AppDataSource } from "../config/database";
import { Expense } from "../entities/Expense";
import { User } from "../entities/User";
import { start } from "node:repl";


const ExpenseRepo  = AppDataSource.getRepository(Expense);

export class ExpenseController{
    static async createExpense(req:Request,res:Response):Promise<Response>{
        try{
            const { amount, category, description, date } = req.body;

            const userId = (req.user as any).id;
           

            const expense = ExpenseRepo.create({
                amount,category,description,date,userId
            })

            await ExpenseRepo.save(expense);

            return res.status(201).json({message:"expense created succesfully",expense})
        }catch(error){
            console.log('create EXPENSE error',error);
            return res.status(400).json({messge:"internal server error occured"})
        }
    }

    static async getExpenseById(req:Request,res:Response):Promise<Response>{
        try{
            const { id } = req.params;
            const userId = (req.user as any).id;

            const expense = await ExpenseRepo.findOne({where:{id:Number(id),userId}});

            if(!expense){
                return res.status(400).json({message:"expense not found"});
            }

            return res.status(200).json({message:"expense retrieved succesfully",expense});
        }catch(error){
            console.log("error in the getespese by id",error);
            return res.status(400).json({message:"internal server error"})
        }
    }

    static async deleteExpenseById(req:Request,res:Response):Promise<Response>{
        try{
            const { id } = req.params;
            const userId = (req.user as any).id;
            const expense = await ExpenseRepo.findOne({where:{id:parseInt(id),userId}});

            if(!expense){
                return res.status(400).json({message:"expense not found"})
            }

            await ExpenseRepo.remove(expense);
            return res.status(200).json({message:"expense removed succesfully"});
        }catch(error){
            console.log(error,'error in delete expense by id');
            return res.status(400).json({message:"internal error occured"})
        }
    }

    static async updateExpense(req:Request,res:Response):Promise<Response>{
        try{
            const { id } = req.params;
            const userId = (req.user as any).id;

            const expense = await ExpenseRepo.findOne({where:{id:parseInt(id),userId}});

            if(!expense){
                return res.status(400).json({message:"expense not found"});
            }

            const { amount,category, description, date} = req.body;

            if (amount !== undefined) expense.amount = amount;
            if (category !== undefined) expense.category = category;
            if (description !== undefined) expense.description = description;
            if (date !== undefined) expense.date = new Date(date);
            
            await ExpenseRepo.save(expense);
            
            return res.status(200).json({message:"expense updated succesfully",expense})
        }catch(error){
            console.log(error,"error in the update expense");
            return res.status(400).json({message:"internal server error"});
        }
    }

   static async getExpenseSummary(req: Request, res: Response): Promise<Response> {
  try {
    const user = req.user as any;

    const summary = await ExpenseRepo
      .createQueryBuilder("expense")
      .select("expense.category", "category")
      .addSelect("SUM(expense.amount)", "total")
      .where("expense.userId = :userId", { userId: user.id })
      .groupBy("expense.category")
      .getRawMany();

    return res.status(200).json(summary);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch expense summary" });
  }
}


    static async getAllExpenses(req: Request, res: Response): Promise<Response> {
  try {
    const userId = (req.user as any).id;
    const { startDate, endDate, category } = req.query;

    // const query = ExpenseRepo.createQueryBuilder('expense')
    //             .where('expense.userId=:userId',{userId})
    //             .where('expense.date BETWEEN :start AND :end',{
    //                 start:startDate,
    //                 end:endDate
    //             }).where('expense.category=:category',{category})
    
    const query = ExpenseRepo.createQueryBuilder("expense")
      .where("expense.userId = :userId", { userId })
      .orderBy("expense.date", "DESC");

    
    if (startDate && endDate) {
      query.andWhere(
        "expense.date BETWEEN :startDate AND :endDate",
        {
          startDate,
          endDate,
        }
      );
    }

    
    if (category) {
      query.andWhere("expense.category = :category", { category });
    }

    const expenses = await query.getMany();

    return res.status(200).json({
      message: "Expenses fetched successfully",
      count: expenses.length,
      expenses,
    });
  } catch (error) {
    console.error("getAllExpenses error:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch expenses" });
  }
}


}