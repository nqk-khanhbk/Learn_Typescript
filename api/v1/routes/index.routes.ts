import { Express } from "express";
import { taskRoutes } from "./tasks.routes";
const mainRoutes = (app:Express):void=>{
  const version: string = "/api/v1";
  app.use(version + "/tasks", taskRoutes);
}
export default mainRoutes;