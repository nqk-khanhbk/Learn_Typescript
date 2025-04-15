"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.edit = exports.create = exports.changeMulti = exports.changeStatus = exports.detail = exports.index = void 0;
const tasks_models_1 = __importDefault(require("../models/tasks.models"));
const search_helper_1 = require("../../../helper/search.helper");
const pagination_helper_1 = require("../../../helper/pagination.helper");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const find = {
        deleted: false,
    };
    if (req.query.status) {
        find.status = req.query.status.toString();
    }
    const objectSearch = (0, search_helper_1.SearchHelper)(req.query);
    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }
    const countTasks = yield tasks_models_1.default.countDocuments(find);
    let objectPagination = (0, pagination_helper_1.paginationHelper)({
        currentPage: 1,
        limitItems: 2,
    }, req.query, countTasks);
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey.toString();
        sort[sortKey] = req.query.sortValue;
    }
    const task = yield tasks_models_1.default.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip);
    res.json(task);
});
exports.index = index;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const task = yield tasks_models_1.default.findOne({
            _id: id,
            deleted: false
        });
        res.json(task);
    }
    catch (error) {
        res.json({
            code: 404,
            message: "Lỗi",
        });
    }
});
exports.detail = detail;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body.status);
        const listStatus = ["initial", "doing", "notFinish", "finish", "pending"];
        const id = req.params.id;
        const status = req.body.status;
        if (listStatus.includes(status)) {
            yield tasks_models_1.default.updateOne({
                _id: id,
            }, {
                status: status,
            });
            res.json({
                code: 200,
                message: "Cập nhật trạng thái thành công",
            });
        }
    }
    catch (error) {
        res.json({
            code: 404,
            message: "Lỗi, không thay đổi được trạng thái khi click thay đổi",
        });
    }
});
exports.changeStatus = changeStatus;
const changeMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let Key;
        (function (Key) {
            Key["STATUS"] = "status";
            Key["DELETE"] = "delete";
        })(Key || (Key = {}));
        const ids = req.body.ids;
        const key = req.body.key;
        const value = req.body.value;
        switch (key) {
            case Key.STATUS:
                yield tasks_models_1.default.updateMany({ _id: { $in: ids } }, { status: value });
                res.json({
                    code: 200,
                    message: "Cập nhật trạng thái thành công",
                });
                break;
            case Key.DELETE:
                yield tasks_models_1.default.updateMany({ _id: { $in: ids } }, { deleted: true, deleteAt: new Date() });
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
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật trạng thái không thành công",
        });
    }
});
exports.changeMulti = changeMulti;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = new tasks_models_1.default(req.body);
        const data = yield task.save();
        res.json({
            code: 200,
            message: "Tạo thành công một task",
            data: data,
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Tạo không thành công",
        });
    }
});
exports.create = create;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield tasks_models_1.default.updateOne({ _id: id }, req.body);
        res.json({
            code: 200,
            message: "Cập nhật thành công",
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật không thành công",
        });
    }
});
exports.edit = edit;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield tasks_models_1.default.updateOne({ _id: id }, {
            deleted: true,
            deleteAt: new Date(),
        });
        res.json({
            code: 200,
            message: "Xoá thành công một Task",
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Xoá không thành công",
        });
    }
});
exports.deleteTask = deleteTask;
