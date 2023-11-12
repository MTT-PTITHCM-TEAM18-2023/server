import CategoryHandler from "../handler/category.js";
import PATH from "../route/router.js";
import Middleware from "../middlewares/middleware.js";
export async function categoryRouter(app) {

    app.get(`${PATH.CATEGORY}`, (req, res) => {
        CategoryHandler.get(req, res);
    });
    app.get(`${PATH.CATEGORY}/:id`, (req, res) => {
        CategoryHandler.getById(req, res);
    });
    app.post(`${PATH.CATEGORY}`, Middleware.verifyToken, (req, res) => {
        CategoryHandler.create(req, res);
    });
    app.put(`${PATH.CATEGORY}`, Middleware.verifyToken, (req, res) => {
        CategoryHandler.update(req, res);
    });
}