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
| Tools (hub) | `tools.html` (menulabel: *Tools*) |
| — Btw berekenen | `btw-berekenen.html` |
| — Kilometervergoeding | `kilometervergoeding.html` |
| — Netto-inkomen | `netto-berekenen.html` |
| — Eenmanszaak of vennootschap | `eenmanszaak-of-vennootschap.html` |
| Over ons | `over-ons.html` |
| Kantoren per stad | `boekhouder-brugge/-torhout/-oostende/-vichte.html` |
| Verzorgingsgebied | `boekhouder-zedelgem.html`, `boekhouder-oostkamp.html` |
| Nieuws + 3 artikels | `nieuws.html`, `nieuws-*.html` |
| FAQ | `faq.html` |
| Contact | `contact.html` |
| Privacy & cookies | `privacy.html` |
| 404 | `404.html` |

Gedeelde bestanden: `css/style.css` (volledig design system) en `js/main.js` (navigatie, animaties, accordion, formulier). Elke rekenhulp heeft daarnaast zijn eigen script met dezelfde naam als de pagina.

### Afbeeldingen in `assets/`

| Bestand | Gebruik |
|---|---|
| `ides-jansseune.png` | **Bronbestand** (1254×1254, 2,1 MB). Wordt niet door de site geladen — bewaard om nieuwe uitsnedes van te maken. |
| `ides-jansseune.jpg` | Groot portret op de over-onspagina (900×900, 88 KB) |
| `ides-jansseune-klein.jpg` | Ronde foto in de citaatkaart op de homepage (260×260, 15 KB) |
| `og.jpg` | Deelafbeelding voor sociale media (1200×630, 83 KB) |
| `favicon.svg` | Browsericoon |

Nieuwe formaten nodig? Genereer ze uit het PNG-bronbestand; lever nooit die 2,1 MB rechtstreeks aan bezoekers.

## Lokaal bekijken

Gewoon `index.html` openen in een browser volstaat. Of met een mini-server:

```bash
npx serve .
```

## Publiceren

### Huidige situatie (gecontroleerd op 3 augustus 2026)

| | |
|---|---|
| Domein | `jansseune.eu` → A-record `5.134.4.113` |
| Hosting | **Combell** (`linweb415.webhosting.be`, nginx) |
| Nameservers | `ns1.combell.eu`, `ns3/ns4.combell.net` |
| Huidige site | WordPress met Avada-thema (Yoast SEO) |
| Geïndexeerde URL's | enkel `/` en `/faq-items/` |

### Optie A — bij Combell zetten (aanbevolen, domein staat er al)

1. Log in op het Combell-controlepaneel → **FTP / Bestandsbeheer**.
2. Maak eerst een **back-up** van de bestaande WordPress-installatie.
3. Upload de volledige inhoud van deze repo naar de webroot (`/www` of `httpdocs`).
4. Het meegeleverde **`.htaccess`** regelt automatisch:
   - 301-redirect naar `https://www.` (loop-veilig geschreven, ook achter de proxy van Combell),
   - 301-redirects van de oude WordPress-URL's (`/faq-items/` → `/faq.html`, `/author/jansseune/` → `/`, feeds, categorieën),
   - de 404-pagina, compressie en browsercaching.

### Optie B — GitHub Pages

1. Repo → **Settings → Pages** → Source: `main` branch, `/ (root)`.
2. Pas de DNS bij Combell aan: CNAME `www` → `jakesparrew.github.io` + A-records voor het apex-domein naar de GitHub Pages-IP's.
3. Let op: `.htaccess` werkt **niet** op GitHub Pages — de redirects van de oude URL's vervallen dan. `.nojekyll` staat klaar zodat bestanden ongewijzigd geserveerd worden.

## Google Search Console & Bedrijfsprofiel

### Verificatie

Het bestand **`googlec0549e11e631b95e.html`** staat in de webroot en bevat exact:

```
google-site-verification: googlec0549e11e631b95e.html
```

Dit werkt pas zodra de site live staat op het domein — Google moet het kunnen ophalen op
`https://www.jansseune.eu/googlec0549e11e631b95e.html` (geeft momenteel nog 404, want de oude WordPress-site staat er nog).

Twee mogelijkheden:

- **Nu al verifiëren zonder de site te vervangen:** upload enkel dit ene bestand via FTP naar de webroot van de huidige WordPress-site. Verificatie werkt dan meteen, en je kunt de site later rustig migreren.
- **Na migratie verifiëren:** zet de nieuwe site live (Optie A) en klik dan op *Verifiëren* in Search Console.

> **Alternatief dat sterker is:** verifieer een **Domein-property** via een DNS TXT-record bij Combell. Die dekt `http`/`https` én `www`/non-`www` tegelijk, en blijft geldig bij elke verhuis van hosting.

Na verificatie: dien **`https://www.jansseune.eu/sitemap.xml`** in bij *Sitemaps*.

### Google Bedrijfsprofiel (bestaat al)

Grootste lokale winst zit hier — te doen door de eigenaar:

