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

## SEO

De site is geoptimaliseerd op basis van DataForSEO-zoekvolumedata (Google Ads, België, Nederlands — augustus 2026):

**Keyword-mapping (primaire zoekintentie per pagina):**

| Pagina | Primaire keywords (volume/maand BE) |
|---|---|
| `index.html` | boekhouder (4.400), boekhoudkantoor (1.900), boekhouder west-vlaanderen |
| `diensten.html` | btw aangifte (2.400), vennootschapsbelasting (1.900), jaarrekening neerleggen (1.300) |
| `starters.html` | starten als zelfstandige (260), eigen zaak starten |
| `tarieven.html` | wat kost een boekhouder (50), boekhouder prijs (90) |
| `boekhouder-brugge.html` | boekhouder brugge (260), boekhoudkantoor brugge (90) |
| `boekhouder-oostende.html` | boekhouder oostende (170) |
| `boekhouder-torhout.html` | boekhouder torhout (90) |
| `boekhouder-vichte.html` | boekhouder vichte + regio kortrijk (170) / waregem (110) |
| `nieuws-e-facturatie-peppol.html` | peppol (60.500!), e-facturatie (1.300) |
| `nieuws-starten-in-bijberoep.html` | zelfstandige in bijberoep (4.400) |

**Technisch aanwezig:** canonicals, sitemap met lastmod, robots.txt, Open Graph + Twitter cards met og-afbeelding (`assets/og.png`), theme-color, BreadcrumbList/WebSite/AccountingService (met 4 vestigingen)/Article/FAQPage JSON-LD, lokale landingspagina's per kantoor met eigen LocalBusiness-schema en areaServed.

**Nog te doen na livegang (grootste hefbomen):**
1. **Google Search Console** — verifieer het domein en dien `sitemap.xml` in.
2. **Google Bedrijfsprofiel (Business Profile)** — maak/claim een profiel per kantoor (Brugge, Torhout, Oostende, Vichte) en verwijs naar de bijhorende stadspagina. Dé belangrijkste lokale rankingfactor.
3. **Bing Webmaster Tools** — zelfde oefening, import vanuit GSC kan.
4. **Vermeldingen/backlinks** — zorg dat naam-adres-telefoon (NAP) identiek is op Gouden Gids, Trends Top, openthebox, ITAA-ledenlijst, Unizo/Voka, en vraag een link naar jansseune.eu.
5. **Nieuws bijhouden** — het Peppol-artikel mikt op 60k+ zoekopdrachten/maand; regelmatig een actueel artikel toevoegen houdt de site levend voor Google.

## Design

"Editorial ledger"-stijl: inktblauw (`#10202f`), papier (`#f7f4ed`) en messing (`#a97f2f`), Fraunces (display) + Inter (tekst) + IBM Plex Mono (labels/cijfers). Het ampersand uit "Jansseune **&** Co" is het terugkerende brandmotief. Alle kleuren en spacing staan als CSS-variabelen bovenaan `css/style.css`.
