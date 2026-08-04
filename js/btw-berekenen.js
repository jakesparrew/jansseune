/* Jansseune & Co — btw berekenen
 *
 * De Belgische btw-tarieven staan al jaren vast op 21, 12, 6 en 0 procent.
 * Wijzigt daar ooit iets aan, dan volstaat het de knoppen in
 * btw-berekenen.html aan te passen; deze code rekent met wat er gekozen is.
 */
(function () {
  "use strict";

  var form = document.getElementById("btw-tool");
  if (!form) return;

  var euro = new Intl.NumberFormat("nl-BE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  function bereken(bedrag, tarief, richting) {
    var t = tarief / 100;
    var excl, btw;

    if (richting === "incl") {
      // Het ingevulde bedrag is inclusief btw: we halen de btw eruit.
      excl = bedrag / (1 + t);
      btw = bedrag - excl;
    } else {
      // Het ingevulde bedrag is exclusief btw: we tellen de btw erbij.
      excl = bedrag;
      btw = bedrag * t;
    }

    return { excl: excl, btw: btw, incl: excl + btw };
  }

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
    var tarief = parseFloat(gekozen("tarief", "21"));
    var richting = gekozen("richting", "excl");
    var r = bereken(getal("b-bedrag"), tarief, richting);

    el("uit-excl").textContent = euro.format(r.excl);
    el("uit-btw").textContent = euro.format(r.btw);
    el("uit-incl").textContent = euro.format(r.incl);
    el("uit-tarief").textContent = tarief + "%";

    // Het interessantste getal krijgt de hoofdrol: bij uithalen is dat het
    // bedrag zonder btw, bij bijtellen het bedrag dat de klant betaalt.
    el("uit-hoofd").textContent = euro.format(richting === "incl" ? r.excl : r.incl);
    el("uit-hoofd-label").textContent =
      richting === "incl" ? "Bedrag exclusief btw" : "Bedrag inclusief btw";

    el("b-bedrag-label").textContent =
      richting === "incl" ? "Bedrag inclusief btw" : "Bedrag exclusief btw";
  }

  form.addEventListener("input", update);
  form.addEventListener("change", update);
  form.addEventListener("submit", function (e) { e.preventDefault(); update(); });

  update();
})();
