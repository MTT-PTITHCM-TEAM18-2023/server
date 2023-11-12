import {Status, StatusCode} from "../common/common.js";
import StatisticBusiness from "../business/statistic/statistic.js";
import { MSG } from "../common/message.js";


async function getGeneral(req, res) {
    try {
        const items = await StatisticBusiness.getGeneral();
        if (items == null) {
            res.status(StatusCode.BAD_REQUEST).json({
                status: Status.FAILED,
                message: MSG.GET_STATISTIC_GENERAL_FAILED,
            });
            return
        }
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: MSG.GET_STATISTIC_GENERAL_SUCCESS,
            data: items
        }); 
    } catch (error) {
        console.log("INTERNAL_SERVER_ERROR: ", error.message)
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.INTERNAL_SERVER_ERROR,
        });
    }

}
async function getTopProduct(req, res) {
    try {
        // const {top} = req.query.top
        const items = await StatisticBusiness.getTopProduct(10);
        if (items == null) {
            res.status(StatusCode.BAD_REQUEST).json({
                status: Status.FAILED,
                message: MSG.GET_TOP_PRODUCT_FAILED,
            });
            return
        }
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: MSG.GET_TOP_PRODUCT_SUCCESS,
            data: items
        }); 
    } catch (error) {
        console.log("INTERNAL_SERVER_ERROR: ", error.message)
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.INTERNAL_SERVER_ERROR,
        });
    }

}

// async function getOutOfStock(req, res) {
//     try {
//         const {page, limit} = req.query
//         const items = await getOutOfStock(page, limit);
//         if (items == null) {
//             res.status(StatusCode.BAD_REQUEST).json({
//                 status: Status.FAILED,
//                 message: "Failed to out of stock product",
//             });
//             return
//         }
//         res.status(StatusCode.OK).json({
//             status: Status.OK,
//             message: "Get out of stock product successfully!",
//             data: items
//         }); 
//     } catch (error) {
//         res.status(StatusCode.INTERNAL_SERVER).json({
//             status: Status.ERROR,
//             message: error.message,
//         });
//     }

// }

// async function getOwnOrder(req, res) {
//     try {
//         const token = getJwt(req)
//         if(token == null) {
//             res.status(StatusCode.BAD_REQUEST).json({
//                 status: Status.FAILED,
//                 message: "Not verified!",
//             });
//             return
//         }
//         const payload = decodeJwt(token)
//         if(payload == null) {
//             res.status(StatusCode.BAD_REQUEST).json({
//                 status: Status.FAILED,
//                 message: "Not verified!",
//             });
//             return
//         }
//         const {page, limit} = req.query
//         const items = await getOwnOrder(payload.id, page, limit);
//         if (items == null) {
//             res.status(StatusCode.BAD_REQUEST).json({
//                 status: Status.FAILED,
//                 message: "Failed to get order",
//             });
//             return
//         }
//         res.status(StatusCode.OK).json({
//             status: Status.OK,
//             message: "Get order successfully!",
//             data: items
//         }); 
//     } catch (error) {
//         res.status(StatusCode.INTERNAL_SERVER).json({
//             status: Status.ERROR,
//             message: error.message,
//         });
//     }

// }

const StatisticHandler = {
    getGeneral,
    getTopProduct,
}
export default StatisticHandler