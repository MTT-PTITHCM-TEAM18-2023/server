import {Status, StatusCode} from "../common/common.js";
import { createCategory, getCategory, getCategoryById, updateCategory } from "../business/category/category.js"

export async function getCategoryHandler(req, res) {
    try {
        const {page, limit} = req.query
        const items = await getCategory(page, limit)
        if (items == null) {
            res.status(StatusCode.BAD_REQUEST).json({
                status: Status.FAILED,
                message: "Failed to get category",
            });
            return
        }
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: "Get category successfully!",
            data: items
        }); 
    } catch (error) {
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.ERROR,
            message: error.message,
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
                message: "Failed to get category",
            });
            return
        }
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: "Get category successfully!",
            data: items
        }); 
    } catch (error) {
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.ERROR,
            message: error.message,
        });
    }
    
}

export async function createCategoryHandler(req, res) {
    try {
        const items = await createCategory(req.body)
        if (items == null) {
            res.status(StatusCode.BAD_REQUEST).json({
                status: Status.FAILED,
                message: "Failed to create category",
            });
            return
        }
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: "Create catgory successfully!",
            data: items
        });
    } catch (error) {
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.ERROR,
            message: error.message,
        });
    }
    
}

export async function updateCategoryHandler(req, res) {

    try {
        const items = await updateCategory(req.body)
        if (items == null) {
            res.status(StatusCode.BAD_REQUEST).json({
                status: Status.FAILED,
                message: "Failed to update category",
            });
            return
        }
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: "Update catgory successfully!",
            data: items
        });
    } catch (error) {
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.ERROR,
            message: error.message,
        });
    }

    
}