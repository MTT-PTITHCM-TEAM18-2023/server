import OTPBusiness from "../business/otp/otp.js";
import CommonMethod from "../common/method.js";
import {  Status } from "../common/common.js";
import Middleware from "../middlewares/middleware.js";
import { MSG } from "../common/message.js";


async function sendOTP(req, res){
    if(!CommonMethod.isValidEmail(req.body.email)) {
        res.send({
            status: Status.INVALID,
            message: MSG.INVALID_EMAIL,
        });
        return
    }
    const item = await OTPBusiness.send(req.body.email)
    if (item == null) {
        res.send({
            status: Status.FAILED,
            message: MSG.SEND_OTP_FAILED,
        });
        return
    }
    res.send({
        status: Status.OK,
        message: MSG.SEND_OTP_SUCCESS,
        data: item
    });
}

async function verifyOTP(req, res){
    if(!CommonMethod.isValidEmail(req.body.email)) {
        res.send({
            status: Status.INVALID,
            message: MSG.INVALID_EMAIL,
        });
        return
    }
    if(req.body.code == "") {
        res.send({
            status: Status.INVALID,
            message: MSG.EMPTY_OTP,
        });
        return
    }
    try {
        const item = await OTPBusiness.verify(req.body.code, req.body.email.toLowerCase())
        if (item == null) {
            res.send({
                status: Status.FAILED,
                message: MSG.VERIFY_OTP_FAILED,
            });
            return
        }
        const token = await Middleware.generateToken({ email: req.body.email.toLowerCase()})
        res.send({
            status: Status.OK,
            message: MSG.VERIFY_OTP_SUCCESS,
            data: {
                jwt: token
            }
        });
    } catch (error) {
        console.log("INTERNAL_SERVER_ERROR: ", error.message)
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.INTERNAL_SERVER_ERROR,
        });
    }
}

const CommonHandler = {
    sendOTP,
    verifyOTP,
}

export default CommonHandler