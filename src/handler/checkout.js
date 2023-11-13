import CheckoutBusiness from "../business/checkout/checkout.js";
import CommonMethod from "../common/method.js";
import {  Status } from "../common/common.js";
import Middleware from "../middlewares/middleware.js";
import { MSG } from "../common/message.js";

async function orderInStore(req, res){
    try {
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
        const item = await CheckoutBusiness.orderInStore(req.body.customer, req.body.items, payload.id)
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

async function placeOrder(req, res){
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
    const email = payload.email.toLowerCase();
    if(!CommonMethod.isValidEmail(email)) {
        res.send({
            status: Status.INVALID,
            message: MSG.INVALID_EMAIL,
        });
        return
    }
    try {
        const item = await CheckoutBusiness.placeOrder(req.body.customer, email, req.body.items)
        if (item == null) {
            res.send({
                status: Status.FAILED,
                message: MSG.PLACE_ORDER_FAILED,
            });
            return
        }
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

const CheckoutHandler = {
    orderInStore,
    placeOrder,
}

export default CheckoutHandler