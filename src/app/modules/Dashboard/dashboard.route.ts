import { Router } from "express";
import { auth } from "../../middlewares";
import { getUserGrowth } from "./dashboard.controller";

let router = Router()

router.get("/growth", auth(), getUserGrowth)

export const dashbaordRoutes = router