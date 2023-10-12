import UserHandlers from "../handler/user.js";
import {sendOTPHandler, verifyOTPHandler} from "../handler/common.js";
import {verifyToken} from "../middlewares/verifytoken.js";
import adminCheck from "../middlewares/admincheck.js";

const USER_URL = "/user"

export async function userRouter(app) {

    app.post(`${USER_URL}/login`, UserHandlers.login)

    app.post(`${USER_URL}/logout`, verifyToken, UserHandlers.logout)

    app.post(`${USER_URL}/get-profile`, verifyToken, UserHandlers.getProfile)

    app.post(`${USER_URL}/change-password`, verifyToken, UserHandlers.changePassword)

    app.post(`${USER_URL}/forgot-password/send-otp`, sendOTPHandler)
    app.post(`${USER_URL}/forgot-password/verify`, verifyOTPHandler)
    app.post(`${USER_URL}/forgot-password/get`, verifyToken, UserHandlers.sendPassword)

    app.get(USER_URL, verifyToken, adminCheck, UserHandlers.get)

    app.get(`${USER_URL}/:id`, verifyToken, adminCheck, UserHandlers.getById)

    app.post(USER_URL, verifyToken, adminCheck, UserHandlers.create)

    app.put(`${USER_URL}`, verifyToken, adminCheck, UserHandlers.update)

    app.delete(`${USER_URL}/:id`, verifyToken, adminCheck, UserHandlers.deleteById)
}