1. Zet in het profiel de **website** op `https://www.jansseune.eu/`.
2. Zijn er **aparte profielen per vestiging** (Brugge, Torhout, Oostende, Vichte)? Laat elk profiel doorverwijzen naar zijn eigen stadspagina (`/boekhouder-brugge.html` enz.). Bestaat er nog maar één profiel, dan zijn de andere drie vestigingen toevoegen de sterkste ingreep die er is.
3. Zorg dat **naam, adres en telefoon exact** overeenkomen met wat op de site staat (NAP-consistentie). Het telefoonnummer `050 22 22 28` en de adressen in de footer zijn de referentie.
4. Categorie: *Boekhouder* als hoofdcategorie, *Belastingadviseur* / *Accountant* als extra.
5. De LinkedIn-pagina (`linkedin.com/showcase/jansseune-&-co/`) staat al als `sameAs` in de structured data en in de footer — dat versterkt de entiteitsherkenning bij Google.

## Het contactformulier — hoe het werkt

### Wat er al werkt

E-mail voor het domein draait op **Microsoft 365** (MX-record wijst naar `jansseune-eu.mail.protection.outlook.com`). `ides@jansseune.eu` kan dus gewoon mail ontvangen — daar is niets aan te doen.

Het formulier heeft **geen mailserver nodig**: het opent het e-mailprogramma van de bezoeker met een vooraf ingevuld bericht aan `ides@jansseune.eu`. De bezoeker verstuurt het zelf, vanaf zijn eigen adres.

### De beperking

Wie **enkel webmail** gebruikt (Gmail in de browser, zonder ingestelde mailclient) ziet er niets gebeuren. Op gsm werkt het bijna altijd, op desktop niet altijd. Op de contactpagina staan daarom ook het telefoonnummer en het e-mailadres duidelijk vermeld, zodat niemand vastloopt.

### Waarom géén PHP-mailscript op Combell

Het SPF-record van het domein is streng:

```
v=spf1 include:spf.protection.outlook.com -all
```

Die `-all` betekent: **alleen Microsoft 365 mag mail versturen namens @jansseune.eu**. Een PHP-script dat vanaf de Combell-server mail verstuurt met afzender `@jansseune.eu` faalt dus op SPF en belandt in de spam of wordt geweigerd. Dat is een val waar veel websites intrappen — niet doen.

### De aanbevolen oplossing (5 minuten werk)

Gebruik een formulierdienst die vanaf **haar eigen domein** mailt naar `ides@jansseune.eu`, met de bezoeker als `Reply-To`. Geen SPF-probleem, geen server, geen onderhoud:

