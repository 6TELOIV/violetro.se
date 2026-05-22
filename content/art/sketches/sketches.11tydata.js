import path from "node:path"

export default {
    layout: "layouts/sketches",
    tags: "sketches",
    eleventyComputed: {
        date: (data) => {
            const { dir } = path.parse(data.page.inputPath);
            return new Date(dir.match(/\d\d\d\d\/\d\d\/\d\d/)[0]);
        },
        shortTitle: (data) => {
            return new Date(data.date).toLocaleString("en-US", { day: "numeric", month: "long", year: "numeric" });
        },
        title: (data) => {
            return `Sketch - ${data.shortTitle}`;
        },
        description: (data) => {
            return data.page.rawInput;
        },
        eleventyNavigation: (data) => {
            return {
                parent: "Sketches",
                key: data.shortTitle
            }
        }
    }
}