import {Status, StatusCode} from "../common/common.js";
import Middleware from "../middlewares/middleware.js";
import UserBusiness from "../business/user/user.js";
import CommonMethod from "../common/method.js";
import { MSG } from "../common/message.js";

const logout = async (req, res) => {
    const token = Middleware.getJwt(req)
    if(token == null) {
        res.status(StatusCode.BAD_REQUEST).json({
            status: Status.FAILED,
            message: MSG.NOT_VERIFIED,
        });
        return
    }
    const rv = await Middleware.revokeToken(token)
    if(rv == null) {
        console.log("INTERNAL_SERVER_ERROR: ", "Failed to logout session!")
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.INTERNAL_SERVER_ERROR,
        });
        return
    }
    res.send({
        status: Status.OK,
        message: MSG.LOG_OUT_SUCCESS,
    });
}

const login = async (req, res) => {

    if (req.body.email === "" || req.body.password === "") {
        res.send({
            status: Status.INVALID,
            message: MSG.INVALID_EMAIL_OR_PASS,
        });
        return
    }

    const item = await UserBusiness.login(req.body.email, req.body.password)
    if (item == null) {
        res.status(StatusCode.UN_AUTHENTICATION).json({
            status: Status.FAILED,
            message: MSG.LOG_IN_FAILED,
        });
        return
    }
    const token = await Middleware.generateToken({ email: req.body.email.toLowerCase(), roleId: item.roleId , id: item.id})
    res.status(StatusCode.OK).json({
        status: Status.OK,
        message: MSG.LOG_IN_SUCCESS,
        data: {
            jwt: token,
            roleId: item.roleId,
        }
    });
}

const getProfile = async (req, res) => {
    const token = Middleware.getJwt(req)
    if(token == null) {
        res.status(StatusCode.BAD_REQUEST).json({
            status: Status.FAILED,
            message: MSG.NOT_VERIFIED,
        });
        return
    }
    const payload = Middleware.decodeJwt(token)
    if(payload == null) {
        res.status(StatusCode.BAD_REQUEST).json({
            status: Status.FAILED,
            message: MSG.NOT_VERIFIED,
        });
        return
    }
    const item = await UserBusiness.getProfile(payload.email.toLowerCase())
    if (item == null) {
        res.status(StatusCode.BAD_REQUEST).json({
            status: Status.FAILED,
            message: MSG.GET_PROFILE_FAILED,
        });
        return
    }

    res.status(StatusCode.OK).json({
        status: Status.OK,
        message: MSG.GET_PROFILE_SUCCESS,
        data: {
            email: item.email,
            roleId: item.role_id,
            name: item.name,
            phone: item.phone,
            address: item.address,
        }
    });
}

const changePassword = async (req, res) => {
    const token = Middleware.getJwt(req)
    if(token == null) {
        res.status(StatusCode.BAD_REQUEST).json({
            status: Status.FAILED,
            message: NOT_VERIFIED,
        });
        return
    }
    const payload = Middleware.decodeJwt(token)
    if(payload == null) {
        res.status(StatusCode.BAD_REQUEST).json({
            status: Status.FAILED,
            message: NOT_VERIFIED,
        });
        return
    }
    const {email, newPassword} = req.body
    const item = await UserBusiness.changePassword(email.toLowerCase(), newPassword)
    if (item == null) {
        res.status(StatusCode.BAD_REQUEST).json({
            status: Status.FAILED,
            message: MSG.CHANGE_PASS_FAILED
        });
        return
    }
    res.status(StatusCode.OK).json({
        status: Status.OK,
        message: MSG.CHANGE_PASS_SUCCESS,
    });
    return
}

const sendPassword = async (req, res) => {
    const token = Middleware.getJwt(req)
    if(token == null) {
        res.status(StatusCode.BAD_REQUEST).json({
            status: Status.FAILED,
            message: MSG.NOT_VERIFIED,
        });
        return
    }
    const payload = Middleware.decodeJwt(token)
    if(payload == null) {
        res.status(StatusCode.BAD_REQUEST).json({
            status: Status.FAILED,
            message: MSG.NOT_VERIFIED,
        });
        return
    }
    const newPass = CommonMethod.generateRandomString(10)
    const email = payload.email
    const item = await UserBusiness.changePassword(email, newPass)
    if (item == null) {
        res.status(StatusCode.BAD_REQUEST).json({
            status: Status.FAILED,
            message: MSG.CHANGE_PASS_FAILED,
        });
        return
    }
    const rv = await Middleware.revokeToken(token)
    if(rv == null) {
        res.send({
            status: Status.ERROR,
            message: MSG.LOG_OUT_SESSION_FAILED,
        });
        return
    }
    const content = `Mật khẩu của bạn đã được thay đổi. Mật khẩu mới là ${newPass}. `
    await CommonMethod.sendEmail(email, "Mật khẩu mới", content)
    res.status(StatusCode.CREATED).json({
        status: Status.CREATED,
        message: MSG.SEND_PASS_EMAIL
    })
    return
}

const get = async (req, res) => {
    const {page, limit} = req.body
    const items = await UserBusiness.get(page, limit)

    if (items) {
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: MSG.GET_PROFILE_SUCCESS,
            data: items
        })
    } else {
        res.status(StatusCode.BAD_REQUEST).json({
            status: Status.FAILED,
            message: MSG.GET_PROFILE_FAILED
        })
    }
}

const getById = async (req, res) => {
    const {id} = req.params

    const user = await UserBusiness.getById(id)

    if (user) {
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: MSG.GET_PROFILE_SUCCESS,
            data: user
        })
    } else {
        res.status(StatusCode.BAD_REQUEST).json({
            status: Status.FAILED,
            message: MSG.GET_PROFILE_FAILED
        })
    }
}

const create = async (req, res) => {
    const data = req.body
    const created = await UserBusiness.create(data)
    if (created) {
        const content = `Tài khoản của bạn đã được tạo. Mật khẩu là ${data.password}. `
        await sendEmail(data.email, "Tạo mới tài khoản", content)

        res.status(StatusCode.CREATED).json({
            status: Status.CREATED,
            message: MSG.CREATE_USER_SUCCESS
        })
    } else {
        res.status(StatusCode.BAD_REQUEST).json({
            status: Status.FAILED,
            message: MSG.CREATE_USER_FAILED
        })
    }
}

const update = async (req, res) => {
    const data = req.body

    const updated = await UserBusiness.update(data.email, data)

    if (updated) {
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: MSG.UPDATE_USER_SUCCESS,
            data
        })
    } else {
        res.status(StatusCode.BAD_REQUEST).json({
            status: Status.FAILED,
            message: MSG.UPDATE_USER_FAILED
        })
    }
}

const deleteById = async (req, res) => {
    const {id} = req.params
    const deleted = await UserBusiness.deleteById(id)

    if (deleted) {
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: MSG.DELETE_USER_SUCCESS
        })
    } else {
        res.status(StatusCode.BAD_REQUEST).json({
            status: Status.FAILED,
            message: MSG.DELETE_USER_FAILED
        })
    }
}
const UserHandlers = {
    login,
    logout,
    changePassword,
    getProfile,
    get,
    getById,
    create,
    update,
    deleteById,
    sendPassword
}

export default UserHandlers