import express from "express";
import { AuthAPIRoutes } from "./api/auth";
import { APIGetRoutes } from "./api/get";

const APIRoutes = express.Router();
APIRoutes.use("/showtimes", APIGetRoutes);
APIRoutes.use("/auth", AuthAPIRoutes);

export { APIRoutes };
