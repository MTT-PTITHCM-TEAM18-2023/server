import ProductHandler from "../handler/product.js";
import Middleware from "../middlewares/middleware.js";
import PATH from "../route/router.js";


export async function productRouter(app) {

    app.get(`${PATH.PRODUCT}`, ProductHandler.get)

    app.get(`${PATH.PRODUCT}/:id`, ProductHandler.getById)

    app.post(PATH.PRODUCT, Middleware.verifyToken, ProductHandler.create)

    app.put(`${PATH.PRODUCT}/:id`, Middleware.verifyToken, ProductHandler.update)

    app.delete(`${PATH.PRODUCT}/:id`, Middleware.verifyToken, ProductHandler.deleteById)
}