1. Maak een account bij [Web3Forms](https://web3forms.com) (gratis, onbeperkt) of [Formspree](https://formspree.io) (gratis tot 50 berichten/maand) en vul `ides@jansseune.eu` in als ontvanger.
2. U krijgt een endpoint-URL of access key.
3. Zet die op **één regel** in `js/main.js`:

```js
var FORM_ENDPOINT = "https://api.web3forms.com/submit";
```

Meer is er niet nodig: het formulier schakelt dan automatisch over van `mailto:` naar echte verzending, mét bevestigingsboodschap, foutafhandeling en een reeds ingebouwde honeypot tegen spam. Bij Web3Forms voegt u de access key toe als extra veld in `contact.html`.

## De rekenhulpen — jaarlijks bijwerken

Er zijn vier rekenhulpen. Elke tool heeft zijn wettelijke parameters **bovenaan het bijbehorende JS-bestand** in één blok staan, zodat bijwerken enkele minuten kost.

| Tool | Script | Bevat parameters die wijzigen |
|---|---|---|
| Btw berekenen | `js/btw-berekenen.js` | nee — tarieven staan als knoppen in de HTML |
| Kilometervergoeding | `js/kilometervergoeding.js` | **ja, per kwartaal** |
| Netto-inkomen | `js/netto-berekenen.js` | ja, jaarlijks |
| Eenmanszaak of vennootschap | `js/eenmanszaak-of-vennootschap.js` | ja, jaarlijks |

> **Let op bij de kilometervergoeding:** de maximale vergoeding voor werknemers wordt sinds 2026 **per kwartaal** geïndexeerd, het forfait voor zelfstandigen jaarlijks. Dat is de enige tool die vaker dan jaarlijks nagekeken moet worden. De datum staat zichtbaar op de pagina bij "Geldig vanaf".

Momenteel ingesteld op **inkomstenjaar 2026 / aanslagjaar 2027**:

| Parameter | Waarde |
|---|---|
| Sociale bijdragen | 20,5% tot €75.024,54 — 14,16% tot €110.562,42 |
| Minimum hoofdberoep | €890,42/kwartaal (excl. beheerskosten) |
| Ondergrens bijberoep | €1.922,16 |
| Beheerskosten | 4% |
| Belastingschijven | 25% / 40% / 45% / 50% vanaf €16.720 / €29.510 / €51.070 |
| Belastingvrije som | €11.180 |
| Vennootschapsbelasting | 25%, verlaagd 20% op eerste €100.000 |
| Minimumbezoldiging verlaagd tarief | €50.000 bruto (was €45.000 tot 2025) |
| Km-vergoeding zelfstandige | €0,4449 per km |
| Km-vergoeding werknemer | €0,4327 per km |
| Fietsvergoeding | €0,36 per km |
| Btw-tarieven | 21% / 12% / 6% / 0% |

Wat te doen bij een nieuw jaar: vervang de cijfers in het `P`-object in `js/netto-berekenen.js`, pas het jaartal aan in de sectie *"Waarop is deze berekening gebaseerd?"* in `netto-berekenen.html`, en werk de meta-description bij.

De berekening houdt correct rekening met de aftrekbaarheid van de sociale bijdragen, met de minimumbijdrage in hoofdberoep en met de bijdrageplafonds. Ze gaat uit van een alleenstaande zonder personen ten laste — dat staat expliciet vermeld op de pagina, met een verwijzing naar een persoonlijk gesprek.

## Vóór livegang nakijken

- [ ] **Openingsuren** — nu staat er "consultaties op afspraak / bereikbaar tijdens kantooruren"; pas aan indien gewenst (contact.html, index.html).
- [ ] **ITAA-erkenningsnummer** — de site vermeldt "Erkend lid ITAA" zonder nummer; vroeger BIBF-nr. 70225875. Voeg het actuele ITAA-nummer toe in de footer/over-ons indien gewenst.
- [ ] **Nieuwsartikels** — drie voorbeeldartikels (Peppol, deadlines 2026, bijberoep) zijn inhoudelijk correct opgesteld maar generiek; laat ze inhoudelijk valideren door Ides.
- [ ] **Extra foto's** — een beeld van het kantoor of van Ides aan het werk zou de dienstenpagina's versterken. Bewust géén stockfoto's.
- [ ] **Contactformulier** — werkt nu via `mailto:`. Zie het hoofdstuk hierboven om over te schakelen op echte verzending (één regel in `js/main.js`).
- [ ] **Rekenhulpen** — laat de gebruikte parameters valideren door Ides. Zet de jaarlijkse update in de agenda voor januari, en de kilometervergoeding elk kwartaal.
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
| `boekhouder-zedelgem.html` | boekhouder zedelgem (gerelateerde zoekopdracht) |
| `boekhouder-oostkamp.html` | boekhouder oostkamp (gerelateerde zoekopdracht) |
| `netto-berekenen.html` | hoeveel hou ik netto over als zelfstandige |
| `faq.html` | wat kost een boekhouder per uur, betrouwbare boekhouder |
| `nieuws-e-facturatie-peppol.html` | peppol (60.500!), e-facturatie (1.300) |
| `nieuws-starten-in-bijberoep.html` | zelfstandige in bijberoep (4.400) |

**SERP-analyse "boekhouder brugge"** (DataForSEO, augustus 2026) — bepalend voor de strategie:

De posities 1-3 én 6-8 zijn **Google Bedrijfsprofielen**; van de 35 resultaten zijn er 12 uit de local pack. Er staat géén enkel blogartikel in de top 10 — de organieke winnaars zijn homepages, plus één kantoorpagina per stad (Titeca). Concurrenten in de top 3 en hun reviews:

| Kantoor | Score | Reviews |
|---|---|---|
| Jonghof Accountants | 5,0 | 53 |
| Dfisc Boekhouder Brugge | 4,7 | 30 |
| Kantoor Dewulf | 4,8 | 16 |

**Conclusie: reviews verzamelen is de grootste hefboom**, niet content. Richtcijfer om in de top 3 mee te spelen: 20 à 30 reviews boven 4,7.

**Technisch aanwezig:** canonicals, sitemap met lastmod, robots.txt, Open Graph + Twitter cards met og-afbeelding (`assets/og.png`), theme-color, BreadcrumbList/WebSite/AccountingService (met 4 vestigingen)/Article/FAQPage JSON-LD, `sameAs` naar LinkedIn, lokale landingspagina's per kantoor met eigen LocalBusiness-schema en areaServed, 301-redirects van de oude WordPress-URL's via `.htaccess`.

**Nog te doen na livegang (grootste hefbomen):**
1. **Google Search Console + Bedrijfsprofiel** — zie het hoofdstuk hierboven. Dit zijn veruit de belangrijkste stappen.
2. **Bing Webmaster Tools** — zelfde oefening, import vanuit Search Console kan in één klik.
3. **Vermeldingen/backlinks** — zorg dat naam-adres-telefoon (NAP) identiek is op Gouden Gids, Trends Top, openthebox, de ITAA-ledenlijst en Unizo/Voka, en vraag telkens een link naar jansseune.eu.
4. **Nieuws bijhouden** — het Peppol-artikel mikt op 60k+ zoekopdrachten/maand; regelmatig een actueel artikel toevoegen houdt de site levend voor Google.

## Design

"Editorial ledger"-stijl: inktblauw (`#10202f`), papier (`#f7f4ed`) en messing (`#a97f2f`), Fraunces (display) + Inter (tekst) + IBM Plex Mono (labels/cijfers). Het ampersand uit "Jansseune **&** Co" is het terugkerende brandmotief. Alle kleuren en spacing staan als CSS-variabelen bovenaan `css/style.css`.
