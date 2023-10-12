import { changeOrderStatusHandler, getOrderByStatusHandler, getOrderStatusHandler, getPendingOrderHandler } from "../handler/order.js";
import { verifyToken } from "../middlewares/verifytoken.js";

export async function orderRouter(app){
    app.get("/order/pending", verifyToken, (req, res) => {
        getPendingOrderHandler(req, res);
    });
    app.post("/order/change-status", verifyToken, (req, res) => {
        changeOrderStatusHandler(req, res);
    });
    app.get("/order/status", verifyToken, (req, res) => {
        getOrderStatusHandler(req, res);
    });
    app.get("/order/by-status/:id", verifyToken, (req, res) => {
        getOrderByStatusHandler(req, res);
    });
}