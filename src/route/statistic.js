import { changeOrderStatusHandler, getOrderByStatusHandler, getOrderStatusHandler, getPendingOrderHandler } from "../handler/order.js";
import { getGeneralStatisticHandler, getOutOfStockHandler, getOwnOrderHandler, getTopProductHandler } from "../handler/statistic.js";
import { verifyToken } from "../middlewares/verifytoken.js";

export async function statisticRouter(app){
    app.get("/statistic/general", verifyToken, (req, res) => {
        getGeneralStatisticHandler(req, res);
    });
    app.get("/statistic/top", verifyToken, (req, res) => {
        getTopProductHandler(req, res);
    });
    app.get("/statistic/out-of-stock", verifyToken, (req, res) => {
        getOutOfStockHandler(req, res);
    });
    app.get("/statistic/own-order", verifyToken, (req, res) => {
        getOwnOrderHandler(req, res);
    });
}