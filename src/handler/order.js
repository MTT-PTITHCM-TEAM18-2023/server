import {Status, StatusCode} from "../common/common.js";
import { changeOrderStatus, getOrderByStatus, getOrderStatus, getPendingOrder, getOrderDetail } from "../business/order/order.js";
import { MSG } from "../common/message.js";



export async function getOrderDetailHandler(req, res) {
    try {
        const {id} = req.params
        const items = await getOrderDetail(id);
        if (items == null) {
            res.status(StatusCode.BAD_REQUEST).json({
                status: Status.FAILED,
                message: MSG.GET_ORDER_DETAIL_FAILED,
            });
            return
        }
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: MSG.GET_ORDER_DETAIL_SUCCESS,
            data: items
        }); 
    } catch (error) {
        console.log("INTERNAL_SERVER_ERROR: ", error.message)
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.INTERNAL_SERVER_ERROR,
        });
    }

}

export async function getPendingOrderHandler(req, res) {
    try {
        const {page, limit} = req.query
        const items = await getPendingOrder(page, limit);
        if (items == null) {
            res.status(StatusCode.BAD_REQUEST).json({
                status: Status.FAILED,
                message: MSG.GET_PENDING_ORDER_FAILED,
            });
            return
        }
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: MSG.GET_PENDING_ORDER_SUCCESS,
            data: items
        }); 
    } catch (error) {
        console.log("INTERNAL_SERVER_ERROR: ", error.message)
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.INTERNAL_SERVER_ERROR,
        });
    }

}

export async function getOrderStatusHandler(req, res) {
    try {
        const {page, limit} = req.query
        const items = await getOrderStatus(page, limit);
        if (items == null) {
            res.status(StatusCode.BAD_REQUEST).json({
                status: Status.FAILED,
                message: MSG.GET_ORDER_STATUS_FAILED,
            });
            return
        }
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: MSG.GET_ORDER_STATUS_SUCCESS,
            data: items
        }); 
    } catch (error) {
        console.log("INTERNAL_SERVER_ERROR: ", error.message)
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.INTERNAL_SERVER_ERROR,
        });
    }

}


export async function getOrderByStatusHandler(req, res) {
    try {
        const {id} = req.params
        const {page, limit} = req.query
        const items = await getOrderByStatus(id, page, limit);
        if (items == null) {
            res.status(StatusCode.BAD_REQUEST).json({
                status: Status.FAILED,
                message: MSG.GET_ORDER_BY_STATUS_FAILED,
            });
            return
        }
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: MSG.GET_ORDER_BY_STATUS_SUCCESS,
            data: items
        }); 
    } catch (error) {
        console.log("INTERNAL_SERVER_ERROR: ", error.message)
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.INTERNAL_SERVER_ERROR,
        });
    }

}

export async function changeOrderStatusHandler(req, res) {
    try {
        const items = await changeOrderStatus(req.body.id, req.body.status_id);
        if (items == null) {
            res.status(StatusCode.BAD_REQUEST).json({
                status: Status.FAILED,
                message: MSG.CHANGE_ORDER_STATUS_FAILED,
            });
            return
        }
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: MSG.CHANGE_ORDER_STATUS_SUCCESS,
            data: items
        }); 
    } catch (error) {
        console.log("INTERNAL_SERVER_ERROR: ", error.message)
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.INTERNAL_SERVER_ERROR,
        });
    }

}