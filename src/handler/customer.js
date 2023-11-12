import {Status, StatusCode} from "../common/common.js";
import CustomerBusiness from "../business/customer/customer.js"
import { MSG } from "../common/message.js";

async function get(req, res) {
    try {
        const {page, limit} = req.query
        const items = await CustomerBusiness.get(page, limit)
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

async function getById(req, res) {
    try {
        const {id} = req.params
        const items = await CustomerBusiness.getById(id)
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

async function getLoyal(req, res) {
    try {
        const {page, limit} = req.query
        const items = await CustomerBusiness.getLoyal(page, limit)
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

async function create(req, res) {
    try {
        const items = await CustomerBusiness.create(req.body)
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

async function update(req, res) {

    if (req.body.id == "" || req.body.name == "" || req.body.phone == "" || req.body.email == ""|| req.body.address == ""){
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.ERROR,
            message: MSG.CUSTOMER_INFO_INVALID,
        });
    } 
    try {
        const items = await CustomerBusiness.update(req.body)
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

const CustomerHandler = {
    get,
    getById,
    getLoyal,
    create,
    update,
}

export default CustomerHandler