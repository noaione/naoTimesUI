import { createSchema, ExtractProps, Type, typedModel } from "ts-mongoose";

const ShowAnimeSchemas = createSchema(
    {
        id: Type.string({ required: true }),
        mal_id: Type.string(),
        title: Type.string({ required: true }),
        role_id: Type.string(),
        start_time: Type.number(),
        assignments: Type.object({ required: true }).of({
            TL: Type.object({ required: true }).of({
                id: Type.string(),
                name: Type.string(),
            }),
            TLC: Type.object({ required: true }).of({
                id: Type.string(),
                name: Type.string(),
            }),
            ENC: Type.object({ required: true }).of({
                id: Type.string(),
                name: Type.string(),
            }),
            ED: Type.object({ required: true }).of({
                id: Type.string(),
                name: Type.string(),
            }),
            TM: Type.object({ required: true }).of({
                id: Type.string(),
                name: Type.string(),
            }),
            TS: Type.object({ required: true }).of({
                id: Type.string(),
                name: Type.string(),
            }),
            QC: Type.object({ required: true }).of({
                id: Type.string(),
                name: Type.string(),
            }),
        }),
        status: Type.array({ required: true }).of({
            episode: Type.number({ required: true }),
            is_done: Type.boolean({ required: true }),
            progress: Type.object({ required: true }).of({
                TL: Type.boolean({ required: true }),
                TLC: Type.boolean({ required: true }),
                ENC: Type.boolean({ required: true }),
                ED: Type.boolean({ required: true }),
                TM: Type.boolean({ required: true }),
                TS: Type.boolean({ required: true }),
                QC: Type.boolean({ required: true }),
            }),
            airtime: Type.number(),
        }),
        poster_data: Type.object({ required: true }).of({
            url: Type.string({ required: true }),
            color: Type.number(),
        }),
        fsdb_data: Type.object().of({
            id: Type.number(),
            ani_id: Type.number(),
        }),
        aliases: Type.array({ required: true }).of(Type.string()),
        kolaborasi: Type.array().of(Type.string()),
        last_update: Type.number({ required: true }),
    },
    { versionKey: false, _id: false }
);

const ShowtimesSchemas = createSchema(
    {
        _id: Type.objectId({ required: false }),
        id: Type.string({ required: true }),
        name: Type.string(),
        fsdb_id: Type.number(),
        serverowner: Type.array({ required: true }).of(Type.string()),
        announce_channel: Type.string(),
        anime: Type.array({ required: true }).of(ShowAnimeSchemas),
        konfirmasi: Type.array({ required: true }).of({
            id: Type.string({ required: true }),
            server_id: Type.string({ required: true }),
            anime_id: Type.string({ required: true }),
        }),
    },
    {
        versionKey: false,
        _id: false,
    }
);

const ShowAdminSchemas = createSchema(
    {
        _id: Type.objectId({ required: false }),
        id: Type.string({ required: true }),
        servers: Type.array({ required: true }).of(Type.string({ required: true })),
    },
    {
        _id: false,
        versionKey: false,
    }
);

export type ShowAnimeProps = ExtractProps<typeof ShowAnimeSchemas>;
export type ShowtimesProps = ExtractProps<typeof ShowtimesSchemas>;
export type ShowAdminProps = ExtractProps<typeof ShowAdminSchemas>;
export const ShowtimesModel = typedModel("showtimesdatas", ShowtimesSchemas);
export const ShowAdminModel = typedModel("showtimesadmin", ShowAdminSchemas, "showtimesadmin");
