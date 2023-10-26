import { changeOrderStatusHandler, getOrderByStatusHandler, getOrderStatusHandler, getPendingOrderHandler, getOrderDetailHandler } from "../handler/order.js";
import { verifyToken } from "../middlewares/verifytoken.js";

export async function orderRouter(app){
    app.get("/order/detail/:id", (req, res) => {
        getOrderDetailHandler(req, res);
    });
    app.get("/order/pending", (req, res) => {
        getPendingOrderHandler(req, res);
    });
    app.post("/order/change-status", verifyToken, (req, res) => {
        changeOrderStatusHandler(req, res);
    });
    app.get("/order/status", (req, res) => {
        getOrderStatusHandler(req, res);
    });
    app.get("/order/by-status/:id", (req, res) => {
        getOrderByStatusHandler(req, res);
    });

}