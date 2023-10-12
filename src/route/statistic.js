import { changeOrderStatusHandler, getOrderByStatusHandler, getOrderStatusHandler, getPendingOrderHandler } from "../handler/order.js";
import { getGeneralStatisticHandler, getTopProductHandler } from "../handler/statistic.js";
import { verifyToken } from "../middlewares/verifytoken.js";

export async function statisticRouter(app){
    app.get("/statistic/general", verifyToken, (req, res) => {
        getGeneralStatisticHandler(req, res);
    });
    app.get("/statistic/top", verifyToken, (req, res) => {
        getTopProductHandler(req, res);
    });
    // app.get("/order/status", verifyToken, (req, res) => {
    //     getOrderStatusHandler(req, res);
    // });
    // app.get("/order/by-status/:id", verifyToken, (req, res) => {
    //     getOrderByStatusHandler(req, res);
    // });
}