import { asyncHandler } from "../../utils";
import { Request, Response } from "express";
import { getCurrentYearUserGrowth } from "./dashboard.service";
import { AuthService } from "../Auth/auth.service";

export const getUserGrowth = asyncHandler(async (req:Request, res:Response)=>{

    const userGrowth = await AuthService.getUsersGroupedByCreationMonth()

    res.status(200).json(userGrowth)
})