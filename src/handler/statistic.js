import {Status, StatusCode} from "../common/common.js";
import { changeOrderStatus, getOrderByStatus, getOrderStatus, getPendingOrder } from "../business/order/order.js";
import { getGeneralStatistic, getTopProduct } from "../business/statistic/statistic.js";


export async function getGeneralStatisticHandler(req, res) {
    try {
        const items = await getGeneralStatistic();
        if (items == null) {
            res.status(StatusCode.BAD_REQUEST).json({
                status: Status.FAILED,
                message: "Failed to get general statistic",
            });
            return
        }
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: "Get general statistic successfully!",
            data: items
        }); 
    } catch (error) {
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.ERROR,
            message: error.message,
        });
    }

}

export async function getTopProductHandler(req, res) {
    try {
        // const {top} = req.query.top
        const items = await getTopProduct(10);
        if (items == null) {
            res.status(StatusCode.BAD_REQUEST).json({
                status: Status.FAILED,
                message: "Failed to get top product",
            });
            return
        }
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: "Get top product successfully!",
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