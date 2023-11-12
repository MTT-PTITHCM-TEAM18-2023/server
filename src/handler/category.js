import {Status, StatusCode} from "../common/common.js";
import  CategoryBusiness  from "../business/category/category.js"
import { MSG } from "../common/message.js";

async function get(req, res) {
    try {
        const {page, limit} = req.query
        const items = await CategoryBusiness.get(page, limit)
        if (items == null) {
            res.status(StatusCode.BAD_REQUEST).json({
                status: Status.FAILED,
                message: MSG.GET_CAT_FAILED,
            });
            return
        }
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: MSG.GET_CAT_SUCCESS,
            data: items
        }); 
    } catch (error) {
        console.log("INTERNAL_SERVER_ERROR: ", error.message)
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.INTERNAL_SERVER_ERROR,
        });
    }
    
}

async function getById(req, res) {
    try {
        const {id} = req.params
        const items = await CategoryBusiness.getById(id)
        if (items == null) {
            res.status(StatusCode.BAD_REQUEST).json({
                status: Status.FAILED,
                message: MSG.GET_CAT_FAILED,
            });
            return
        }
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: MSG.GET_CAT_SUCCESS,
            data: items
        }); 
    } catch (error) {
        console.log("INTERNAL_SERVER_ERROR: ", error.message)
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.INTERNAL_SERVER_ERROR,
        });
    }
    
}

async function create(req, res) {
    try {
        const items = await CategoryBusiness.create(req.body)
        if (items == null) {
            res.status(StatusCode.BAD_REQUEST).json({
                status: Status.FAILED,
                message: MSG.CREATE_CAT_FAILED,
            });
            return
        }
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: MSG.CREATE_CAT_SUCCESS,
            data: items
        });
    } catch (error) {
        console.log("INTERNAL_SERVER_ERROR: ", error.message)
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.INTERNAL_SERVER_ERROR,
        });
    }
    
}

async function update(req, res) {

    try {
        const items = await CategoryBusiness.update(req.body)
        if (items == null) {
            res.status(StatusCode.BAD_REQUEST).json({
                status: Status.FAILED,
                message: MSG.UPDATE_CAT_FAILED,
            });
            return
        }
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: MSG.UPDATE_CAT_SUCCESS,
            data: items
        });
    } catch (error) {
        console.log("INTERNAL_SERVER_ERROR: ", error.message)
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.INTERNAL_SERVER_ERROR,
        });
    }

    
}

const CategoryHandler = {
    get,
    getById,
    create,
    update,
}

export default CategoryHandler