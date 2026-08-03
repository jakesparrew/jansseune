# Jansseune & Co — jansseune.eu

Website van boekhoudkantoor **Jansseune & Co** (Ides Jansseune) — *"Uw boekhouding, onze zorg!"*

Volledig statische site: HTML, CSS en vanilla JavaScript. Geen build-stap, geen dependencies — overal te hosten (GitHub Pages, Combell, one.com, …).

## Structuur

| Pagina | Bestand |
|---|---|
| Home | `index.html` |
| Diensten | `diensten.html` (ankers: `#opstart`, `#boekhouding`, `#fiscaliteit`, `#advies`) |
| Starters | `starters.html` |
| Tarieven | `tarieven.html` |
| Over ons | `over-ons.html` |
| Nieuws + 3 artikels | `nieuws.html`, `nieuws-*.html` |
| FAQ | `faq.html` |
| Contact | `contact.html` |
| Privacy & cookies | `privacy.html` |
| 404 | `404.html` |

Gedeelde bestanden: `css/style.css` (volledig design system), `js/main.js` (navigatie, animaties, accordion, formulier), `assets/favicon.svg`.

## Lokaal bekijken

Gewoon `index.html` openen in een browser volstaat. Of met een mini-server:

```bash
npx serve .
```

## Publiceren via GitHub Pages

1. Repo → **Settings → Pages** → Source: `main` branch, `/ (root)`.
2. Het `CNAME`-bestand bevat al `www.jansseune.eu`; verwijs de DNS van het domein naar GitHub Pages (CNAME-record `www` → `jakesparrew.github.io`, A-records voor apex naar de GitHub Pages-IP's).

## Vóór livegang nakijken

- [ ] **Openingsuren** — nu staat er "consultaties op afspraak / bereikbaar tijdens kantooruren"; pas aan indien gewenst (contact.html, index.html).
- [ ] **ITAA-erkenningsnummer** — de site vermeldt "Erkend lid ITAA" zonder nummer; vroeger BIBF-nr. 70225875. Voeg het actuele ITAA-nummer toe in de footer/over-ons indien gewenst.
- [ ] **Nieuwsartikels** — drie voorbeeldartikels (Peppol, deadlines 2026, bijberoep) zijn inhoudelijk correct opgesteld maar generiek; laat ze inhoudelijk valideren door Ides.
- [ ] **Foto's** — de site werkt bewust zonder stockfoto's; een echte foto van Ides/het kantoor kan de `portrait-card` op home en over-ons vervangen.
- [ ] **Contactformulier** — werkt nu via `mailto:` (opent het mailprogramma van de bezoeker). Wil je échte formulierverzending zonder mailprogramma, koppel dan een dienst als [Formspree](https://formspree.io) of [Web3Forms](https://web3forms.com): zet in `contact.html` het `action`-attribuut en verwijder de mailto-handler in `js/main.js`.
- [ ] **Kaart** — Google Maps-embed op de contactpagina wijst naar de zetel in Brugge.

## Design

"Editorial ledger"-stijl: inktblauw (`#10202f`), papier (`#f7f4ed`) en messing (`#a97f2f`), Fraunces (display) + Inter (tekst) + IBM Plex Mono (labels/cijfers). Het ampersand uit "Jansseune **&** Co" is het terugkerende brandmotief. Alle kleuren en spacing staan als CSS-variabelen bovenaan `css/style.css`.
