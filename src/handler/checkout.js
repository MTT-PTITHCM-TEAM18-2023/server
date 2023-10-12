import { orderInStore, placeOrder } from "../business/checkout/checkout.js";
import { isValidEmail } from "../common/validate.js";
import {  Status } from "../common/common.js";
import { decodeJwt, getJwt, revokeToken } from "../middlewares/verifytoken.js";

export async function orderInStoreHandler(req, res){
    try {
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
        const item = await orderInStore(req.body.customer, req.body.items, payload.id)
        if (item == null) {
            res.send({
                status: Status.FAILED,
                message: "Failed to make order!",
            });
            return
        }
        res.send({
            status: Status.OK,
            message: "Make order sucessfully!",
            data: item
        });
    } catch (error) {
        res.send({
            status: Status.ERROR,
            message: error.message,
        });
    }
}

export async function placeOrderHandler(req, res){
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
    const email = payload.email.toLowerCase();
    if(!isValidEmail(email)) {
        res.send({
            status: Status.INVALID,
            message: "Invalid email!",
        });
        return
    }
    try {
        const item = await placeOrder(req.body.customer, email, req.body.items)
        if (item == null) {
            res.send({
                status: Status.FAILED,
                message: "Failed to place order!",
            });
            return
        }
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
                status: Status.ERROR,
                message: "Failed to logout session!",
            });
            return
        }
        res.send({
            status: Status.OK,
            message: "Place order sucessfully!",
            data: item
        });
    } catch (error) {
        res.send({
            status: Status.ERROR,
            message: error.message,
        });
    }
}