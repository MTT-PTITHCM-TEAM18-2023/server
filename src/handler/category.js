import {Status, StatusCode} from "../common/common.js";
import { createCategory, getCategory, getCategoryById, updateCategory } from "../business/category/category.js"
import { MSG } from "../common/message.js";

export async function getCategoryHandler(req, res) {
    try {
        const {page, limit} = req.query
        const items = await getCategory(page, limit)
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

export async function getCategoryByIdHandler(req, res) {
    try {
        const {id} = req.params
        const items = await getCategoryById(id)
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

export async function createCategoryHandler(req, res) {
    try {
        const items = await createCategory(req.body)
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

export async function updateCategoryHandler(req, res) {

    try {
        const items = await updateCategory(req.body)
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