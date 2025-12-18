import { IsOptional,IsString,IsEnum, IsNumber, Min, IsPositive, IsDateString,  } from "class-validator";
import { ExpenseCategory } from "../entities/Expense";

export class UpdateExpenseDto{
    @IsNumber()
    @IsOptional()
    @Min(0.1)
    @IsPositive()
    amount?: number

    @IsEnum(['Food', 'Transport', 'Bills', 'Shopping', 'Others'])
    @IsOptional()
    category?: ExpenseCategory;

    @IsString()
    @IsOptional()
    description?: string

    @IsDateString()
    @IsOptional()
    date?: string;

}