import {Status, StatusCode} from "../common/common.js";
import { changeOrderStatus, getOrderByStatus, getOrderStatus, getPendingOrder } from "../business/order/order.js";


export async function getPendingOrderHandler(req, res) {
    try {
        const {page, limit} = req.query
        const items = await getPendingOrder(page, limit);
        if (items == null) {
            res.status(StatusCode.BAD_REQUEST).json({
                status: Status.FAILED,
                message: "Failed to get pending order",
            });
            return
        }
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: "Get pending order successfully!",
            data: items
        }); 
    } catch (error) {
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.ERROR,
            message: error.message,
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
                message: "Failed to get order status",
            });
            return
        }
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: "Get order status successfully!",
            data: items
        }); 
    } catch (error) {
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.ERROR,
            message: error.message,
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
                message: "Failed to get order by status",
            });
            return
        }
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: "Get order by status successfully!",
            data: items
        }); 
    } catch (error) {
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.ERROR,
            message: error.message,
        });
    }

}

export async function changeOrderStatusHandler(req, res) {
    try {
        const items = await changeOrderStatus(req.body.id, req.body.status_id);
        if (items == null) {
            res.status(StatusCode.BAD_REQUEST).json({
                status: Status.FAILED,
                message: "Failed to change order status",
            });
            return
        }
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: "Change order status successfully!",
            data: items
        }); 
    } catch (error) {
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.ERROR,
            message: error.message,
        });
    }

}