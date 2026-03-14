import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import eleventyFontAwesomePlugin from "@11ty/font-awesome";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import eleventyAutoCacheBuster from "eleventy-auto-cache-buster";
import memoize from "memoize";
import CleanCSS from "clean-css";
import markdownIt from "markdown-it";
import { RenderPlugin } from "@11ty/eleventy";

export default async function (eleventyConfig) {
	const now = new Date();

	// render files on demand from templates
	eleventyConfig.addPlugin(RenderPlugin);
	// hierarchical navigation plugin
	eleventyConfig.addPlugin(eleventyNavigationPlugin);
	// fontawesome icons plugin
	eleventyConfig.addPlugin(eleventyFontAwesomePlugin);
	// image optimization
	eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
		formats: ['svg', 'webp'],
		svgShortCircuit: true,
		sharpOptions: {
			animated: true
		},
	});
	// cache bust assets based on hash
	eleventyConfig.addPlugin(eleventyAutoCacheBuster);

	// Per-page bundles, see https://github.com/11ty/eleventy-plugin-bundle
	// Bundle <style> content and adds a {% css %} paired shortcode
	eleventyConfig.addBundle("css", {
		toFileDirectory: "dist",
		// Add all <style> content to `css` bundle (use <style eleventy:ignore> to opt-out)
		// Supported selectors: https://www.npmjs.com/package/posthtml-match-helper
		bundleHtmlContentFromSelector: "style",
		transforms: [
			// minify css
			function (content) {
				return new CleanCSS({}).minify(content).styles;
			}
		]
	});

	// Bundle <script> content and adds a {% js %} paired shortcode
	eleventyConfig.addBundle("js", {
		toFileDirectory: "dist",
		// Add all <script> content to the `js` bundle (use <script eleventy:ignore> to opt-out)
		// Supported selectors: https://www.npmjs.com/package/posthtml-match-helper
		bundleHtmlContentFromSelector: "script",
	});

	// add a filter to render as markdown
	const md = new markdownIt({
		html: true,
	});

	eleventyConfig.addFilter("markdown", memoize((content) => {
		return md.render(content);
	}));

	// add a fiter for future items only
	eleventyConfig.addFilter("futureOnly", memoize((data, field = 'date') => {
		return data.filter(({ [field]: date }) => date >= now);
	}));

	// expose the build date
	eleventyConfig.addShortcode("currentBuildDate", () => {
		return now.toISOString();
	});

    // copy files thru raw from here
	eleventyConfig.addPassthroughCopy({ "public": "/" });

	// liquid needs an explicit list of allowed references to allow including folders like node_modules
	// https://github.com/11ty/eleventy/issues/3502#issuecomment-2436040052
	eleventyConfig.setLiquidOptions({
		root: ['./content', './_includes', '.']
	});
};

export const config = {
	dir: {
		input: "content",          // default: "."
		includes: "../_includes",  // default: "_includes" (`input` relative)
		data: "../_data",          // default: "_data" (`input` relative)
		output: "_site"
	}
};