import { Request, Response } from "express";
import Task from '../models/tasks.models';
import { SearchHelper } from "../../../helper/search.helper";
import { paginationHelper } from "../../../helper/pagination.helper";
export const index = async (req: Request, res: Response) => {
    //Find
    interface Find {
        deleted: boolean;
        status?: string;
        title?: RegExp
    }
    const find: Find = {
        deleted: false,
    };
    if (req.query.status) {
        find.status = req.query.status.toString();
    }
    //End Find

    //Search
    const objectSearch = SearchHelper(req.query);
    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }
    // End Search

    // Pagination
    const countTasks = await Task.countDocuments(find);

    let objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItems: 2,
        },
        req.query,
        countTasks
    );

    //End Pagination
    // console.log(req.query.page)
    //sort(sắp xếp theo tiêu chí)
    // console.log(req.query.sortKey);
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey.toString();
        sort[sortKey] = req.query.sortValue;
    }
    //end sort
    const task = await Task.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip);
    res.json(task)
}
export const detail = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        // console.log(id);
        const task = await Task.findOne({
            _id: id,
            deleted: false
        });
        res.json(task);
    } catch (error) {
        res.json({
            code: 404,
            message: "Lỗi",
        });
    }

}
// [PATCH] /api/v1/tasks/change-status/:id
export const changeStatus = async (req: Request, res: Response) => {
    try {
        console.log(req.body.status)
        const listStatus = ["initial", "doing", "notFinish", "finish", "pending"];
        type StatusType = "initial" | "doing" | "notFinish" | "pending" | "finish";
        const id: string = req.params.id;
        const status: StatusType = req.body.status;
        if (listStatus.includes(status)) {
            await Task.updateOne(
                {
                    _id: id,
                },
                {
                    status: status,
                }
            );
            res.json({
                code: 200,
                message: "Cập nhật trạng thái thành công",
            });
        }
    } catch (error) {
        res.json({
            code: 404,
            message: "Lỗi, không thay đổi được trạng thái khi click thay đổi",
        });
    }
}

// [PATCH] /api/v1/tasks/change-multi
export const changeMulti = async (req: Request, res: Response) => {
    try {
        enum Key {
            STATUS = "status",
            DELETE = "delete"
        }

        const ids: string[] = req.body.ids;
        const key: string = req.body.key;
        const value: string = req.body.value

        switch (key) {
            case Key.STATUS:
                await Task.updateMany({ _id: { $in: ids } }, { status: value });
                res.json({
                    code: 200,
                    message: "Cập nhật trạng thái thành công",
                });
                break;
            case Key.DELETE:
                await Task.updateMany({ _id: { $in: ids } }, { deleted: true, deleteAt: new Date() });
                res.json({
                    code: 200,
                    message: "Xoá thành công nhiều task",
                });
                break;

            default:
                res.json({
                    code: 400,
                    message: "Cập nhật trạng thái không thành công",
                });
                break;
        }
    } catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật trạng thái không thành công",
        });
    }
}
//[Post]/api/v1/tasks/create
export const create = async (req: Request, res: Response)=>{
    // console.log(req.body);
    try {
        const task = new Task(req.body);
        const data = await task.save();
        res.json({
          code: 200,
          message: "Tạo thành công một task",
          data: data,
        });
      } catch (error) {
        res.json({
          code: 400,
          message: "Tạo không thành công",
        });
      }
}
// [PATCH] /api/v1/tasks/edit/:id
export const edit = async (req: Request, res: Response) => {
    try {
      const id:string = req.params.id;
      await Task.updateOne({ _id: id }, req.body);
      res.json({
        code: 200,
        message: "Cập nhật thành công",
      });
    } catch (error) {
      res.json({
        code: 400,
        message: "Cập nhật không thành công",
      });
    }
  };
// [DELETE] /api/v1/tasks/delete/:id
export const deleteTask = async (req: Request, res: Response) => {
    try {
      const id: string = req.params.id;
      await Task.updateOne(
        { _id: id },
        {
          deleted: true,
          deleteAt: new Date(),
        }
      );
      res.json({
        code: 200,
        message: "Xoá thành công một Task",
      });
    } catch (error) {
      res.json({
        code: 400,
        message: "Xoá không thành công",
      });
    }
  };