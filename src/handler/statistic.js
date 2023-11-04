import {Status, StatusCode} from "../common/common.js";
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

export async function getOutOfStockHandler(req, res) {
    try {
        const {page, limit} = req.query
        const items = await getOutOfStock(page, limit);
        if (items == null) {
            res.status(StatusCode.BAD_REQUEST).json({
                status: Status.FAILED,
                message: "Failed to out of stock product",
            });
            return
        }
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: "Get out of stock product successfully!",
            data: items
        }); 
    } catch (error) {
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.ERROR,
            message: error.message,
        });
    }

}

export async function getOwnOrderHandler(req, res) {
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
        const {page, limit} = req.query
        const items = await getOwnOrder(payload.id, page, limit);
        if (items == null) {
            res.status(StatusCode.BAD_REQUEST).json({
                status: Status.FAILED,
                message: "Failed to get order",
            });
            return
        }
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: "Get order successfully!",
            data: items
        }); 
    } catch (error) {
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.ERROR,
            message: error.message,
        });
    }

}