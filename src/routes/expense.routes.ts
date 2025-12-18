import Router from 'express';
import { validationMiddleware } from '../middleware/validation.middleware';
import { CreateExpenseDto } from '../dto/CreateExpenseDto';
import { ExpenseController } from '../controllers/expense.controller';
import { UpdateExpenseDto } from '../dto/UpdateExpenseDto';

import passport from 'passport';

const router = Router();

router.get("/summary",passport.authenticate("jwt",{session:false}),ExpenseController.getExpenseSummary)
router.get("/getallexpense",passport.authenticate("jwt",{session:false}),ExpenseController.getAllExpenses);
router.post("/",validationMiddleware(CreateExpenseDto),passport.authenticate("jwt",{ session: false }),ExpenseController.createExpense);
router.get("/:id",passport.authenticate("jwt",{session:false}),ExpenseController.getExpenseById)
router.delete("/:id",passport.authenticate("jwt",{session:false}),ExpenseController.deleteExpenseById)
router.put("/:id",validationMiddleware(UpdateExpenseDto),passport.authenticate("jwt",{session:false}),ExpenseController.updateExpense);
export default router;