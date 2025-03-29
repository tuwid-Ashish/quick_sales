import { Router } from "express";
import { RAZERPAY_KEY_ID } from "../config/constants.js";
import { CapturePayment, CreateOrder } from "../controller/payment.controller.js";
const router = Router();

router.route("/create-order").post(CreateOrder);
router.route("/pay_id").get((req,res)=>res.status(200).json({id:RAZERPAY_KEY_ID}))
router.route("/PaymentVerification").post(CapturePayment);
router.route("/login").post(CapturePayment);
// router.route("/reset-password").post(forgotPassword);
 
export default router;