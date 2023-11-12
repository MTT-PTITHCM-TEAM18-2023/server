import {Status, StatusCode} from "../common/common.js";
import SupplierBusiness from "../business/supplier/supplier.js"
import { MSG } from "../common/message.js";

export async function get(req, res) {
    try {
        const {page, limit} = req.query
        const items = await SupplierBusiness.get(page, limit)
        if (items == null) {
            res.status(StatusCode.BAD_REQUEST).json({
                status: Status.FAILED,
                message: MSG.GET_SUPPLIER_FAILED
            });
            return
        }
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: MSG.GET_SUPPLIER_SUCCESS,
            data: items
        }); 
    } catch (error) {
        console.log("INTERNAL_SERVER_ERROR: ", error.message)
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.INTERNAL_SERVER_ERROR,
        });
    }
    
}

export async function getById(req, res) {
    try {
        const {id} = req.params
        const items = await SupplierBusiness.getById(id)
        if (items == null) {
            res.status(StatusCode.BAD_REQUEST).json({
                status: Status.FAILED,
                message: MSG.GET_SUPPLIER_FAILED
            });
            return
        }
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: MSG.GET_SUPPLIER_SUCCESS,
            data: items
        }); 
    } catch (error) {
        console.log("INTERNAL_SERVER_ERROR: ", error.message)
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.INTERNAL_SERVER_ERROR,
        });
    }
    
}

export async function create(req, res) {
    try {
        const items = await SupplierBusiness.create(req.body)
        if (items == null) {
            res.status(StatusCode.BAD_REQUEST).json({
                status: Status.FAILED,
                message: MSG.CREATE_SUPPLIER_FAILED,
            });
            return
        }
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: MSG.CREATE_SUPPLIER_SUCCESS,
            data: items
        });
    } catch (error) {
        console.log("INTERNAL_SERVER_ERROR: ", error.message)
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.INTERNAL_SERVER_ERROR,
        });
    }
    
}

export async function update(req, res) {

    try {
        const items = await SupplierBusiness.update(req.body)
        if (items == null) {
            res.status(StatusCode.BAD_REQUEST).json({
                status: Status.FAILED,
                message: MSG.UPDATE_SUPPLIER_FAILED,
            });
            return
        }
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: MSG.UPDATE_SUPPLIER_SUCCESS,
            data: items
        });
    } catch (error) {
        console.log("INTERNAL_SERVER_ERROR: ", error.message)
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.INTERNAL_SERVER_ERROR,
        });
    }

    
}

const SupplierHandler = {
    get,
    getById,
    create,
    update,
}

export default SupplierHandler