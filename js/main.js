/* Jansseune & Co — main.js */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Sticky header ---------- */
  var header = document.querySelector(".site-header");

  /* Twee drempels in plaats van één: rond de 24 px flikkerde de header bij
     het kleinste scrollduwtje aan en uit. */
  function onScroll() {
    if (!header) return;
    var y = window.scrollY;
    if (y > 40) header.classList.add("is-scrolled");
    else if (y < 8) header.classList.remove("is-scrolled");
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobiel menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("nav-open")) {
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---------- Scroll-reveals ---------- */
  var revealEls = document.querySelectorAll(".reveal");

  if (revealEls.length && "IntersectionObserver" in window && !prefersReduced) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* De optellende teller is bewust verwijderd. Hij animeerde onder meer naar
     "1" en naar "4": beweging zonder inhoud, en het cijfer stond de eerste
     seconde verkeerd. De eindwaarden staan letterlijk in de HTML, dus de
     statenbalk klopt nu vanaf het eerste frame. De data-count-attributen
     mogen blijven staan als documentatie van de bedoelde waarde. */

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var btn = item.querySelector(".faq-q");
    if (!btn) return;

    btn.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");

      item.parentElement.querySelectorAll(".faq-item.is-open").forEach(function (o) {
        o.classList.remove("is-open");
        var q = o.querySelector(".faq-q");
        if (q) q.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- Contactformulier ----------
     Werkt in twee standen:

     1. FORM_ENDPOINT leeg  -> het bericht wordt geopend in het
        e-mailprogramma van de bezoeker (mailto). Werkt zonder enige
        server, maar faalt stil bij wie enkel webmail gebruikt.
     2. FORM_ENDPOINT ingevuld -> het bericht wordt rechtstreeks
        verstuurd naar ides@jansseune.eu via een formulierdienst.
        Zie README.md voor de exacte stappen; enkel de regel
        hieronder moet wijzigen.                                    */
  var FORM_ENDPOINT = "";

  var form = document.getElementById("contact-form");

  if (form) {
    var status = form.querySelector(".form-status");

    // soort: "ok" (echt verzonden), "info" (actie bij de bezoeker) of "fout"
    var toon = function (html, soort) {
      if (!status) return;
      status.innerHTML = html;
      status.classList.toggle("is-ok", soort === "ok");
      status.classList.toggle("is-info", soort === "info");
      status.classList.toggle("is-err", soort === "fout");
    };

    var get = function (name) {
      var el = form.querySelector('[name="' + name + '"]');
      return el ? el.value.trim() : "";
    };

    var viaMailclient = function () {
      var onderwerp = "Contactaanvraag via jansseune.eu — " + get("naam");
      var tekst =
        "Naam: " + get("naam") + "\n" +
        "E-mail: " + get("email") + "\n" +
        "Telefoon: " + (get("telefoon") || "—") + "\n" +
        "Onderwerp: " + (get("onderwerp") || "—") + "\n\n" +
        get("bericht");

      window.location.href =
        "mailto:ides@jansseune.eu?subject=" +
        encodeURIComponent(onderwerp) +
        "&body=" +
        encodeURIComponent(tekst);

      // Bewust geen groene bevestiging: er is nog niets verzonden. De
      // bezoeker moet zelf nog op verzenden drukken in zijn mailprogramma.
      toon(
        "<b>Uw e-mailprogramma zou nu moeten openen</b> met uw bericht erin — " +
        "er is nog niets verzonden. Gebeurt er niets, bijvoorbeeld omdat u " +
        "webmail gebruikt? Mail ons dan rechtstreeks op " +
        '<a href="mailto:ides@jansseune.eu">ides@jansseune.eu</a> of bel ' +
        '<a href="tel:+3250222228">050 22 22 28</a>.',
        "info"
      );
    };

    var viaEndpoint = function (knop) {
      var oudeTekst = knop ? knop.innerHTML : "";
      if (knop) {
        knop.disabled = true;
        knop.textContent = "Bezig met verzenden…";
      }

      var herstel = function () {
        if (knop) {
          knop.disabled = false;
          knop.innerHTML = oudeTekst;
        }
      };

      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          naam: get("naam"),
          email: get("email"),
          telefoon: get("telefoon"),
          onderwerp: get("onderwerp"),
          bericht: get("bericht")
        })
      })
        .then(function (res) {
          if (!res.ok) throw new Error(res.status);
          form.reset();
          herstel();
          toon(
            "Bedankt, uw bericht is verstuurd. We nemen zo snel mogelijk contact " +
            "met u op — meestal binnen één werkdag.",
            "ok"
          );
        })
        .catch(function () {
          herstel();
          toon(
            "Het verzenden lukte niet. Mail ons rechtstreeks op " +
            '<a href="mailto:ides@jansseune.eu">ides@jansseune.eu</a> of bel ' +
            '<a href="tel:+3250222228">050 22 22 28</a> — dan helpen we u meteen verder.',
            "fout"
          );
        });
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Spamval: alleen geautomatiseerde invullers raken dit verborgen veld
      // aan. Mocht een echte bezoeker hier toch in belanden, dan krijgt hij
      // een uitweg in plaats van een knop die niets doet.
      if (get("jansseune-controle") !== "") {
        toon(
          "Uw bericht kon niet verwerkt worden. Mail ons gerust rechtstreeks op " +
          '<a href="mailto:ides@jansseune.eu">ides@jansseune.eu</a> of bel ' +
          '<a href="tel:+3250222228">050 22 22 28</a>.',
          "fout"
        );
        return;
      }

      var valid = true;

      form.querySelectorAll("[required]").forEach(function (input) {
        var field = input.closest(".field");
        var ok = input.value.trim() !== "";

        if (ok && input.type === "email") {
          ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
        }

        if (field) field.classList.toggle("is-invalid", !ok);
        if (!ok) valid = false;
      });

      if (!valid) {
        var firstInvalid = form.querySelector(".is-invalid input, .is-invalid textarea");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      if (FORM_ENDPOINT) {
        viaEndpoint(form.querySelector('button[type="submit"]'));
      } else {
        viaMailclient();
      }
    });

    form.querySelectorAll("input, textarea, select").forEach(function (input) {
      input.addEventListener("input", function () {
        var field = input.closest(".field");
        if (field) field.classList.remove("is-invalid");
      });
    });
  }

  /* ---------- Jaartal in footer ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
