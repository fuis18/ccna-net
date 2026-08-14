# CCNA (Routers & Switches)

CCNA study guide organized into 5 modules: network fundamentals, switching, routing, wireless networks, and IP services.
Built with [Astro](https://astro.build/) + [Starlight](https://starlight.astro.build/).

## Project Structure

```
.
├── public/
├── src/
│   ├── assets/
│   ├── content/
│   │   └── docs/            # Guide pages (.md, one per topic)
│   └── content.config.ts
├── astro.config.mjs          # Starlight config + base (/ccna-net/ in prod)
├── .github/workflows/deploy.yml  # GitHub Pages deploy
├── package.json
└── tsconfig.json
```

The `.md` files in `src/content/docs/` are exposed as site routes. Each chapter has its own folder with an `index.md` and the pages for its topics.

## Features

- Diagrams (Mermaid)
- Math (LaTeX / KaTeX)

## Content Structure

```
src/content/docs/
├── index.md                       # Landing page
├── 01-network-fundamentals/       # 1. Network Fundamentals
├── 02-switching/                  # 2. Switching
├── 03-routing/                    # 3. Routing
├── 04-wireless-networks/          # 4. Wireless Networks (WLAN)
└── 05-ip-services/                # 5. IP Services and Maintenance
```

## Commands

| Command          | Action                                      |
| :--------------- | :------------------------------------------ |
| `pnpm install`   | Installs dependencies                       |
| `pnpm dev`       | Starts local dev server at `localhost:4321` |
| `pnpm build`     | Builds production site to `./dist/`         |
| `pnpm preview`   | Previews the build locally                  |
| `pnpm astro ...` | Run Astro CLI commands (e.g. `astro check`) |

## Deploy

The site is automatically deployed to GitHub Pages via the workflow in `.github/workflows/deploy.yml`. It lives at `https://fuis18.is-a.dev/ccna-net/`, so `astro.config.mjs` defines:

```js
base: process.env.NODE_ENV === 'production' ? '/ccna-net/' : '/',
```

## License

See [LICENSE](./LICENSE).
