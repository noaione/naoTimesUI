import { createSchema, ExtractProps, Type, typedModel } from "ts-mongoose";

export const UserPrivilege = ["server", "owner"] as const;

const UserSchemas = createSchema(
    {
        _id: Type.objectId({ required: false }),
        id: Type.string({ required: true }),
        secret: Type.string({ required: true }),
        privilege: Type.string({ required: true, enum: UserPrivilege }),
    },
    {
        versionKey: false,
        _id: false,
    }
);

export type UserProps = ExtractProps<typeof UserSchemas>;
export const UserModel = typedModel("showtimesuilogin", UserSchemas, "showtimesuilogin");
