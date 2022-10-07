import withSession, { getServerUser } from "@/lib/session";
import prisma from "@/lib/prisma";

export default withSession(async (req, res) => {
    const reqData = await req.body;
    const user = getServerUser(req);
    if (!user) {
        res.status(403).json({ message: "Unauthorized", code: 403, success: false });
    } else if (!reqData) {
        res.status(400).json({ message: "Tidak ada body yang diberikan :(", code: 400, success: false });
    } else {
        const oldUserData = await prisma.showtimesuilogin.findFirst({
            where: { id: user.id },
        });
        if (oldUserData.secret !== reqData.old) {
            res.status(400).json({ message: "Password lama salah!", code: 4001, success: false });
        } else {
            await prisma.showtimesuilogin.update({
                where: { mongo_id: oldUserData.mongo_id },
                data: {
                    secret: reqData.new,
                },
            });
            res.json({ message: "success", code: 200, success: true });
        }
    }
});
