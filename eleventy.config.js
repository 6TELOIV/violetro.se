import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import eleventyFontAwesomePlugin from "@11ty/font-awesome";
import Image, { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import eleventyAutoCacheBuster from "eleventy-auto-cache-buster";
import CleanCSS from "clean-css";
import { RenderPlugin } from "@11ty/eleventy";


import pluginFilters from "./_config/filters.js";

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
	// add our own filters
	eleventyConfig.addPlugin(pluginFilters);

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

	// expose the build date
	eleventyConfig.addShortcode("currentBuildDate", () => {
		return now.toISOString();
	});

	// image handling for links
	eleventyConfig.addShortcode("image", async function (src) {
		return await Image(src, {
			widths: [1920],
			formats: ["webp"],
			sharpWebpOptions: {
				lossless: true
			},
			outputDir: "_site/img"
		});
	});

	// copy files thru raw from here
	eleventyConfig.addPassthroughCopy({ "public": "/" });
	eleventyConfig.addPassthroughCopy({ "node_modules/photoswipe": "/photoswipe" });

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