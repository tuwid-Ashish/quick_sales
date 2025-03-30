import { Router } from "express";
import { AuthTokenverify } from "../middlewares/Auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
    AddSaleProduct,
    DeleteSaleProduct,
    EditSaleProduct,
    GetSaleProductById,
    ListReferrals,
    ApproveCommission,
    RejectCommission,
    GetOrders,
    GetOrderById,
    GetSaleProducts,
    ShipOrder,
    GetShopsList,
    EditShop,
    GetshopById
} from "../controller/Admin.controller.js";
const router = Router();

router.route("/get-products").get(GetSaleProducts);
router.route("/get-product/:id").get(GetSaleProductById);
// secure routers for admin
router.route("/add-product").post(AuthTokenverify,upload.array("images[]", 4), AddSaleProduct);
router.route("/edit-product").post(AuthTokenverify,upload.array("images[]", 4),EditSaleProduct);
router.route("/delete-product/:id").delete(AuthTokenverify, DeleteSaleProduct);

// refreral related routes
router.route("/list-referrals").get(AuthTokenverify, ListReferrals);
router.route("/approve-commission/:id").post(AuthTokenverify, ApproveCommission);
router.route("/reject-commission/:id").post(AuthTokenverify, RejectCommission);

// admin gerneral routes
router.route("/get-orders").get(AuthTokenverify, GetOrders);
router.route("/get-order/:id").get(GetOrderById);
router.route("/ship-order/:id").post(AuthTokenverify, ShipOrder)
router.route("/shop-list").get(AuthTokenverify, GetShopsList);
router.route("/edit-shop/:id").put(AuthTokenverify, EditShop);
router.route("/get-shop/:id").get(AuthTokenverify, GetshopById);

export default router;