import memoize from "memoize";
import markdownIt from "markdown-it";

export default function(eleventyConfig) {

	// add a filter to render as markdown
	const md = new markdownIt({
		html: true,
	});

	eleventyConfig.addFilter("markdown", memoize((content) => {
		return md.render(content);
	}));

	// add a filter to group a collection by years
	eleventyConfig.addFilter("groupByYears", memoize((collection) => {
		return Object.entries(Object.groupBy(collection, (item) => item.data.date.getFullYear())).map((([year, items]) => ({ year, items })));
	}));

	// add a fiter for future items only
	eleventyConfig.addFilter("futureOnly", memoize((data, field = 'date') => {
		return data.filter(({ [field]: date }) => date >= now);
	}));
}