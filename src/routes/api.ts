import express from "express";
import { AuthAPIRoutes } from "./api/auth";

const APIRoutes = express.Router();
APIRoutes.use("/auth", AuthAPIRoutes);

export { APIRoutes };
