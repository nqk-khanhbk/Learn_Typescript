import express,{Express} from "express";
import dotenv from "dotenv";
import * as database from "./config/database"
import mainRoutes from "./api/v1/routes/index.routes";
import bodyParser from"body-parser";
dotenv.config();

// kết nối với database
database.connect()

const app:Express = express();


const port:string | number = process.env.PORT || 3000;

// parse application/json
app.use(bodyParser.json())

//kết nối với routes
mainRoutes(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });