import ProductHandlers from "../handler/product.js";
import {verifyToken} from "../middlewares/verifytoken.js";

const PRODUCT_URL = "/products"
export async function productRouter(app) {

    app.get(`${PRODUCT_URL}`, ProductHandlers.get)

    app.get(`${PRODUCT_URL}/:id`, ProductHandlers.getById)

    app.post(PRODUCT_URL, verifyToken, ProductHandlers.create)

    app.put(`${PRODUCT_URL}/:id`, verifyToken, ProductHandlers.update)

    app.delete(`${PRODUCT_URL}/:id`, verifyToken, ProductHandlers.deleteById)
}