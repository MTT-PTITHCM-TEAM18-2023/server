import CustomerHandler from "../handler/customer.js";
import Middleware from "../middlewares/middleware.js";
import PATH from "../route/router.js";
export async function customerRouter(app) {

    app.get(`${PATH.CUSTOMER}`,(req, res) => {
        CustomerHandler.get(req, res);
    });
    app.get(`${PATH.CUSTOMER}/:id`,(req, res) => {
        CustomerHandler.getById(req, res);
    });
    app.post(`${PATH.CUSTOMER}`, Middleware.verifyToken,(req, res) => {
        CustomerHandler.create(req, res);
    });
    app.put(`${PATH.CUSTOMER}`, Middleware.verifyToken,(req, res) => {
        CustomerHandler.update(req, res);
    });
    app.get(`${PATH.CUSTOMER}/loyal`, Middleware.verifyToken,(req, res) => {
        CustomerHandler.getLoyal(req, res);
    });
}