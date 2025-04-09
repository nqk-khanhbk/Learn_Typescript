import { Request, Response } from "express";
import Task from '../models/tasks.models';

export const index = async (req: Request,res: Response)=>{
    const task = await Task.find({
        deleted:false,
    });
    res.json(task)
}
export const detail = async (req: Request,res: Response)=>{
    try {
        const id = req.params.id;
        console.log(id);
        const task = await Task.findOne({
            _id:id,
            deleted:false
        });
        res.json(task);
    } catch (error) {
        res.json({
            code: 404,
            message: "Lỗi",
        });
    }
   
}

