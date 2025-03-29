import { Router } from "express";
import {
  NumberOfReferalVisits,
  NumberOfSalesConvertions,
 
} from "../controller/agents.controller.js";
import { AuthTokenverify } from "../middlewares/Auth.middleware.js";
const router = Router();

 
// Agent required routes
router.route("/referal-vists").get(AuthTokenverify,  NumberOfReferalVisits);
router.route("/sales-convertion").get(AuthTokenverify,  NumberOfSalesConvertions);

export default router;