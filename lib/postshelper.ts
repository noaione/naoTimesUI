import fs from "fs";
import { join } from "path";

const postsDirectory = join(process.cwd(), "_posts");

export function getAboutContent() {
    const fullPath = join(postsDirectory, "about.md");
    const fileContents = fs.readFileSync(fullPath, "utf-8");

    return fileContents.toString();
}

export function getChangelogContent() {
    const fullPath = join(postsDirectory, "changelog.md");
    const fileContents = fs.readFileSync(fullPath, "utf-8");

    return fileContents.toString();
}
