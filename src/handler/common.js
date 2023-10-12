import { sendOTP, verifyOTP } from "../business/otp/otp.js";
import { isValidEmail } from "../common/validate.js";
import {  Status } from "../common/common.js";
import { generateToken } from "../middlewares/verifytoken.js";


export async function sendOTPHandler(req, res){
    if(!isValidEmail(req.body.email)) {
        res.send({
            status: Status.INVALID,
            message: "Invalid email!",
        });
        return
    }
    const item = await sendOTP(req.body.email)
    if (item == null) {
        res.send({
            status: Status.FAILED,
            message: "Failed to send code!",
        });
        return
    }
    res.send({
        status: Status.OK,
        message: "Send code successfully!",
        data: item
    });
}

export async function verifyOTPHandler(req, res){
    if(!isValidEmail(req.body.email)) {
        res.send({
            status: Status.INVALID,
            message: "Invalid email!",
        });
        return
    }
    if(req.body.code == "") {
        res.send({
            status: Status.INVALID,
            message: "Empty code!",
        });
        return
    }
    try {
        const item = await verifyOTP(req.body.code, req.body.email.toLowerCase())
        if (item == null) {
            res.send({
                status: Status.FAILED,
                message: "Failed to verify code!",
            });
            return
        }
        const token = await generateToken({ email: req.body.email.toLowerCase()})
        res.send({
            status: Status.OK,
            message: "Verify code successfully!",
            data: {
                jwt: token
            }
        });
    } catch (error) {
        res.send({
            status: Status.ERROR,
            message: error.message,
        });
    }
}
