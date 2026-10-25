# RDM — modular car concept site

Static website for RDM, a fictional design concept for affordable, modular cars inspired by Poland.
It presents three concept models (RDM 1989, RDM 1683, RDM 966). RDM is not a real company, the cars
don't exist and nothing is for sale. All images are AI-generated. The page has no forms.

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

## GitHub Actions and Portainer

`.github/workflows/docker.yml` builds the image, smoke-tests it and publishes it to the GitHub
Container Registry as `ghcr.io/dwzg/radom`:

| Event | Image tags pushed |
|---|---|
| Pull request | none (build and test only) |
| Push to `main` | `sha-<short-sha>`, `latest` |
| Git tag `v1.2.0` | `sha-<short-sha>`, `1.2.0`, `1.2` |

The package appears under the repository's **Packages**. It's private by default for a private
repo — make it public in the package settings, or give Portainer a token to pull it.

**Redeploy with Portainer (optional)**

1. If the package is private, add `ghcr.io` as a registry in Portainer, with your GitHub username
   and a personal access token that has `read:packages`.
2. Create a stack from `deploy/docker-compose.yml`. It runs `ghcr.io/dwzg/radom:latest`.
3. Turn on the stack's webhook with "re-pull image" enabled, and copy its URL.
4. In GitHub → Settings → Secrets and variables → Actions, add the secret `PORTAINER_WEBHOOK_URL`.

After `latest` is pushed from `main`, the `deploy` job calls the webhook and Portainer pulls the new
image. Without the secret, the deploy step is skipped. The job runs in the `production` environment,
so you can add a required reviewer there to make each deploy wait for approval.

## Run without Docker

No build step: open `index.html`, or run `python3 -m http.server` in this folder.

## Files

- `index.html` — page content and sections
- `css/style.css` — styles (responsive, respects reduced motion)
- `js/main.js` — model cards, exploded-view hotspots, navigation
- `img/` — AI-generated photos (WebP), made with the prompts in `docs/image-prompts.md`
- `Dockerfile`, `nginx.conf`, `docker-compose.yml` — container hosting
- `.github/workflows/docker.yml`, `deploy/docker-compose.yml` — image release to GHCR and Portainer stack

