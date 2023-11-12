import {Status, StatusCode} from "../common/common.js";
import OrderBusiness from "../business/order/order.js";
import { MSG } from "../common/message.js";



async function getDetail(req, res) {
    try {
        const {id} = req.params
        const items = await OrderBusiness.getDetail(id);
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

async function getPending(req, res) {
    try {
        const {page, limit} = req.query
        const items = await OrderBusiness.getPending(page, limit);
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

async function getStatus(req, res) {
    try {
        const {page, limit} = req.query
        const items = await OrderBusiness.getStatus(page, limit);
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


async function getByStatus(req, res) {
    try {
        const {id} = req.params
        const {page, limit} = req.query
        const items = await OrderBusiness.getByStatus(id, page, limit);
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

async function changeStatus(req, res) {
    try {
        const items = await OrderBusiness.changeStatus(req.body.id, req.body.status_id);
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
        res.status(StatusCode.BAD_REQUEST).json({
            status: Status.CHANGE_ORDER_STATUS_FAILED,
        });
    }

}

const OrderHandler = {
    getDetail,
    getPending,
    getStatus,
    changeStatus,
    getByStatus,
}

export default OrderHandler