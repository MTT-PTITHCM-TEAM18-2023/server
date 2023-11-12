import OrderHandler from "../handler/order.js";
import Middleware from "../middlewares/middleware.js";
import PATH from "../route/router.js";

export async function orderRouter(app){
    app.get(`${PATH.ORDER}/detail/:id`, (req, res) => {
        OrderHandler.getDetail(req, res);
    });
    app.get(`${PATH.ORDER}/pending`, (req, res) => {
        OrderHandler.getPending(req, res);
    });
    app.post(`${PATH.ORDER}/change-status`, Middleware.verifyToken, (req, res) => {
        OrderHandler.changeStatus(req, res);
    });
    app.get(`${PATH.ORDER}/status`, (req, res) => {
        OrderHandler.getStatus(req, res);
    });
    app.get(`${PATH.ORDER}/by-status/:id`, (req, res) => {
        OrderHandler.getByStatus(req, res);
    });

}