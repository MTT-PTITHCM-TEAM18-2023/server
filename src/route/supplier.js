import SupplierHandler from "../handler/supplier.js";
import Middleware from "../middlewares/middleware.js";
import PATH from "../route/router.js";

export async function supplierRouter(app) {

    app.get(`${PATH.SUPPLIER}`, (req, res) => {
        SupplierHandler.get(req, res);
    });
    app.get(`${PATH.SUPPLIER}/:id`, (req, res) => {
        SupplierHandler.getById(req, res);
    });
    app.post(`${PATH.SUPPLIER}`, Middleware.verifyToken, (req, res) => {
        SupplierHandler.create(req, res);
    });
    app.put(`${PATH.SUPPLIER}`, Middleware.verifyToken, (req, res) => {
        SupplierHandler.update(req, res);
    });
}