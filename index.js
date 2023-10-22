import express from "express";
import cors from "cors";
import { initRouter } from "./src/route/router.js";
import swaggerDocs from "./src/utils/swagger.js";
import { connectDB } from "./src/database/postgresql.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
await initRouter(app);
await connectDB();
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`API server started on port ${port}`);
    swaggerDocs(app, port);
});
