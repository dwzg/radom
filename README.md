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

## GitLab CI and Portainer

`.gitlab-ci.yml` builds the image, smoke-tests it and pushes it to the project's GitLab Container Registry:

| Pipeline | Image tags pushed |
|---|---|
| Merge request | none (build and test only) |
| Any branch | `<short-sha>` |
| Default branch | `<short-sha>`, `latest` |
| Git tag, e.g. `v1.0.0` | `<short-sha>`, `v1.0.0` |

The runner needs Docker-in-Docker (a privileged runner; GitLab.com shared runners work).

**Redeploy with Portainer (optional)**

1. In Portainer, add the GitLab registry (`registry.gitlab.com`) with a deploy token that has `read_registry`.
2. Create a stack from `deploy/docker-compose.yml` and set the environment variable
   `RDM_IMAGE=registry.gitlab.com/<group>/<project>:latest`.
3. Turn on the stack's webhook with "re-pull image" enabled, and copy its URL.
4. In GitLab → Settings → CI/CD → Variables, add `PORTAINER_WEBHOOK_URL` (masked, protected).

After `latest` is pushed from the default branch, the `deploy` job calls the webhook and Portainer
pulls the new image. Without the variable, the deploy job is skipped. Set `PORTAINER_DEPLOY_MANUAL=true`
to make it a manual button instead.

## Run without Docker

No build step: open `index.html`, or run `python3 -m http.server` in this folder.

## Files

- `index.html` — page content and sections
- `css/style.css` — styles (responsive, respects reduced motion)
- `js/main.js` — model cards, exploded-view hotspots, sign-up form
- `img/` — AI-generated photos (WebP), made with the prompts in `docs/image-prompts.md`
- `Dockerfile`, `nginx.conf`, `docker-compose.yml` — container hosting
- `.gitlab-ci.yml`, `deploy/docker-compose.yml` — GitLab CI release and Portainer stack

The "Keep me posted" form has no backend yet; it only shows a thank-you message.
