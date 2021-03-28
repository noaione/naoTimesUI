import express from "express";
import { APIGetRoutes, APIPOSTRoutes, AuthAPIRoutes } from "./api/index";

const APIRoutes = express.Router();
APIRoutes.use("/showtimes", APIGetRoutes);
APIRoutes.use("/showtimes", APIPOSTRoutes);
APIRoutes.use("/auth", AuthAPIRoutes);

export { APIRoutes };
