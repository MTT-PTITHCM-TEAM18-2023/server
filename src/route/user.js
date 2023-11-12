import UserHandler from "../handler/user.js";
import CommonHandler from "../handler/common.js";
import Middleware from "../middlewares/middleware.js";
import PATH from "../route/router.js";

const USER_URL = "/user"

export async function userRouter(app) {

    app.post(`${PATH.USER}/login`, UserHandler.login)

    app.post(`${PATH.USER}/logout`, Middleware.verifyToken, UserHandler.logout)

    app.post(`${PATH.USER}/get-profile`, Middleware.verifyToken, UserHandler.getProfile)

    app.post(`${PATH.USER}/change-password`, Middleware.verifyToken, UserHandler.changePassword)

    app.post(`${PATH.USER}/forgot-password/send-otp`, CommonHandler.sendOTP)
    app.post(`${PATH.USER}/forgot-password/verify`, CommonHandler.verifyOTP)
    app.post(`${PATH.USER}/forgot-password/get`, Middleware.verifyToken, UserHandler.sendPassword)

    app.get(`${PATH.USER}`, Middleware.verifyToken, Middleware.adminCheck, UserHandler.get)

    app.get(`${PATH.USER}/:id`, Middleware.verifyToken, Middleware.adminCheck, UserHandler.getById)

    app.post(`${PATH.USER}`, Middleware.verifyToken, Middleware.adminCheck, UserHandler.create)

    app.put(`${PATH.USER}`, Middleware.verifyToken, Middleware.adminCheck, UserHandler.update)

    app.delete(`${PATH.USER}/:id`, Middleware.verifyToken, Middleware.adminCheck, UserHandler.deleteById)
}
