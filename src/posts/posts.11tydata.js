// Gilt für alle Blogbeiträge in src/posts/
export default {
  layout: "layouts/post.njk",
  templateEngineOverride: "md",
  tags: ["post"],
  eleventyComputed: {
    // Neue Beiträge (z. B. aus dem CMS) bekommen automatisch /post/<dateiname>/
    permalink: (data) => data.permalink || `/post/${data.page.fileSlug}/`,
  },
};
