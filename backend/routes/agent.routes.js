import { Router } from "express";
import {
  GenerateSalesQR,
  GetCurrentUser,
  LogoutUser,
  NumberOfReferalVisits,
  NumberOfSalesConvertions,
  RegiesterUser,
  UpdatePassword,
  emailer,
  forgotPassword,
  loginUsers,
  updateAvatar,
} from "../controller/agents.controller.js";
import { AuthTokenverify } from "../middlewares/Auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router.route("/signup").post(RegiesterUser);
router.route("/emailverify").post(emailer);
router.route("/login").post(loginUsers);
router.route("/reset-password").post(forgotPassword);

// secure route using Middleware
router.route("/change-password").post(AuthTokenverify, UpdatePassword);
router.route("/current-user").get(AuthTokenverify, GetCurrentUser);
router.route("/logout").get(AuthTokenverify,LogoutUser);
router.route("/avatar").patch(AuthTokenverify, upload.single("profileImage"), updateAvatar);
router.route("/update-avtar").patch(AuthTokenverify, upload.single("profileImage"), updateAvatar);

// Agent required routes
router.route("/referal-vists").get(AuthTokenverify,  NumberOfReferalVisits);
router.route("/sales-convertion").get(AuthTokenverify,  NumberOfSalesConvertions);
router.route("/generate-qr").post(AuthTokenverify,GenerateSalesQR);

export default router;