(function () {
  // [почеток, крај, час, инструктор]
  var MON_WED = [["8:00", "9:00", "Хата и Винјаса јога", "Маја"], ["18:00", "19:30", "Хата јога", "Симоне"], ["19:30", "21:00", "Хата јога, напредно ниво", "Симоне"]];
  var TUE_THU = [["7:45", "8:45", "Хата јога", "Јасмина"], ["18:00", "19:30", "Аштанга Винјаса јога", "Марина"], ["19:45", "20:45", "Функционална јога", "Михаела"]];
  var FRI = [["8:00", "9:00", "Хата и Винјаса јога", "Маја"], ["18:00", "19:30", "Хата јога", "Симоне"], ["19:30", "21:00", "Винјаса јога, напредно ниво", ""]];
  var WEEKEND = [["8:00", "16:00", "Обука за јога учители, 200 часа", ""]];
  var days = [
    { name: "Недела", list: WEEKEND }, { name: "Понеделник", list: MON_WED }, { name: "Вторник", list: TUE_THU },
    { name: "Среда", list: MON_WED }, { name: "Четврток", list: TUE_THU }, { name: "Петок", list: FRI }, { name: "Сабота", list: WEEKEND }
  ];
  var months = ["јануари", "февруари", "март", "април", "мај", "јуни", "јули", "август", "септември", "октомври", "ноември", "декември"];
  var now = new Date(), today = now.getDay(), minutesNow = now.getHours() * 60 + now.getMinutes();
  function toMinutes(t) { var p = t.split(":"); return +p[0] * 60 + +p[1]; }
  function esc(s) { return s.replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function who(c) { return c[3] ? "со " + c[3] : ""; }

  document.getElementById("today-date").textContent = days[today].name + ", " + now.getDate() + " " + months[now.getMonth()];
  var nextShown = false;
  document.getElementById("today-list").innerHTML = days[today].list.map(function (c) {
    var past = toMinutes(c[1]) <= minutesNow, tag = "";
    if (!past && !nextShown) { tag = '<span class="next-tag">' + (toMinutes(c[0]) <= minutesNow ? "во тек" : "следен") + "</span>"; nextShown = true; }
    return '<li class="' + (past ? "past" : "") + '"><time>' + esc(c[0]) + "</time><span>" + esc(c[2]) + tag + "</span>" +
      (who(c) ? '<span class="who">' + esc(who(c)) + "</span>" : "") + "</li>";
  }).join("");
  if (!nextShown) {
    document.getElementById("today-title").textContent = "Денешните часови завршија";
    var t = days[(today + 1) % 7];
    document.getElementById("today-list").insertAdjacentHTML("afterend",
      "<p>Утре прв час е во " + esc(t.list[0][0]) + ": " + esc(t.list[0][2]) + ".</p>");
  }

  function dayCol(title, list, isToday) {
    return '<div class="day' + (isToday ? " is-today" : "") + '"><h3>' + title + "</h3><ul>" +
      list.map(function (c) {
        return "<li><time>" + esc(c[0]) + " до " + esc(c[1]) + "</time><span>" + esc(c[2]) + "</span>" +
          (who(c) ? '<span class="who">' + esc(who(c)) + "</span>" : "") + "</li>";
      }).join("") + "</ul></div>";
  }
  var cols = [1, 2, 3, 4, 5].map(function (i) { return dayCol(days[i].name, days[i].list, i === today); });
  cols.push(dayCol("Сабота и недела", WEEKEND, today === 0 || today === 6));
  document.getElementById("week").innerHTML = cols.join("");

  // lotus mandala: three rings of petals
  var m = document.getElementById("mandala"), out = "";
  [[16, 60, 14, 130], [12, 40, 12, 80], [8, 26, 9, 44]].forEach(function (r) {
    for (var i = 0; i < r[0]; i++) {
      out += '<ellipse cx="0" cy="' + (-r[3]) + '" rx="' + r[2] + '" ry="' + r[1] / 2 + '" transform="rotate(' + (360 / r[0] * i) + ')"/>';
    }
  });
  out += '<circle r="190"/><circle r="22"/>';
  m.innerHTML = out;
})();
(function () {
  document.querySelector(".brand").addEventListener("click", function (e) {
    e.preventDefault();
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  });
})();
(function () {
  var btn = document.getElementById("menu-btn"), nav = document.getElementById("main-nav");
  function setOpen(open) { nav.classList.toggle("open", open); btn.setAttribute("aria-expanded", open ? "true" : "false"); btn.setAttribute("aria-label", open ? "Затворете го менито" : "Мени"); document.documentElement.classList.toggle("menu-open", open); }
  window.addEventListener("resize", function () { if (window.innerWidth > 860) setOpen(false); });
  btn.addEventListener("click", function () { setOpen(!nav.classList.contains("open")); });
  nav.addEventListener("click", function (e) {
    var a = e.target.closest("a");
    if (!a) return;
    var h = a.getAttribute("href") || "";
    var wasOpen = nav.classList.contains("open");
    setOpen(false);
    // on phones the page is locked while the menu is open; unlock first, then scroll ourselves on the next frame
    if (wasOpen && h.charAt(0) === "#" && h.length > 1) {
      var t = document.getElementById(h.slice(1));
      if (!t) return;
      e.preventDefault();
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          var head = document.querySelector("header");
          var y = t.getBoundingClientRect().top + window.pageYOffset - (head ? head.offsetHeight : 0);
          var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          window.scrollTo({ top: Math.max(0, y), behavior: reduce ? "auto" : "smooth" });
          if (history.replaceState) history.replaceState(null, "", h);
        });
      });
    }
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
})();
(function () {
  // every phone link asks how to get in touch: call, WhatsApp or Viber
  var sheet = document.getElementById("call-sheet");
  if (!sheet || typeof sheet.showModal !== "function") return;
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="tel:"]');
    if (!a || a.hasAttribute("data-direct")) return;
    e.preventDefault();
    sheet.showModal();
    document.documentElement.classList.add("sheet-open");
  });
  sheet.addEventListener("close", function () { document.documentElement.classList.remove("sheet-open"); });
  sheet.addEventListener("click", function (e) {
    if (e.target === sheet || e.target.id === "call-close" || e.target.closest(".call-opt")) sheet.close();
  });
})();
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // entrances for content below the first screen
  if (!reduce && "IntersectionObserver" in window) {
    var targets = document.querySelectorAll(".head, .about-text > p, .seal-row, .about-words, .practices > div, .stones, .facts > div, .ytt-text > *, .event, .contact > div, .frame, .pay-note, .founder figcaption, .extras");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.remove("pre"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    targets.forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      var i = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.classList.add("reveal", "pre");
      el.style.transitionDelay = (i % 6) * 90 + "ms";
      io.observe(el);
    });
  }

  // lotus cursor that follows with a calm delay
  if (reduce || !window.matchMedia || !window.matchMedia("(pointer: fine)").matches || window.innerWidth < 860) return;
  var dot = document.getElementById("cursor-dot"), lotus = document.getElementById("cursor-lotus");
  var mx = -100, my = -100, lx = -100, ly = -100, started = false;
  document.addEventListener("mousemove", function (e) {
    mx = e.clientX; my = e.clientY;
    if (!started) { started = true; lx = mx; ly = my; document.documentElement.classList.add("has-cursor"); requestAnimationFrame(loop); }
    var t = e.target;
    lotus.classList.toggle("is-link", !!(t.closest && t.closest("a, button")));
    var dark = !!(t.closest && t.closest(".s-plum, .today, .btn-solid, .stone:nth-child(4)"));
    lotus.classList.toggle("on-dark", dark); dot.classList.toggle("on-dark", dark);
  });
  document.addEventListener("mouseleave", function () { document.documentElement.classList.remove("has-cursor"); started = false; });
  function loop() {
    lx += (mx - lx) * 0.14; ly += (my - ly) * 0.14;
    dot.style.transform = "translate(" + mx + "px," + my + "px)";
    lotus.style.transform = "translate(" + lx + "px," + ly + "px)";
    if (started) requestAnimationFrame(loop);
  }
})();
(function () {
  // Macedonian typesetting: one- and two-letter words and numbers stay with the next word,
  // and the last word of a paragraph never sits alone on a line
  var SHORT = /(^|[\s(\u00A0])([А-Яа-яЃЌЉЊЏЅЈѓќљњџѕјA-Za-z]{1,2}) (?=\S)/g;
  function tie(t) {
    var prev;
    do { prev = t; t = t.replace(SHORT, "$1$2\u00A0"); } while (t !== prev);
    t = t.replace(/(\d) (?=\S)/g, "$1\u00A0");
    // a tied chain must still be able to wrap: reopen the break after a long word near its middle
    return t.split(" ").map(function (chunk) {
      while (chunk.length > 22) {
        var parts = chunk.split("\u00A0"), best = -1, half = chunk.length / 2, pos = 0, bestDist = 1e9;
        for (var k = 0; k < parts.length - 1; k++) {
          pos += parts[k].length + 1;
          if (parts[k].length >= 3 && !/\d$/.test(parts[k]) && Math.abs(pos - half) < bestDist) { best = pos - 1; bestDist = Math.abs(pos - half); }
        }
        if (best < 0) break;
        return chunk.slice(0, best) + " " + chunk.slice(best + 1);
      }
      return chunk;
    }).join(" ");
  }
  var walker = document.createTreeWalker(document.querySelector("main"), NodeFilter.SHOW_TEXT, {
    acceptNode: function (n) { return n.parentNode.closest("script, style, svg, .label") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; }
  });
  var n;
  while ((n = walker.nextNode())) n.nodeValue = tie(n.nodeValue);
  document.querySelectorAll("main p, main dd").forEach(function (el) {
    var last = el.lastChild;
    while (last && last.nodeType !== 3) last = last.previousSibling;
    if (!last) return;
    var t = last.nodeValue.replace(/\s+$/, ""), i = t.lastIndexOf(" ");
    var prevWord = t.slice(0, i).split(/[\s\u00A0]/).pop();
    if (i > 0 && t.length - i < 10 && prevWord.length + t.length - i < 18) last.nodeValue = t.slice(0, i) + "\u00A0" + t.slice(i + 1);
  });
})();

(function () {
  // GitHub Pages lets phones keep the page for up to 10 minutes, and phones keep open tabs.
  // Ask the server for the current page; if it points to a newer main.js, reload once.
  var me = document.currentScript && document.currentScript.src;
  var mine = me && me.split("?v=")[1];
  if (!mine || !window.fetch) return;
  function check() {
    fetch(location.pathname + "?fresh=" + Date.now(), { cache: "no-store" }).then(function (r) { return r.ok ? r.text() : ""; }).then(function (html) {
      var m = html.match(/main\.js\?v=([a-f0-9]+)/);
      if (!m || m[1] === mine) return;
      try { if (sessionStorage.getItem("maitri-reloaded") === m[1]) return; sessionStorage.setItem("maitri-reloaded", m[1]); } catch (e) {}
      location.reload();
    }).catch(function () {});
  }
  check();
  window.addEventListener("pageshow", function (e) { if (e.persisted) check(); });
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "visible") check(); });
})();
