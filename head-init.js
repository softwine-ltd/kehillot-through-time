// Runs first, from <head>. Kept as a file (not inline) so the Content-Security-Policy in index.html can say script-src 'self'
// without per-script hashes.

// GitHub Pages' "Enforce HTTPS" setting is the real fix; until it is switched on, send plain-HTTP visitors of the live site to HTTPS.
if (location.protocol === 'http:' && location.hostname === 'kehilot.softwine.net') {
    location.replace('https://' + location.host + location.pathname + location.search + location.hash);
}

// Google tag (gtag.js): the async loader in index.html pulls in the library; this queues the first commands for it.
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-C58QB49Z2S');
