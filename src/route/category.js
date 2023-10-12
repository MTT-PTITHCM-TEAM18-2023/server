import { createCategoryHandler, getCategoryByIdHandler, getCategoryHandler, updateCategoryHandler } from "../handler/category.js";
import { verifyToken } from "../middlewares/verifytoken.js";

export async function categoryRouter(app) {

    app.get("/category", (req, res) => {
        getCategoryHandler(req, res);
    });
    app.get("/category/:id", (req, res) => {
        getCategoryByIdHandler(req, res);
    });
    app.post("/category", verifyToken, (req, res) => {
        createCategoryHandler(req, res);
    });
    app.put("/category", verifyToken, (req, res) => {
        updateCategoryHandler(req, res);
    });
}