/* Jansseune & Co — eenmanszaak of vennootschap vergelijken
 *
 * ---------------------------------------------------------------
 * JAARLIJKS BIJ TE WERKEN
 * Alle wettelijke parameters staan gegroepeerd in P hieronder.
 * Deze cijfers gelden voor inkomstenjaar 2026 (aanslagjaar 2027).
 * Pas ook de jaartallen aan in eenmanszaak-of-vennootschap.html.
 * ---------------------------------------------------------------
 */
(function () {
  "use strict";

  var P = {
    sociaal: {
      tarief1: 0.205,
      plafond1: 75024.54,
      tarief2: 0.1416,
      plafond2: 110562.42,
      minimumInkomenHoofdberoep: 17374.05,
      beheerskosten: 0.04
    },
    belasting: {
      schijven: [
        { tot: 16720, tarief: 0.25 },
        { tot: 29510, tarief: 0.40 },
        { tot: 51070, tarief: 0.45 },
        { tot: Infinity, tarief: 0.50 }
      ],
      belastingvrijeSom: 11180,
      tariefVrijeSom: 0.25
    },
    vennootschap: {
      tariefNormaal: 0.25,
      tariefVerlaagd: 0.20,
      grensVerlaagdTarief: 100000,
      // Vanaf 2026 moet de bedrijfsleider zichzelf minstens dit brutobedrag
      // toekennen om van het verlaagde tarief te kunnen genieten.
      minimumBezoldiging: 50000
    }
  };

  var euro = new Intl.NumberFormat("nl-BE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  });

  function socialeBijdragen(basis) {
    if (basis <= 0) return 0;
    var s = P.sociaal;
    var grondslag = Math.max(basis, s.minimumInkomenHoofdberoep);
    var b;
    if (grondslag <= s.plafond1) {
      b = grondslag * s.tarief1;
    } else {
      b = s.plafond1 * s.tarief1;
      b += (Math.min(grondslag, s.plafond2) - s.plafond1) * s.tarief2;
    }
    return b * (1 + s.beheerskosten);
  }

  function personenbelasting(belastbaar, gemeentePct) {
    if (belastbaar <= 0) return 0;
    var rest = belastbaar, vorige = 0, totaal = 0;
    P.belasting.schijven.forEach(function (schijf) {
      if (rest <= 0) return;
      var deel = Math.min(rest, schijf.tot - vorige);
      totaal += deel * schijf.tarief;
      rest -= deel;
      vorige = schijf.tot;
    });
    var vermindering = Math.min(belastbaar, P.belasting.belastingvrijeSom) * P.belasting.tariefVrijeSom;
    var federaal = Math.max(totaal - vermindering, 0);
    return federaal * (1 + gemeentePct);
  }

  function alsEenmanszaak(winst, gemeentePct) {
    var sb = socialeBijdragen(winst);
    var belastbaar = Math.max(winst - sb, 0);
    var pb = personenbelasting(belastbaar, gemeentePct);
    return {
      sociaal: sb,
      belasting: pb,
      nettoPrive: Math.max(winst - sb - pb, 0),
      inVennootschap: 0
    };
  }

  function alsVennootschap(winst, bezoldiging, gemeentePct) {
    var b = Math.min(bezoldiging, winst);

    // Privézijde: de bedrijfsleider betaalt sociale bijdragen op zijn
    // bezoldiging; die zijn aftrekbaar in zijn personenbelasting.
    var sb = socialeBijdragen(b);
    var belastbaarPrive = Math.max(b - sb, 0);
    var pb = personenbelasting(belastbaarPrive, gemeentePct);
    var nettoPrive = Math.max(b - sb - pb, 0);

    // Vennootschapszijde: de bezoldiging is een aftrekbare kost.
    var winstVenn = Math.max(winst - b, 0);
    var verlaagd = b >= P.vennootschap.minimumBezoldiging;
    var venb;
    if (verlaagd) {
      var eerste = Math.min(winstVenn, P.vennootschap.grensVerlaagdTarief);
      venb = eerste * P.vennootschap.tariefVerlaagd +
             Math.max(winstVenn - P.vennootschap.grensVerlaagdTarief, 0) * P.vennootschap.tariefNormaal;
    } else {
      venb = winstVenn * P.vennootschap.tariefNormaal;
    }

    return {
      bezoldiging: b,
      sociaal: sb,
      belasting: pb,
      nettoPrive: nettoPrive,
      winstVennootschap: winstVenn,
      vennootschapsbelasting: venb,
      inVennootschap: Math.max(winstVenn - venb, 0),
      verlaagdTarief: verlaagd
    };
  }

  /* ---------- Koppeling met het formulier ---------- */

  var form = document.getElementById("vgl-tool");
  if (!form) return;

  var el = function (id) { return document.getElementById(id); };

  function getal(id) {
    var v = parseFloat(String(el(id).value).replace(",", "."));
    return isNaN(v) || v < 0 ? 0 : v;
  }

  function update() {
    var winst = getal("v-winst");
    var bezoldiging = getal("v-bezoldiging");
    var gemeente = getal("v-gemeente") / 100;

    var ez = alsEenmanszaak(winst, gemeente);
    var vn = alsVennootschap(winst, bezoldiging, gemeente);

    var totaalEz = ez.nettoPrive;
    var totaalVn = vn.nettoPrive + vn.inVennootschap;

    // Eenmanszaak
    el("ez-totaal").textContent = euro.format(totaalEz);
    el("ez-sociaal").textContent = euro.format(ez.sociaal);
    el("ez-belasting").textContent = euro.format(ez.belasting);
    el("ez-netto").textContent = euro.format(ez.nettoPrive);

    // Vennootschap
    el("vn-totaal").textContent = euro.format(totaalVn);
    el("vn-bezoldiging").textContent = euro.format(vn.bezoldiging);
    el("vn-sociaal").textContent = euro.format(vn.sociaal);
    el("vn-belasting").textContent = euro.format(vn.belasting);
    el("vn-netto").textContent = euro.format(vn.nettoPrive);
    el("vn-venb").textContent = euro.format(vn.vennootschapsbelasting);
    el("vn-blijft").textContent = euro.format(vn.inVennootschap);
    el("vn-tarief").textContent = vn.verlaagdTarief ? "20% op de eerste € 100.000" : "25%";

    // Welk scenario komt er beter uit?
    var verschil = totaalVn - totaalEz;
    var kaartEz = el("kaart-ez");
    var kaartVn = el("kaart-vn");
    kaartEz.classList.toggle("is-beste", verschil <= 0);
    kaartVn.classList.toggle("is-beste", verschil > 0);
    el("ez-tag").textContent = verschil <= 0 ? "Komt er beter uit" : "";
    el("vn-tag").textContent = verschil > 0 ? "Komt er beter uit" : "";

    var oordeel = el("uit-oordeel");
    if (winst <= 0) {
      oordeel.innerHTML = "Vul hiernaast uw verwachte jaarwinst in om beide scenario&rsquo;s te vergelijken.";
    } else if (Math.abs(verschil) < 1000) {
      oordeel.innerHTML = "Op deze cijfers ontlopen beide scenario&rsquo;s elkaar nauwelijks. " +
        "Dan wegen de <b>bijkomende kosten en verplichtingen</b> van een vennootschap zwaarder door dan het fiscale verschil.";
    } else if (verschil > 0) {
      oordeel.innerHTML = "Met een vennootschap houdt u in dit scenario ongeveer <b>" + euro.format(verschil) +
        "</b> meer over. Let wel: daarvan zit <b>" + euro.format(vn.inVennootschap) +
        "</b> nog in de vennootschap en is dus nog niet privé beschikbaar.";
    } else {
      oordeel.innerHTML = "Op deze cijfers blijft een <b>eenmanszaak</b> voordeliger, met ongeveer <b>" +
        euro.format(Math.abs(verschil)) + "</b> verschil. Een vennootschap wordt doorgaans pas interessant " +
        "bij een hogere winst, of wanneer u niet alles privé nodig heeft.";
    }

    // Waarschuwing enkel tonen wanneer ze ergens toe doet: er moet effectief
    // winst in de vennootschap achterblijven om belast te worden.
    var waarschuwing = el("uit-waarschuwing");
    if (winst > 0 && !vn.verlaagdTarief && vn.winstVennootschap > 0) {
      waarschuwing.style.display = "block";
      waarschuwing.innerHTML = "<b>Let op:</b> met een bezoldiging onder " +
        euro.format(P.vennootschap.minimumBezoldiging) +
        " verliest de vennootschap het verlaagde tarief van 20% en betaalt ze <b>25%</b> op de volledige winst. " +
        "Startende vennootschappen jonger dan vier jaar zijn wel vrijgesteld van die voorwaarde.";
    } else {
      waarschuwing.style.display = "none";
    }
  }

  form.addEventListener("input", update);
  form.addEventListener("change", update);
  form.addEventListener("submit", function (e) { e.preventDefault(); update(); });

  update();
})();
