import express from "express";

import { AuthAPIRoutes } from "./auth";
import { AnilistRoutes } from "./anilist";
import { APIGetRoutes, APIPOSTRoutes, APIPutRoutes } from "./showtimes";

const APIRoutes = express.Router();
APIRoutes.use("/showtimes", APIGetRoutes);
APIRoutes.use("/showtimes", APIPOSTRoutes);
APIRoutes.use("/showtimes", APIPutRoutes);
APIRoutes.use("/auth", AuthAPIRoutes);
APIRoutes.use("/anilist", AnilistRoutes);

export { APIRoutes };
