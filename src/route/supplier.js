import { createSupplierHandler, getSupplierByIdHandler, getSupplierHandler, updateSupplierHandler } from "../handler/supplier.js";
import { verifyToken } from "../middlewares/verifytoken.js";

export async function supplierRouter(app) {

    app.get("/supplier", (req, res) => {
        getSupplierHandler(req, res);
    });
    app.get("/supplier/:id", (req, res) => {
        getSupplierByIdHandler(req, res);
    });
    app.post("/supplier", verifyToken, (req, res) => {
        createSupplierHandler(req, res);
    });
    app.put("/supplier", verifyToken, (req, res) => {
        updateSupplierHandler(req, res);
    });
}