import withSession, { removeServerUser } from "@/lib/session";

export default withSession(async (req, res) => {
    await removeServerUser(req);
    res.setHeader("cache-control", "no-store, max-age=0");
    res.json({ loggedIn: false, error: "Success", code: 2000 });
});
