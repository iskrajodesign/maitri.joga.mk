(function () {
  var K = {
    hv: ["Хата Винјаса јога", "k-hv"], aj: ["Ајенгар јога", "k-aj"], as: ["Аштанга Винјаса работилници", "k-as"],
    fn: ["Функционална пракса", "k-fn"], vn: ["Винјаса пракса, напредно ниво", "k-vn"],
    ob: ["Обука за јога учители", "k-ob"], jr: ["Јога работилници", "k-jr"], jf: ["Јогиска филозофија", "k-jf"]
  };
  // [почеток, крај (ако е објавен), вид на час]
  var MON_WED = [["8:00", "", "hv"], ["18:00", "", "hv"], ["19:30", "", "aj"]];
  var TUE_THU = [["18:30", "", "as"], ["20:15", "", "fn"]];
  var FRI = [["8:00", "", "hv"], ["19:30", "", "vn"]];
  var WEEKEND = [["8:00", "16:00", "ob"], ["8:00", "12:00", "jr"], ["13:00", "16:00", "jf"]];
  var ROWS = [["Понеделник", MON_WED], ["Вторник", TUE_THU], ["Среда", MON_WED], ["Четврток", TUE_THU], ["Петок", FRI], ["Сабота и недела", WEEKEND]];
  var TABS = [["Пон", 0], ["Вто", 1], ["Сре", 2], ["Чет", 3], ["Пет", 4], ["Саб", 5], ["Нед", 5]];
  var now = new Date(), dow = now.getDay(), minutesNow = now.getHours() * 60 + now.getMinutes();
  var todayRow = (dow === 0 || dow === 6) ? 5 : dow - 1;
  var todayTab = dow === 0 ? 6 : dow === 6 ? 5 : dow - 1;
  function toMinutes(t) { var p = t.split(":"); return +p[0] * 60 + +p[1]; }
  function esc(s) { return s.replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }

  var rowsEl = document.getElementById("sched-rows"), tabsEl = document.getElementById("sched-tabs");
  var nextDone = false;
  rowsEl.innerHTML = ROWS.map(function (r, i) {
    var isToday = i === todayRow;
    var chips = r[1].map(function (c) {
      var tag = "", past = false;
      if (isToday) {
        // evening start times are published without an end; assume about 75 minutes just to know when a class is over
        var end = c[1] ? toMinutes(c[1]) : toMinutes(c[0]) + 75;
        past = end <= minutesNow;
        if (!past && !nextDone) { tag = '<span class="next-tag">' + (toMinutes(c[0]) <= minutesNow ? "во тек" : "следен") + "</span>"; nextDone = true; }
      }
      return '<li class="chip ' + K[c[2]][1] + (c[1] ? " range" : "") + (past ? " past" : "") + '"><time>' + esc(c[0]) + (c[1] ? " до " + esc(c[1]) : "") + "</time><span>" + esc(K[c[2]][0]) + tag + "</span></li>";
    }).join("");
    return '<section class="srow' + (isToday ? " is-today" : "") + '" data-row="' + i + '"><h3>' + r[0] + "</h3><ul>" + chips + "</ul>" +
      (i === 5 ? '<p class="srow-note">Обуката се одржува секој втор викенд.</p>' : "") + "</section>";
  }).join("");
  tabsEl.innerHTML = TABS.map(function (t, i) {
    return '<button type="button" role="tab" class="stab' + (i === todayTab ? " is-today" : "") + '" data-tab="' + i + '" data-row="' + t[1] + '">' + t[0] + "</button>";
  }).join("");
  function showTab(i) {
    var tabs = tabsEl.children, rows = rowsEl.children, row = TABS[i][1];
    for (var k = 0; k < tabs.length; k++) { var on = k === i; tabs[k].classList.toggle("on", on); tabs[k].setAttribute("aria-selected", on ? "true" : "false"); }
    for (var q = 0; q < rows.length; q++) rows[q].classList.toggle("is-active", q === row);
  }
  tabsEl.addEventListener("click", function (e) { var b = e.target.closest(".stab"); if (b) showTab(+b.getAttribute("data-tab")); });
  showTab(todayTab);

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
    var targets = document.querySelectorAll(".head, .about-text > p, .seal-row, .about-words, .practices > div, .plans, .plans-cta, .facts > div, .ytt-text > *, .event, .contact > div, .frame, .pay-note, .founder figcaption, .extras");
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
    var dark = !!(t.closest && t.closest(".s-plum, .btn-solid, .k-ob"));
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
