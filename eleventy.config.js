import { feedPlugin } from "@11ty/eleventy-plugin-rss";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/static": "/" });
  eleventyConfig.addPassthroughCopy({ "src/static/.nojekyll": ".nojekyll" });

  // Blogbeiträge, neueste zuerst
  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("src/posts/*.md").sort((a, b) => b.date - a.date)
  );

  // Alle Themen-Tags (ohne den internen Tag "post")
  eleventyConfig.addCollection("topics", (api) => {
    const set = new Set();
    api.getFilteredByGlob("src/posts/*.md").forEach((p) =>
      (p.data.tags || []).filter((t) => t !== "post").forEach((t) => set.add(t))
    );
    return [...set].sort((a, b) => a.localeCompare(b, "de"));
  });

  const months = ["Jan.", "Feb.", "März", "Apr.", "Mai", "Juni", "Juli", "Aug.", "Sept.", "Okt.", "Nov.", "Dez."];
  eleventyConfig.addFilter("dateDe", (d) => {
    const x = new Date(d);
    return `${x.getUTCDate()}. ${months[x.getUTCMonth()]} ${x.getUTCFullYear()}`;
  });
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));
  eleventyConfig.addFilter("readingTime", (content = "") => {
    const words = content.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  });
  eleventyConfig.addFilter("head", (arr = [], n) => (n < 0 ? arr.slice(n) : arr.slice(0, n)));
  eleventyConfig.addFilter("pad", (n) => String(n).padStart(2, "0"));
  eleventyConfig.addFilter("topicTags", (tags = []) => tags.filter((t) => t !== "post"));
  eleventyConfig.addFilter("slugTag", (t) =>
    t.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
  );
  eleventyConfig.addFilter("excerpt", (s = "", n = 180) => (s.length > n ? s.slice(0, s.lastIndexOf(" ", n)) + " …" : s));
  eleventyConfig.addFilter("mailto", (subject, email) => `mailto:${email}?subject=${encodeURIComponent(subject)}`);

  // Bilder in Beiträgen: lazy loading + async decoding
  eleventyConfig.addTransform("lazyImages", (content, outputPath) => {
    if (!outputPath || !outputPath.endsWith(".html")) return content;
    return content.replace(/<img(?![^>]*loading=)/g, '<img loading="lazy" decoding="async"');
  });

  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom",
    outputPath: "/feed.xml",
    collection: { name: "posts", limit: 20 },
    metadata: {
      language: "de",
      title: "Regenerative Unternehmen – Blog",
      subtitle: "Beiträge zu regenerativem Wirtschaften",
      base: "https://www.regenerative-unternehmen.de/",
      author: { name: "Regenerative Unternehmen" },
    },
  });

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
