import StatisticHandler from "../handler/statistic.js";
import Middleware from "../middlewares/middleware.js";
import PATH from "../route/router.js";


export async function statisticRouter(app){
    app.get(`${PATH.STATISTIC}/general`, Middleware.verifyToken, (req, res) => {
        StatisticHandler.getGeneral(req, res);
    });
    app.get(`${PATH.STATISTIC}/top`, Middleware.verifyToken, (req, res) => {
        StatisticHandler.getTopProduct(req, res);
    });
    // app.get(`${PATH.STATISTIC}/out-of-stock`, verifyToken, (req, res) => {
    //     StatisticHandler.getOutOfStock(req, res);
    // });
    // app.get(`${PATH.STATISTIC}/own-order`, verifyToken, (req, res) => {
    //     StatisticHandler.getOwnOrder(req, res);
    // });
}