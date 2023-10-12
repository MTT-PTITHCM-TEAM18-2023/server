import {Status, StatusCode} from "../common/common.js";
import { createSupplier, getSupplier, getSupplierById, updateSupplier } from "../business/supplier/supplier.js"

export async function getSupplierHandler(req, res) {
    try {
        const {page, limit} = req.query
        const items = await getSupplier(page, limit)
        if (items == null) {
            res.status(StatusCode.BAD_REQUEST).json({
                status: Status.FAILED,
                message: "Failed to get supplier",
            });
            return
        }
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: "Get supplier successfully!",
            data: items
        }); 
    } catch (error) {
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.ERROR,
            message: error.message,
        });
    }
    
}

export async function getSupplierByIdHandler(req, res) {
    try {
        const {id} = req.params
        const items = await getSupplierById(id)
        if (items == null) {
            res.status(StatusCode.BAD_REQUEST).json({
                status: Status.FAILED,
                message: "Failed to get supplier",
            });
            return
        }
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: "Get supplier successfully!",
            data: items
        }); 
    } catch (error) {
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.ERROR,
            message: error.message,
        });
    }
    
}

export async function createSupplierHandler(req, res) {
    try {
        const items = await createSupplier(req.body)
        if (items == null) {
            res.status(StatusCode.BAD_REQUEST).json({
                status: Status.FAILED,
                message: "Failed to create supplier",
            });
            return
        }
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: "Create supplier successfully!",
            data: items
        });
    } catch (error) {
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.ERROR,
            message: error.message,
        });
    }
    
}

export async function updateSupplierHandler(req, res) {

    try {
        const items = await updateSupplier(req.body)
        if (items == null) {
            res.status(StatusCode.BAD_REQUEST).json({
                status: Status.FAILED,
                message: "Failed to update supplier",
            });
            return
        }
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: "Update supplier successfully!",
            data: items
        });
    } catch (error) {
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.ERROR,
            message: error.message,
        });
    }

    
}