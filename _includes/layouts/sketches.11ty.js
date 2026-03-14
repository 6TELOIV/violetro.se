import path from "node:path"
import fs from "node:fs/promises"

export const data = {
    layout: "layouts/default",
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

    // find the prev and next pages if any exist
    let prev = this.getPreviousCollectionItem(data.collections.sketches, data.page);
    let next = this.getNextCollectionItem(data.collections.sketches, data.page);
    return (
`
<style>
    .sketch {
        border: 1px solid ButtonBorder;
        background-color: ButtonFace;
        color: ButtonText;
        margin-inline: 0;
    }
    .sketch>img {
        display: block;
        width: 100%;
    }
    .sketch>figcaption {
        border-top: 1px solid ButtonBorder;
    }
</style>
<h1>${data.title}</h1>
<p><small>${prev ? `<a href="${prev.url}">Previous</a>` : ""} ${next ? `<a href="${next.url}">Next</a>` : ""}</small></p>
${data.content}
<div class="container--sm">
    ${(await Promise.all(Object.values(mediaFiles).map(async ({md, img}) => 
        `<figure class="sketch">
            <img src="${img}" alt="" width="574">
            ${md ? `<figcaption>
                ${await this.renderFile(md)}
            </figcaption>` : ""}
        </figure>`
    ))).join('\n')}
</div>`
    );
}