import { sendOTP, verifyOTP } from "../business/otp/otp.js";
import { isValidEmail } from "../common/validate.js";
import {  Status } from "../common/common.js";
import { generateToken } from "../middlewares/verifytoken.js";
import { MSG } from "../common/message.js";


export async function sendOTPHandler(req, res){
    if(!isValidEmail(req.body.email)) {
        res.send({
            status: Status.INVALID,
            message: MSG.INVALID_EMAIL,
        });
        return
    }
    const item = await sendOTP(req.body.email)
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

export async function verifyOTPHandler(req, res){
    if(!isValidEmail(req.body.email)) {
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
        const item = await verifyOTP(req.body.code, req.body.email.toLowerCase())
        if (item == null) {
            res.send({
                status: Status.FAILED,
                message: MSG.VERIFY_OTP_FAILED,
            });
            return
        }
        const token = await generateToken({ email: req.body.email.toLowerCase()})
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
