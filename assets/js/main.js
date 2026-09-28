(function () {
  "use strict";

  document.documentElement.classList.add("js");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Cabecera y menú ---------- */
  var header = document.querySelector("[data-header]");
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.getElementById("main-nav");

  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  function setNav(open) {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
  }
  toggle.addEventListener("click", function () {
    setNav(toggle.getAttribute("aria-expanded") !== "true");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setNav(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) { setNav(false); toggle.focus(); }
  });

  /* Enlace activo según la sección visible */
  var navLinks = Array.prototype.slice.call(nav.querySelectorAll("ul a"));
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    navLinks.forEach(function (a) {
      var s = document.querySelector(a.getAttribute("href"));
      if (s) spy.observe(s);
    });
  }

  /* ---------- Apariciones al hacer scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if (!reduceMotion && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + "ms";
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Método ALMA: pestañas ---------- */
  var method = document.querySelector("[data-method]");
  if (method) {
    var tabs = Array.prototype.slice.call(method.querySelectorAll('[role="tab"]'));
    var bar = method.querySelector("[data-method-bar]");

    var select = function (index, focus) {
      tabs.forEach(function (tab, i) {
        var on = i === index;
        tab.setAttribute("aria-selected", String(on));
        tab.tabIndex = on ? 0 : -1;
        document.getElementById(tab.getAttribute("aria-controls")).hidden = !on;
      });
      if (bar) bar.style.transform = "translateX(" + index * 100 + "%)";
      if (focus) tabs[index].focus();
    };

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(i, false); });
      tab.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
        if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
        if (e.key === "Home") next = 0;
        if (e.key === "End") next = tabs.length - 1;
        if (next !== null) { e.preventDefault(); select(next, true); }
      });
    });
  }

  /* ---------- Reloj Valorador ---------- */
  var dial = document.querySelector("[data-dial]");
  if (dial) {
    var positions = [
      { label: "Sobreprecio", text: "Claramente por encima del rango competitivo. Menos interés, pocas visitas y, casi siempre, bajadas de precio obligadas más adelante.", demand: 12, speed: 10, nego: 18 },
      { label: "Precio alto", text: "Existe cierta conexión con el mercado, pero limita la demanda y alarga sensiblemente el tiempo necesario para vender.", demand: 38, speed: 32, nego: 42 },
      { label: "Precio estratégico", text: "El rango de mejor equilibrio entre valor, demanda, competencia y capacidad de negociación. Es donde solemos recomendar salir.", demand: 74, speed: 70, nego: 82 },
      { label: "Precio oportunidad", text: "Una franja especialmente atractiva para la demanda: acelera la venta y genera competencia entre compradores.", demand: 95, speed: 94, nego: 60 }
    ];
    var needle = dial.querySelector("[data-dial-needle]");
    var label = dial.querySelector("[data-dial-label]");
    var text = dial.querySelector("[data-dial-text]");
    var meters = {
      demand: dial.querySelector('[data-meter="demand"]'),
      speed: dial.querySelector('[data-meter="speed"]'),
      nego: dial.querySelector('[data-meter="nego"]')
    };
    var buttons = Array.prototype.slice.call(dial.querySelectorAll("[data-pos]"));
    var segs = Array.prototype.slice.call(dial.querySelectorAll("[data-seg]"));

    var setPos = function (pos) {
      var p = positions[pos];
      // pos 3 (izquierda) → -67.5°, pos 0 (derecha) → +67.5°
      needle.style.transform = "rotate(" + (1.5 - pos) * 45 + "deg)";
      label.textContent = p.label;
      text.textContent = p.text;
      Object.keys(meters).forEach(function (k) { meters[k].style.width = p[k] + "%"; });
      buttons.forEach(function (b) { b.setAttribute("aria-checked", String(+b.dataset.pos === pos)); });
      segs.forEach(function (s) { s.classList.toggle("is-active", +s.dataset.seg === pos); });
    };

    buttons.forEach(function (b) { b.addEventListener("click", function () { setPos(+b.dataset.pos); }); });
    segs.forEach(function (s) { s.addEventListener("click", function () { setPos(+s.dataset.seg); }); });

    // Empieza en sobreprecio y cae al precio estratégico al entrar en pantalla
    if (!reduceMotion && "IntersectionObserver" in window) {
      setPos(0);
      var dialIo = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { setTimeout(function () { setPos(2); }, 500); dialIo.disconnect(); }
      }, { threshold: 0.5 });
      dialIo.observe(dial);
    } else {
      setPos(2);
    }
  }

  /* ---------- Canal ALMA: mensajes ---------- */
  var chat = document.querySelector("[data-chat]");
  if (chat) {
    var msgs = Array.prototype.slice.call(chat.querySelectorAll(".msg"));
    var showAll = function () { msgs.forEach(function (m) { m.classList.add("is-shown"); }); };
    if (reduceMotion || !("IntersectionObserver" in window)) {
      showAll();
    } else {
      var chatIo = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        msgs.forEach(function (m, i) { setTimeout(function () { m.classList.add("is-shown"); }, 350 + i * 650); });
        chatIo.disconnect();
      }, { threshold: 0.4 });
      chatIo.observe(chat);
    }
  }

  /* ---------- Formulario de contacto ---------- */
  var form = document.querySelector("[data-contact-form]");
  if (form) {
    var status = form.querySelector("[data-form-status]");
    var contact = window.ALMA_CONTACT || {};

    var setStatus = function (msg, kind) {
      status.textContent = msg;
      status.className = "form-status" + (kind ? " is-" + kind : "");
    };

    var summary = function (data) {
      return [
        "Hola, soy " + data.get("nombre") + ".",
        "Teléfono: " + data.get("telefono"),
        data.get("email") ? "Email: " + data.get("email") : "",
        data.get("zona") ? "Zona: " + data.get("zona") : "",
        "Momento: " + data.get("momento"),
        data.get("mensaje") ? "\n" + data.get("mensaje") : ""
      ].filter(Boolean).join("\n");
    };

    var fallback = function (data) {
      var body = summary(data);
      if (contact.whatsapp) {
        window.open("https://wa.me/" + contact.whatsapp + "?text=" + encodeURIComponent(body), "_blank", "noopener");
        setStatus("Te hemos abierto WhatsApp con tu mensaje preparado.", "ok");
      } else if (contact.email) {
        window.location.href = "mailto:" + contact.email + "?subject=" + encodeURIComponent("Consulta desde la web · " + data.get("nombre")) + "&body=" + encodeURIComponent(body);
        setStatus("Te hemos abierto tu correo con el mensaje preparado.", "ok");
      } else {
        setStatus("No hemos podido enviar el formulario. Escríbenos por Instagram a @" + (contact.instagram || "almainmo") + ".", "error");
      }
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var invalid = null;
      Array.prototype.forEach.call(form.querySelectorAll("[required]"), function (field) {
        var ok = field.type === "checkbox" ? field.checked : field.value.trim() !== "";
        field.setAttribute("aria-invalid", String(!ok));
        if (!ok && !invalid) invalid = field;
      });
      if (invalid) {
        setStatus(invalid.type === "checkbox" ? "Necesitamos que aceptes la política de privacidad." : "Por favor, completa tu nombre y teléfono.", "error");
        invalid.focus();
        return;
      }

      var data = new FormData(form);
      var submit = form.querySelector('[type="submit"]');
      submit.disabled = true;
      setStatus("Enviando…");

      // Netlify Forms: en otros alojamientos la petición falla y usamos WhatsApp / email.
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data).toString()
      }).then(function (res) {
        if (!res.ok) throw new Error(res.status);
        form.reset();
        setStatus("Gracias. Hemos recibido tu mensaje y te llamaremos muy pronto.", "ok");
      }).catch(function () {
        fallback(data);
      }).then(function () {
        submit.disabled = false;
      });
    });
  }

  /* Año del pie */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
