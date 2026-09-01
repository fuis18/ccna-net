# CCNA (Routers & Switches)

CCNA study guide organized into 11 modules: network fundamentals, device management, network configuration, routing protocols, redundancy & security, wireless networks, IP services, QoS & design, management & troubleshooting, virtualization and automation. Each module (2–11) ends with an incremental exercise that builds a single-floor building network from scratch.
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
├── 02-device-management/          # 2. Device Management
├── 03-network-configuration/      # 3. Configuración de Red (Switching & Direccionamiento)
├── 04-routing-protocols/          # 4. Protocolos de Enrutamiento
├── 05-redundancy-security/        # 5. Redundancy and Security
├── 06-wireless-networks/          # 6. Wireless Networks (WLAN)
├── 07-ip-services/                # 7. IP Services and Maintenance
├── 08-qos-network-design/         # 8. QoS & Network Design
├── 09-management-troubleshooting/ # 9. Management & Troubleshooting
├── 10-network-virtualization/     # 10. Network Virtualization
└── 11-network-automation/         # 11. Network Automation
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
