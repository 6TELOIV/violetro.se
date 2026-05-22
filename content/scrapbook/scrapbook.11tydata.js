import path from "node:path"

export default {
    layout: "layouts/default",
    tags: "scrapbooks",
    eleventyComputed: {
        date: (data) => {
            const { dir } = path.parse(data.page.inputPath);
            return new Date(dir.match(/\d\d\d\d\/\d\d/)[0] + '/01');
        },
        shortTitle: (data) => {
            return new Date(data.date).toLocaleString("en-US", {month: "long", year: "numeric" });
        },
        title: (data) => {
            return `Scrapbook - ${data.shortTitle}`;
        },
        eleventyNavigation: (data) => {
            return {
                parent: "Scrapbook",
                key: data.shortTitle,
            }
        }
    }
}
