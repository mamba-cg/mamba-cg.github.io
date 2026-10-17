# Quick Wind website

## Upload to hosting

Extract quick-wind-site.zip into your public website directory (for example public_html). index.html must be directly inside that directory. Preserve the assets folder and relative paths. No Node.js, build step or database is needed on the server. Serve video files with the video/mp4 content type.

## Contents

Six English product sections, six local MP4 videos, and SVG diagrams for height/masks, shared wind and animation loops. Videos autoplay muted, inline and looping. React, Motion and fonts are included locally.

## Source maintenance

Edit src/App.jsx, src/template.html, styles.css and media.js in the source project. Run npm.cmd run build in landing-page, then python tools/build_landing_site.py from the add-on root to rebuild the hosting ZIP.
