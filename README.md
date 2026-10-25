# RDM Radom — teaser site

Static teaser website for Radom (RDM), a Polish brand of modular cars. It introduces the three
models (RDM 1989, RDM 1683, RDM 966) without prices or a configurator.

## Run with Docker

The Compose file publishes no ports. It joins the external `nginx-proxy-network`, where your
reverse proxy reaches the site at `http://rdm-site:8080`.

```sh
docker network create nginx-proxy-network   # only if it doesn't exist yet
docker compose up -d --build
```

For nginx-proxy (`nginxproxy/nginx-proxy`), uncomment `VIRTUAL_HOST` / `VIRTUAL_PORT` in
`docker-compose.yml`. For Nginx Proxy Manager, add a proxy host pointing to `rdm-site`, port `8080`.

To try it locally without a proxy:

```sh
docker build -t rdm-site .
docker run -d -p 8080:8080 --read-only --tmpfs /tmp --name rdm rdm-site   # http://localhost:8080
```

The image is `nginx-unprivileged` on Alpine: it runs as a non-root user on port 8080, gzips
CSS/JS, sets cache and security headers, and answers `/healthz` for health checks.
Put a TLS-terminating proxy or load balancer in front of it for HTTPS.

## Run without Docker

No build step: open `index.html`, or run `python3 -m http.server` in this folder.

## Files

- `index.html` — page content and sections
- `css/style.css` — styles (responsive, respects reduced motion)
- `js/main.js` — model cards, exploded-view hotspots, sign-up form
- `img/` — AI-generated photos (WebP), made with the prompts in `docs/image-prompts.md`
- `Dockerfile`, `nginx.conf`, `docker-compose.yml` — container hosting

The "Keep me posted" form has no backend yet; it only shows a thank-you message.
