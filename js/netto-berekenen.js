/* Jansseune & Co — simulatie netto-inkomen zelfstandigen
 *
 * ---------------------------------------------------------------
 * JAARLIJKS BIJ TE WERKEN
 * Alle wettelijke parameters staan hieronder gegroepeerd. Bij een
 * nieuw inkomstenjaar volstaat het deze cijfers te vervangen; de
 * rest van de code hoeft niet te wijzigen. Vergeet dan ook het
 * jaartal in netto-berekenen.html niet aan te passen.
 * ---------------------------------------------------------------
 */
(function () {
  "use strict";

  var P = {
    inkomstenjaar: 2026,
    aanslagjaar: 2027,

    // Sociale bijdragen zelfstandigen — barema 2026
    sociaal: {
      tarief1: 0.205,            // tot de eerste schijf
      plafond1: 75024.54,
      tarief2: 0.1416,           // tussen plafond1 en plafond2
      plafond2: 110562.42,       // daarboven geen bijdragen meer
      minimumInkomenHoofdberoep: 17374.05, // komt overeen met ~890,42 EUR/kwartaal
      drempelBijberoep: 1922.16, // daaronder geen bijdragen in bijberoep
      beheerskosten: 0.04        // gemiddelde beheerskost sociaal verzekeringsfonds
    },

    // Personenbelasting — aanslagjaar 2027 (inkomsten 2026)
    belasting: {
      schijven: [
        { tot: 16720, tarief: 0.25 },
        { tot: 29510, tarief: 0.40 },
        { tot: 51070, tarief: 0.45 },
        { tot: Infinity, tarief: 0.50 }
      ],
      belastingvrijeSom: 11180,
      tariefVrijeSom: 0.25
    }
  };

  var euro = new Intl.NumberFormat("nl-BE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  });

  /* ---------- Berekeningen ---------- */

  function socialeBijdragen(basis, statuut) {
    if (basis <= 0) return 0;
    if (statuut === "bijberoep" && basis < P.sociaal.drempelBijberoep) return 0;

    var grondslag = basis;
    if (statuut === "hoofdberoep") {
      grondslag = Math.max(basis, P.sociaal.minimumInkomenHoofdberoep);
    }

    var s = P.sociaal;
    if (grondslag <= s.plafond1) return grondslag * s.tarief1;

    var bijdrage = s.plafond1 * s.tarief1;
    bijdrage += (Math.min(grondslag, s.plafond2) - s.plafond1) * s.tarief2;
    return bijdrage;
  }

  function personenbelasting(belastbaar) {
    if (belastbaar <= 0) return 0;

    var rest = belastbaar;
    var vorige = 0;
    var totaal = 0;

    P.belasting.schijven.forEach(function (schijf) {
      if (rest <= 0) return;
      var breedte = schijf.tot - vorige;
      var deel = Math.min(rest, breedte);
      totaal += deel * schijf.tarief;
      rest -= deel;
      vorige = schijf.tot;
    });

    // De belastingvrije som wordt verrekend als vermindering tegen het laagste tarief.
    var vermindering =
      Math.min(belastbaar, P.belasting.belastingvrijeSom) * P.belasting.tariefVrijeSom;

    return Math.max(totaal - vermindering, 0);
  }

  function bereken(omzet, kosten, statuut, gemeentePct) {
    var brutowinst = Math.max(omzet - kosten, 0);

    var bijdragen = socialeBijdragen(brutowinst, statuut);
    var beheer = bijdragen * P.sociaal.beheerskosten;
    var sociaalTotaal = bijdragen + beheer;

    // Sociale bijdragen en beheerskosten zijn aftrekbare beroepskosten.
    var belastbaar = Math.max(brutowinst - sociaalTotaal, 0);

    var federaal = personenbelasting(belastbaar);
    var gemeente = federaal * gemeentePct;
    var belastingTotaal = federaal + gemeente;

    var netto = Math.max(brutowinst - sociaalTotaal - belastingTotaal, 0);

    return {
      brutowinst: brutowinst,
      sociaal: sociaalTotaal,
      sociaalPerKwartaal: sociaalTotaal / 4,
      belastbaar: belastbaar,
      federaal: federaal,
      gemeente: gemeente,
      belasting: belastingTotaal,
      netto: netto,
      nettoPerMaand: netto / 12,
      opzijPerMaand: (sociaalTotaal + belastingTotaal) / 12,
      druk: brutowinst > 0 ? (sociaalTotaal + belastingTotaal) / brutowinst : 0
    };
  }

  /* ---------- Koppeling met het formulier ---------- */

  var form = document.getElementById("netto-simulatie");
  if (!form) return;

  var el = function (id) {
    return document.getElementById(id);
  };

  function getal(id) {
    var v = parseFloat(String(el(id).value).replace(",", "."));
    return isNaN(v) || v < 0 ? 0 : v;
  }

  function statuut() {
    var gekozen = form.querySelector('input[name="statuut"]:checked');
    return gekozen ? gekozen.value : "hoofdberoep";
  }

  function update() {
    var r = bereken(
      getal("r-omzet"),
      getal("r-kosten"),
      statuut(),
      getal("r-gemeente") / 100
    );

    el("uit-netto").textContent = euro.format(r.netto);
    el("uit-netto-maand").textContent = euro.format(r.nettoPerMaand);
    el("uit-brutowinst").textContent = euro.format(r.brutowinst);
    el("uit-sociaal").textContent = euro.format(r.sociaal);
    el("uit-sociaal-kwartaal").textContent = euro.format(r.sociaalPerKwartaal);
    el("uit-belasting").textContent = euro.format(r.belasting);
    el("uit-gemeente").textContent = euro.format(r.gemeente);
    el("uit-eindnetto").textContent = euro.format(r.netto);
    el("uit-opzij").textContent = euro.format(r.opzijPerMaand);
    el("uit-druk").textContent = Math.round(r.druk * 100) + "%";

    // Verdeelbalk — via flex-basis, zie de opmerking bij .calc-bar in style.css
    var totaal = r.brutowinst || 1;
    el("bar-netto").style.flexBasis = (r.netto / totaal) * 100 + "%";
    el("bar-sociaal").style.flexBasis = (r.sociaal / totaal) * 100 + "%";
    el("bar-belasting").style.flexBasis = (r.belasting / totaal) * 100 + "%";
  }

  form.addEventListener("input", update);
  form.addEventListener("change", update);
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    update();
  });

  update();
})();
