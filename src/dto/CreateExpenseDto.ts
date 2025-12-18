import { IsNotEmpty,IsNumber,IsPositive,IsString,IsEnum,Min, IsDateString } from "class-validator";
import { ExpenseCategory } from "../entities/Expense";

export class CreateExpenseDto{
    @IsNumber()
    @IsPositive()
    @Min(0.1)
    @IsNotEmpty()
    amount: number;

    @IsEnum(['Food', 'Transport', 'Bills', 'Shopping', 'Others'])
    @IsNotEmpty()
    category: ExpenseCategory;

    @IsString()
    @IsNotEmpty()
    description: string

    @IsDateString()
    @IsNotEmpty()
    date: string;
}
