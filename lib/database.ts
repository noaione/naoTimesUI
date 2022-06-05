import { PrismaClient } from "@prisma/client";
import { isNone } from "./utils";

const prisma = new PrismaClient();

async function main() {
    await prisma.$connect();

    const allDatabases = await prisma.showtimesdatas.findMany();
    allDatabases.forEach((database) => {
        database.anime.forEach((project, idx) => {
            if (project.fsdb_data) {
                if (isNone(project.fsdb_data.id)) {
                    console.log(database.id, project.id, idx);
                }
            }
        });
    });
}

main()
    .catch((e) => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
