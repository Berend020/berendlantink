# berendlantink.nl

Nederlandstalige, statische persoonlijke website voor Berend Lantink. Astro 7, TypeScript en Tailwind CSS 4 (Vite-plugin). Geen client-side JavaScript in de productiepagina. Eigen SVG-betaalkaart, systeemfonts en lokaal opgeslagen afbeeldingen.

## Lokaal ontwikkelen — alleen Docker nodig

Installeer Docker Desktop met Compose. Vanuit deze map:

```sh
docker compose up -d --build
```

Open http://localhost:4321. Als poort 4321 bezet is: `SITE_PORT=4335 docker compose up -d --build`, en open http://localhost:4335. De server luistert binnen de container op `0.0.0.0`; de hostpoort is alleen op je eigen computer bereikbaar. Bronbestanden zijn gemount en wijzigingen worden automatisch verwerkt. `node_modules` staat in een apart Docker-volume. Node 24 LTS en `npm ci` gebruiken de vastgelegde dependencies in `package-lock.json`.

```sh
# Logs volgen
docker compose logs -f web
# Stoppen (dependencies blijven behouden)
docker compose down
# Controles en productiebuild
docker compose exec web npm run check
docker compose exec web npm run build
# Productiebuild lokaal bekijken op poort 4336
docker compose run --rm -p 127.0.0.1:4336:4321 web npm run preview -- --port 4321
```

Open daarna http://localhost:4336. Stop de preview met Ctrl+C. `dist/` bevat de publiceerbare website.

Na dependencywijzigingen: `docker compose exec web npm ci`, daarna `docker compose up -d --build`. Het bestaande dependencyvolume wordt niet automatisch vernieuwd door alleen de image opnieuw te bouwen.

## Teksten en LinkedIn aanpassen

Alle profielteksten, expertisegebieden en metadata staan in `src/data/profile.ts`. Vul `linkedinUrl` met je volledige `https://www.linkedin.com/in/...`-adres. Het LinkedIn-profiel is ingesteld op `https://www.linkedin.com/in/berendlantink/`. Er is geen fictief profieladres of contactformulier.

Componenten staan in `src/components/`, de pagina in `src/pages/index.astro`, metadata in `src/layouts/Layout.astro` en vormgeving in `src/styles/global.css`. De hero-illustratie is een inline SVG in `Hero.astro`. `public/og-image.svg` is het bewerkbare bronbestand; `public/og-image.png` is de breed ondersteunde social sharing-afbeelding (1200 × 630). Werk bij wijzigingen beide bestanden bij. Favicon, robots.txt en sitemap staan ook in `public/`.

## Cloudflare Workers Static Assets — voorbereid, niet gepubliceerd

`wrangler.jsonc` verwijst naar `dist/`, met een statische 404-pagina. Een Worker-script, adapter, backend en betaalde diensten zijn niet nodig. Alle aanvragen worden als statische bestanden afgehandeld. Er zijn bewust geen domeinroutes in de configuratie geactiveerd.

### Later verbinden met GitHub

1. Maak op eigen initiatief een GitHub-repository aan en push dit project, inclusief `package-lock.json` (zonder `node_modules/` en `dist/`).
2. Kies in Cloudflare Workers & Pages voor het importeren van een Git-repository en verbind GitHub.
3. Gebruik Worker-naam `berendlantink` (gelijk aan `wrangler.jsonc`), projectroot `/`, productiebranch `main` en Node-versie `24` (vastgelegd in `.node-version`).
4. Installatie: `npm ci`. Buildcommand: `npm run check && npm run build`. Deploycommand: `npm run deploy`. De Git-koppeling regelt de authenticatie. Gebruik de Workers Free-optie.
5. Controleer de eerste publicatie op het toegewezen workers.dev-adres voordat je de domeinen koppelt. De canonieke URL blijft `https://berendlantink.nl/`.

Deze handelingen maken externe resources aan en publiceren de site; ze zijn tijdens de ontwikkeling niet uitgevoerd. De GitHub-repository is https://github.com/Berend020/berendlantink.

### Later domein en www koppelen

Het voorkeursdomein is **https://berendlantink.nl**. Zorg dat de DNS-zone van dit domein in je Cloudflare-account actief is. Voeg na publicatie via Worker → Settings → Domains & Routes → Add → Custom Domain `berendlantink.nl` toe. Cloudflare verzorgt de bijbehorende DNS-records en TLS. Voeg ook `www.berendlantink.nl` als Custom Domain toe.

Maak vervolgens op zoneniveau een Single Redirect Rule voor `http.host eq "www.berendlantink.nl"`: dynamische doel-URL `concat("https://berendlantink.nl", http.request.uri.path)`, status **301**, querystring behouden. Gebruik daarnaast Always Use HTTPS. Zo werken beide hosts met één voorkeursdomein. Een canonical-tag alleen veroorzaakt geen redirect. Domeinredirects worden niet via een Static Assets `_redirects`-bestand ingesteld.

Er zijn geen DNS-records, domeinen of externe resources gewijzigd. Controleer vóór latere publicatie je LinkedIn-adres en definitieve teksten.

## Officiële documentatie

- [Astro styling en Tailwind](https://docs.astro.build/en/guides/styling/)
- [Tailwind Vite-integratie voor Astro](https://tailwindcss.com/docs/installation/framework-guides/astro)
- [Workers Static Assets-configuratie](https://developers.cloudflare.com/workers/static-assets/binding/)
- [Workers Builds met Git](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)
- [Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
- [Beperkingen van Static Assets-redirects](https://developers.cloudflare.com/workers/static-assets/redirects/)

## Uitgevoerde verificatie (2 november 2026)

- Docker-image gebouwd met `npm ci`; ontwikkelcontainer gestart op poort 4335, omdat een bestaand ander project poort 4321 gebruikt. Dat project is niet gestopt.
- Lokale pagina geeft HTTP 200.
- `npm run check`: 0 fouten, 0 waarschuwingen.
- `npm run build`: statische homepage en 404-pagina succesvol gegenereerd.
- `wrangler deploy --dry-run`: configuratie en assets geaccepteerd, niets gepubliceerd.
- Browsercontrole op 375, 768 en 1440 pixels: geen horizontale overflow; op 375 × 812 pixels staan headline en LinkedIn-knop in het eerste scherm.
- HMR gecontroleerd door een tijdelijke profieltekstwijziging zonder handmatig herladen; wijziging automatisch zichtbaar en daarna teruggezet.

Het oorspronkelijke referentiebeeld van ontwerp 5 was niet beschikbaar; de vormgeving is gebaseerd op de uitgeschreven visuele instructies.
