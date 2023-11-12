import { userRouter } from "./user.js";
import { productRouter } from "./product.js";
import { checkoutRouter } from "./checkout.js";
import { categoryRouter } from "./category.js";
import { supplierRouter } from "./supplier.js";
import { customerRouter } from "./customer.js";
import { orderRouter } from "./order.js";
import { statisticRouter } from "./statistic.js";

export async function initRouter(app) {
    console.log("Router connected");
    app.get("/", (req, res) => {
        res.send("Hello world!");
    });
    await userRouter(app);
    await productRouter(app);
    await checkoutRouter(app);
    await categoryRouter(app);
    await supplierRouter(app);
    await customerRouter(app);
    await orderRouter(app);
    await statisticRouter(app);
    
}
const PATH = {
    USER: "/user",
    PRODUCT: "/products",
    CHECKOUT: "/checkout",
    CATEGORY: "/category",
    SUPPLIER: "/supplier",
    CUSTOMER: "/customer",
    ORDER: "/order",
    STATISTIC: "/statistic"
}
export default PATH