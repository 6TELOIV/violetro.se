import path from "node:path"

export default {
    layout: "layouts/sketches",
    eleventyComputed: {
        title: (data) => {
            const { dir } = path.parse(data.page.inputPath);
            const date = new Date(dir.match(/\d\d\d\d\/\d\d\/\d\d/)[0]);
            return date.toLocaleString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
        },
        eleventyNavigation: (data) => {
            return {
                parent: "Sketches",
                key: data.title,
            }
        }
    }
}