import { NextFunction, Request, Response } from "express";
import User from "../models/users.models";

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  //   console.log(req.headers.authorization)
      if (req.headers.authorization) {
          const token = req.headers.authorization.split(" ")[1];
          const user = await User.findOne({
              token: token,
              deleted: false,
          }).select("-password");
          if (!user) {
              res.json({
                  code: 400,
                  message: "Token ko hợp lệ!",
              });
          }
          req['user'] = user;
          next();
      }
      else {
          res.json({
              code: 403,
              message: "Không có quyền truy cập",
          });
      }
};