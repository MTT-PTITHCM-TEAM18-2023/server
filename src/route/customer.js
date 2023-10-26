import { createCustomerHandler, getCustomerByIdHandler, getCustomerHandler, updateCustomerHandler } from "../handler/customer.js";
import { verifyToken } from "../middlewares/verifytoken.js";

export async function customerRouter(app) {

    app.get("/customer",(req, res) => {
        getCustomerHandler(req, res);
    });
    app.get("/customer/:id",(req, res) => {
        getCustomerByIdHandler(req, res);
    });
    app.post("/customer", verifyToken,(req, res) => {
        createCustomerHandler(req, res);
    });
    app.put("/customer", verifyToken,(req, res) => {
        updateCustomerHandler(req, res);
    });
    app.get("/customer/loyal", verifyToken,(req, res) => {
        getCustomerByIdHandler(req, res);
    });
}