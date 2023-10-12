import {Status, StatusCode} from "../common/common.js";
import { decodeJwt, generateToken, getJwt, revokeToken } from "../middlewares/verifytoken.js";
import UserBusiness from "../business/user/user.js";
import {sendEmail} from "../common/email.js";
import { generateRandomString } from "../common/strings.js";

const logout = async (req, res) => {
    const token = getJwt(req)
    if(token == null) {
        res.status(StatusCode.BAD_REQUEST).json({
            status: Status.FAILED,
            message: "Not verified!",
        });
        return
    }
    const rv = await revokeToken(token)
    if(rv == null) {
        res.send({
            status: Status.OK,
            message: "Failed to logout session!"
        });
        return
    }
    res.send({
        status: Status.OK,
        message: "Logout successfully!",
    });
}

const login = async (req, res) => {

    if (req.body.email === "" || req.body.password === "") {
        res.send({
            status: Status.INVALID,
            message: "Invalid email or password!",
        });
        return
    }

    const item = await UserBusiness.login(req.body.email, req.body.password)
    if (item == null) {
        res.status(StatusCode.UN_AUTHENTICATION).json({
            status: Status.FAILED,
            message: "Login failed!",
        });
        return
    }
    const token = await generateToken({ email: req.body.email.toLowerCase(), roleId: item.roleId , id: item.id})
    res.status(StatusCode.OK).json({
        status: Status.OK,
        message: "Login successfully!",
        data: {
            jwt: token,
            roleId: item.roleId,
        }
    });
}

const getProfile = async (req, res) => {
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
    const item = await UserBusiness.getProfile(payload.email.toLowerCase())
    if (item == null) {
        res.status(StatusCode.BAD_REQUEST).json({
            status: Status.FAILED,
            message: "Failed to get profile",
        });
        return
    }

    res.status(StatusCode.OK).json({
        status: Status.OK,
        message: "Get profile successfully!",
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
    const {email, newPassword} = req.body
    const item = await UserBusiness.changePassword(email.toLowerCase(), newPassword)
    if (item == null) {
        res.status(StatusCode.BAD_REQUEST).json({
            status: Status.FAILED,
            message: "Failed to change password!",
        });
        return
    }
    res.status(StatusCode.OK).json({
        status: Status.OK,
        message: "Change password successfully!",
    });
    return
}

const sendPassword = async (req, res) => {
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
    const newPass = generateRandomString(10)
    const email = payload.email
    const item = await UserBusiness.changePassword(email, newPass)
    if (item == null) {
        res.status(StatusCode.BAD_REQUEST).json({
            status: Status.FAILED,
            message: "Failed to change password!",
        });
        return
    }
    const rv = await revokeToken(token)
    if(rv == null) {
        res.send({
            status: Status.ERROR,
            message: "Failed to logout session!",
        });
        return
    }
    const content = `Mật khẩu của bạn đã được thay đổi. Mật khẩu mới là ${newPass}. `
    await sendEmail(email, "Mật khẩu mới", content)
    res.status(StatusCode.CREATED).json({
        status: Status.CREATED,
        message: "New password has been sent to your email!"
    })
    return
}

const get = async (req, res) => {
    const {page, limit} = req.body
    const items = await UserBusiness.get(page, limit)

    if (items) {
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: "Get users successfully!",
            data: items
        })
    } else {
        res.status(StatusCode.BAD_REQUEST).json({
            status: Status.FAILED,
            message: "Get users failed!"
        })
    }
}

const getById = async (req, res) => {
    const {id} = req.params

    const user = await UserBusiness.getById(id)

    if (user) {
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: "Get users successfully!",
            data: user
        })
    } else {
        res.status(StatusCode.BAD_REQUEST).json({
            status: Status.FAILED,
            message: "Get user failed!"
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
            message: "An user has been created!"
        })
    } else {
        res.status(StatusCode.BAD_REQUEST).json({
            status: Status.FAILED,
            message: "Create user failed!"
        })
    }
}

const update = async (req, res) => {
    const data = req.body

    const updated = await UserBusiness.update(data.email, data)

    if (updated) {
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: "Update user successfully!",
            data
        })
    } else {
        res.status(StatusCode.BAD_REQUEST).json({
            status: Status.FAILED,
            message: "Update user failed!"
        })
    }
}

const deleteById = async (req, res) => {
    const {id} = req.params
    const deleted = await UserBusiness.deleteById(id)

    if (deleted) {
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: "Delete user successfully!"
        })
    } else {
        res.status(StatusCode.BAD_REQUEST).json({
            status: Status.FAILED,
            message: "Delete user failed!"
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