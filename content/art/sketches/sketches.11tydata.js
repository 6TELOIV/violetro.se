import path from "node:path"

export default {
    layout: "layouts/sketches",
    tags: "sketches",
    eleventyComputed: {
        date: (data) => {
            const { dir } = path.parse(data.page.inputPath);
            return new Date(dir.match(/\d\d\d\d\/\d\d\/\d\d/)[0]);
        },
        title: (data) => {
            return new Date(data.date).toLocaleString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
        },
        description: (data) => {
            return data.page.rawInput;
        },
        eleventyNavigation: (data) => {
            return {
                parent: "Sketches",
                key: data.title,
            }
        }
    }
}