import express from "express";
import { APIGetRoutes, APIPOSTRoutes, APIPutRoutes, AuthAPIRoutes } from "./api/index";

const APIRoutes = express.Router();
APIRoutes.use("/showtimes", APIGetRoutes);
APIRoutes.use("/showtimes", APIPOSTRoutes);
APIRoutes.use("/showtimes", APIPutRoutes);
APIRoutes.use("/auth", AuthAPIRoutes);

export { APIRoutes };
