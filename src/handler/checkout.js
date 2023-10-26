import { orderInStore, placeOrder } from "../business/checkout/checkout.js";
import { isValidEmail } from "../common/validate.js";
import {  Status } from "../common/common.js";
import { decodeJwt, getJwt, revokeToken } from "../middlewares/verifytoken.js";
import { MSG } from "../common/message.js";

export async function orderInStoreHandler(req, res){
    try {
        const token = getJwt(req)
        if(token == null) {
            res.status(StatusCode.BAD_REQUEST).json({
                status: Status.FAILED,
                message: MSG.NOT_VERIFIED,
            });
            return
        }
        const payload = decodeJwt(token)
        if(payload == null) {
            res.status(StatusCode.BAD_REQUEST).json({
                status: Status.FAILED,
                message: MSG.NOT_VERIFIED,
            });
            return
        }
        const item = await orderInStore(req.body.customer, req.body.items, payload.id)
        if (item == null) {
            res.send({
                status: Status.FAILED,
                message: MSG.MAKE_ORDER_FAILED
            });
            return
        }
        res.send({
            status: Status.OK,
            message: MSG.MAKE_ORDER_SUCCESS,
            data: item
        });
    } catch (error) {
        console.log("INTERNAL_SERVER_ERROR: ", error.message)
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.INTERNAL_SERVER_ERROR,
        });
    }
}

export async function placeOrderHandler(req, res){
    const token = getJwt(req)
    if(token == null) {
        res.status(StatusCode.BAD_REQUEST).json({
            status: Status.FAILED,
            message: MSG.NOT_VERIFIED,
        });
        return
    }
    const payload = decodeJwt(token)
    if(payload == null) {
        res.status(StatusCode.BAD_REQUEST).json({
            status: Status.FAILED,
            message: MSG.NOT_VERIFIED,
        });
        return
    }
    const email = payload.email.toLowerCase();
    if(!isValidEmail(email)) {
        res.send({
            status: Status.INVALID,
            message: MSG.INVALID_EMAIL,
        });
        return
    }
    try {
        const item = await placeOrder(req.body.customer, email, req.body.items)
        if (item == null) {
            res.send({
                status: Status.FAILED,
                message: MSG.PLACE_ORDER_FAILED,
            });
            return
        }
        const token = getJwt(req)
        if(token == null) {
            res.status(StatusCode.BAD_REQUEST).json({
                status: Status.FAILED,
                message: MSG.NOT_VERIFIED,
            });
            return
        }
        const rv = await revokeToken(token)
        if(rv == null) {
            console.log("INTERNAL_SERVER_ERROR: ", "Failed to logout session!")
            res.status(StatusCode.INTERNAL_SERVER).json({
                status: Status.INTERNAL_SERVER_ERROR,
            });
            return
        }
        res.send({
            status: Status.OK,
            message: MSG.PLACE_ORDER_SUCCESS,
            data: item
        });
    } catch (error) {
        console.log("INTERNAL_SERVER_ERROR: ", error.message)
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.INTERNAL_SERVER_ERROR,
        });
    }
}