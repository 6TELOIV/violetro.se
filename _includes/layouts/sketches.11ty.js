import path from "node:path"
import fs from "node:fs/promises"

export const data = {
    layout: "layouts/base",
};
export async function render(data) {
    // the file should be something like ./content/art/sketches/2026/02/25/index.md
    // I get the adjacent media folder to find the images and their caption files, i.e
    // - ./content/art/sketches/2026/02/25/media/#.png
    // - ./content/art/sketches/2026/02/25/media/#.md

    const { dir } = path.parse(data.page.inputPath);
    const mediaFiles = {};
    for (const name of await fs.readdir(`${dir}/media`)) {
        const key = name.charAt(0);
        mediaFiles[key] ??= {};
        if (name.endsWith(".md")) {
            mediaFiles[key]["md"] = `${dir}/media/${name}`;
        } else {
            if (mediaFiles[key]["img"]) {
                throw new Error("Cannot have multiple images with same name in a gallery")
            }
            mediaFiles[key]["img"] = `media/${name}`;
        }
    }
    
    return `${data.content}
    ${await Promise.all(Object.values(mediaFiles).map(async ({md, img}) => 
        `<figure>
            <img src="${img}" alt="" width="512">
            ${md ? `<figcaption>
                ${await this.renderFile(md)}
            </figcaption>` : ""}
        </figure>`
    ))}`;
}