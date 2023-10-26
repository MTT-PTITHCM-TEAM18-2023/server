import {Status, StatusCode} from "../common/common.js";
import { createCustomer, getCustomer, getCustomerById, updateCustomer } from "../business/customer/customer.js"
import { getLoyalCustomer } from "../business/customer/customer.js";
import { MSG } from "../common/message.js";

export async function getCustomerHandler(req, res) {
    try {
        const {page, limit} = req.query
        const items = await getCustomer(page, limit)
        if (items == null) {
            res.status(StatusCode.BAD_REQUEST).json({
                status: Status.FAILED,
                message: "Failed to get customer",
            });
            return
        }
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: "Get customer successfully!",
            data: items
        }); 
    } catch (error) {
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.ERROR,
            message: error.message,
        });
    }
    
}

export async function getCustomerByIdHandler(req, res) {
    try {
        const {id} = req.params
        const items = await getCustomerById(id)
        if (items == null) {
            res.status(StatusCode.BAD_REQUEST).json({
                status: Status.FAILED,
                message: "Failed to get customer",
            });
            return
        }
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: "Get customer successfully!",
            data: items
        }); 
    } catch (error) {
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.ERROR,
            message: error.message,
        });
    }
    
}

export async function getLoyalCustomerHandler(req, res) {
    try {
        const {page, limit} = req.query
        const items = await getLoyalCustomer(page, limit)
        if (items == null) {
            res.status(StatusCode.BAD_REQUEST).json({
                status: Status.FAILED,
                message: "Failed to get loyal customer",
            });
            return
        }
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: "Get loyal customer successfully!",
            data: items
        }); 
    } catch (error) {
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.ERROR,
            message: error.message,
        });
    }
    
}

export async function createCustomerHandler(req, res) {
    try {
        const items = await createCustomer(req.body)
        if (items == null) {
            res.status(StatusCode.BAD_REQUEST).json({
                status: Status.FAILED,
                message: "Failed to create customer",
            });
            return
        }
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: "Create customer successfully!",
            data: items
        });
    } catch (error) {
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.ERROR,
            message: error.message,
        });
    }
    
}

export async function updateCustomerHandler(req, res) {

    if (req.body.id == "" || req.body.name == "" || req.body.phone == "" || req.body.email == ""|| req.body.address == ""){
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.ERROR,
            message: MSG.CUSTOMER_INFO_INVALID,
        });
    } 
    try {
        const items = await updateCustomer(req.body)
        if (items == null) {
            res.status(StatusCode.BAD_REQUEST).json({
                status: Status.FAILED,
                message: MSG.UPDATE_CUSTOMER_FAILED,
            });
            return
        }
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: MSG.UPDATE_CUSTOMER_SUCCESS,
            data: items
        });
    } catch (error) {
        console.log("INTERNAL_SERVER_ERROR: ", error.message)
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.INTERNAL_SERVER_ERROR,
        });
    }
}