import { Express } from "express";
import { taskRoutes } from "./tasks.routes";
import { userRoutes } from "./user.routes";
import * as middlewares from '../middlewares/auth.middlewares'
const mainRoutes = (app:Express):void=>{
  const version: string = "/api/v1";
  app.use(version + "/tasks",middlewares.requireAuth, taskRoutes);
  app.use(version + '/users',userRoutes)
}
export default mainRoutes;