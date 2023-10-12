import {Status, StatusCode} from "../common/common.js";
import { decodeJwt, getJwt } from "./verifytoken.js";

const isAdmin = (roleId) => {
    return roleId === 1
}
const adminCheck = async (req, res, next) => {
    const token = getJwt(req)
    if(token == null) {
        res.status(StatusCode.BAD_REQUEST).json({
            status: Status.FAILED,
            message: "Not verified!",
        });
        return
    }
    const payload = decodeJwt(token)
    if(payload == null) {
        res.status(StatusCode.BAD_REQUEST).json({
            status: Status.FAILED,
            message: "Not verified!",
        });
        return
    }
    if (!isAdmin(payload.roleId)) {
        return res.status(StatusCode.UN_AUTHORIZATION).json({
            status: Status.INVALID,
            message: "Permission denied!"
        })
    }
    next()
}

export default adminCheck