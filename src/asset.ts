/*
  Build one URL for a file in public/.

  WHY THIS EXISTS. Vite rewrites asset URLs it can see — imports, url() in CSS,
  href and src attributes in index.html — but it cannot rewrite a string
  literal sitting in a .ts file. So `src="/assets/hero.webp"` stays exactly
  that in the bundle, which resolves against the domain root.

  That is fine when the site is served from the root of a domain. It breaks
  completely on GitHub Pages, which serves a project site from a subpath:

      served at   https://user.github.io/repo-name/
      image asks  https://user.github.io/assets/hero.webp     <- 404
      should ask  https://user.github.io/repo-name/assets/hero.webp

  `import.meta.env.BASE_URL` is whatever `--base` was set to at build time, with
  a guaranteed trailing slash. It is '/' for local dev and for a root-hosted
  deploy, so this helper costs nothing there and is the difference between a
  working and a blank page under a subpath.
*/
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
