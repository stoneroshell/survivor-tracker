# Favicon cache fix (one-time)

After deploying the versioned favicon (`favicon-v1.ico`):

1. **Redeploy** the app (e.g. push to Vercel or run your deploy pipeline).
2. **Clear cache once**: In your browser, hard-refresh the site (Ctrl+Shift+R or Cmd+Shift+R), or clear the site data for this origin so the new favicon loads.

Future favicon changes: bump the version (e.g. `favicon-v2.ico`), run `npm run generate-favicon` if you changed `public/images/og-image.png`, update the `icon` path in `src/app/layout.tsx`, then redeploy. No manual cache clearing is needed for new visitors after that.
