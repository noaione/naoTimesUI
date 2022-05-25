import dbConnect from "@/lib/dbConnect";
import { ShowtimesModel, ShowtimesProps } from "@/models/show";
import { NextApiResponse } from "next";

import withSession, { IUserAuth, NextApiRequestWithSession } from "@/lib/session";

async function getServerExtra(serverId: string) {
    await dbConnect();
    const serverRes = (await ShowtimesModel.findOne(
        { id: { $eq: serverId } },
        { serverowner: 1, announce_channel: 1, _id: 0 }
    ).lean()) as ShowtimesProps;
    return serverRes;
}

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    const user = req.session.get<IUserAuth>("user");
    if (user) {
        // is signed in, let's get the server info too!
        const extraMetadata = await getServerExtra(user.id);
        res.json({
            success: true,
            code: 200,
            error: "Success",
            data: {
                id: user.id,
                ...extraMetadata,
            },
        });
    } else {
        res.status(401).json({
            success: false,
            code: 401,
            error: "Unauthorized",
            data: null,
        });
    }
});
