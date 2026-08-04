/* Jansseune & Co — kilometervergoeding berekenen
 *
 * ---------------------------------------------------------------
 * REGELMATIG BIJ TE WERKEN
 * De bedragen hieronder wijzigen: de vergoeding voor werknemers wordt
 * sinds 2026 per KWARTAAL geïndexeerd, de forfaitaire aftrek voor
 * zelfstandigen jaarlijks. Vervang de cijfers in TARIEVEN en pas de
 * datum in kilometervergoeding.html aan (zoek op "Geldig").
 * Bron: FOD Financiën / FOD Beleid en Ondersteuning.
 * ---------------------------------------------------------------
 */
(function () {
  "use strict";

  var TARIEVEN = {
    geldigVanaf: "1 januari 2026",
    // Forfaitaire aftrek van beroepsmatige autokosten voor zelfstandigen
    zelfstandige: 0.4449,
    // Maximale belastingvrije kilometervergoeding voor werknemers
    werknemer: 0.4327,
    // Fietsvergoeding per kilometer
    fiets: 0.36
  };

  var form = document.getElementById("km-tool");
  if (!form) return;

  var euro = new Intl.NumberFormat("nl-BE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  // Het kilometertarief heeft vier decimalen; afronden op cent zou een
  // ander tarief suggereren dan het wettelijke bedrag.
  var euroTarief = new Intl.NumberFormat("nl-BE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 4,
    maximumFractionDigits: 4
  });

  var el = function (id) { return document.getElementById(id); };

  function getal(id) {
    var v = parseFloat(String(el(id).value).replace(",", "."));
    return isNaN(v) || v < 0 ? 0 : v;
  }

  function gekozen(naam, standaard) {
    var k = form.querySelector('input[name="' + naam + '"]:checked');
    return k ? k.value : standaard;
  }

  function update() {
    var soort = gekozen("soort", "zelfstandige");
    var tarief = TARIEVEN[soort];
    var kmPerRit = getal("k-afstand");
    var ritten = getal("k-ritten");
    var totaalKm = kmPerRit * ritten;
    var bedrag = totaalKm * tarief;

    el("uit-bedrag").textContent = euro.format(bedrag);
    el("uit-km").textContent = totaalKm.toLocaleString("nl-BE", { maximumFractionDigits: 1 });
    el("uit-tarief").textContent = euroTarief.format(tarief) + " per km";
    el("uit-permaand").textContent = euro.format(bedrag / 12);
    el("uit-geldig").textContent = TARIEVEN.geldigVanaf;

    // De uitleg verschilt wezenlijk per statuut, dus die wisselt mee.
    var uitleg = {
      zelfstandige: "Dit bedrag brengt u in als beroepskost in uw boekhouding. U ontvangt het niet uitbetaald — het verlaagt uw belastbare winst.",
      werknemer: "Dit is het maximum dat een werkgever belastingvrij mag uitbetalen. Wordt er meer betaald, dan is het surplus belastbaar loon.",
      fiets: "De fietsvergoeding is vrijgesteld van belasting en sociale bijdragen tot dit bedrag per kilometer."
    };
    el("uit-uitleg").textContent = uitleg[soort];

    var labels = {
      zelfstandige: "Forfaitaire aftrek zelfstandige",
      werknemer: "Vergoeding werknemer",
      fiets: "Fietsvergoeding"
    };
    el("uit-label").textContent = labels[soort];
  }

  form.addEventListener("input", update);
  form.addEventListener("change", update);
  form.addEventListener("submit", function (e) { e.preventDefault(); update(); });

  update();
})();
