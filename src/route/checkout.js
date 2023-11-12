import CheckoutHandler from "../handler/checkout.js";
import CommonHandler from "../handler/common.js";
import Middleware from "../middlewares/middleware.js";
import PATH from "../route/router.js";


export async function checkoutRouter(app) {

    app.post(`${PATH.CHECKOUT}/send-otp`, (req, res) => {
        CommonHandler.sendOTP(req, res);
    });
    app.post(`${PATH.CHECKOUT}/verify`, (req, res) => {
        CommonHandler.verifyOTP(req, res);
    });
    app.post(`${PATH.CHECKOUT}/place-order`, Middleware.verifyToken, (req, res) => {
        CheckoutHandler.placeOrder(req, res);
    });
    app.post(`${PATH.CHECKOUT}/in-store`, Middleware.verifyToken, (req, res) => {
        CheckoutHandler.orderInStore(req, res);
    });
}