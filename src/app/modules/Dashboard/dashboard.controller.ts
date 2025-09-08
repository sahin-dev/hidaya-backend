import { asyncHandler } from "../../utils";
import { Request, Response } from "express";
import { getCurrentYearUserGrowth, getMonthlyUserCreation } from "./dashboard.service";
import { AuthService } from "../Auth/auth.service";

export const getUserGrowth = asyncHandler(async (req:Request, res:Response)=>{

    const year = req.query.year?.toString() || new Date().getFullYear()

    const userGrowth = await getMonthlyUserCreation(year)

    res.status(200).json(userGrowth)
})