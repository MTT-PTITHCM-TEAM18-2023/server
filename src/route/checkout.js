import { orderInStoreHandler, placeOrderHandler } from "../handler/checkout.js";
import {  sendOTPHandler, verifyOTPHandler } from "../handler/common.js";
import { verifyToken } from "../middlewares/verifytoken.js";



export async function checkoutRouter(app) {

    app.post("/checkout/send-otp", (req, res) => {
        sendOTPHandler(req, res);
    });
    app.post("/checkout/verify", (req, res) => {
        verifyOTPHandler(req, res);
    });
    app.post("/checkout/place-order", verifyToken, (req, res) => {
        placeOrderHandler(req, res);
    });
    app.post("/checkout/in-store", verifyToken, (req, res) => {
        orderInStoreHandler(req, res);
    });
}