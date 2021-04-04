import express from "express";

import { AnilistRoutes } from "./anilist";
import { AuthAPIRoutes } from "./auth";
import { APIDeleteRoutes, APIGetRoutes, APIPOSTRoutes, APIPutRoutes } from "./showtimes";

const APIRoutes = express.Router();
APIRoutes.use("/showtimes", APIGetRoutes);
APIRoutes.use("/showtimes", APIPOSTRoutes);
APIRoutes.use("/showtimes", APIPutRoutes);
APIRoutes.use("/showtimes", APIDeleteRoutes);
APIRoutes.use("/auth", AuthAPIRoutes);
APIRoutes.use("/anilist", AnilistRoutes);

export { APIRoutes };
