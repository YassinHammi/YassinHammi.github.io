(function () {
    "use strict";

    var iframe = document.getElementById("ship-screen");
    var labelEl = document.getElementById("ship-screen-label");
    var clockEl = document.getElementById("ship-mission-clock");
    var themeToggle = document.getElementById("theme-toggle");
    var stations = Array.from(document.querySelectorAll(".ship-station")).sort(function (a, b) {
        return Number(a.getAttribute("data-pov")) - Number(b.getAttribute("data-pov"));
    });
    var sidePanels = document.querySelectorAll(".ship-side-panel");

    if (!iframe || !stations.length) return;

    function pushThemeToFrame(theme) {
        if (!iframe || !iframe.contentWindow) return;
        iframe.contentWindow.postMessage({ type: "ship-theme", theme: theme }, "*");
    }

    function applyTheme(theme) {
        var normalized = theme === "light" ? "light" : "dark";
        document.body.setAttribute("data-theme", normalized);
        if (themeToggle) {
            themeToggle.textContent = normalized === "dark" ? "Light mode" : "Dark mode";
        }
        pushThemeToFrame(normalized);
    }

    var savedTheme = null;
    try {
        savedTheme = localStorage.getItem("shipTheme");
    } catch (e) {
        savedTheme = null;
    }
    applyTheme(savedTheme || "dark");

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            var next = document.body.getAttribute("data-theme") === "light" ? "dark" : "light";
            applyTheme(next);
            try {
                localStorage.setItem("shipTheme", next);
            } catch (e) {
                // Storage may be unavailable; keep in-memory theme only.
            }
        });
    }

    iframe.addEventListener("load", function () {
        pushThemeToFrame(document.body.getAttribute("data-theme") || "dark");
    });

    function setStation(btn) {
        var src = btn.getAttribute("data-src");
        var lab = btn.getAttribute("data-label");
        var pov = btn.getAttribute("data-pov");
        if (!src) return;
        iframe.src = src;
        if (labelEl && lab) labelEl.textContent = lab;
        if (pov !== null && document.body.classList.contains("ship-bridge")) {
            document.body.setAttribute("data-pov", pov);
        }
        stations.forEach(function (b) {
            b.classList.toggle("is-active", b === btn);
        });
        iframe.setAttribute(
            "title",
            lab ? lab.replace(/MAIN COMPUTER — /i, "") : "Main computer"
        );
        updateSidePanel(src);
        updateEdgeButtons();
    }

    function updateSidePanel(src) {
        if (!sidePanels.length) return;
        var key = "home";
        if (src === "gallery.html") key = "gallery";
        if (src === "games.html") key = "games";

        sidePanels.forEach(function (panel) {
            panel.classList.toggle("is-active", panel.getAttribute("data-panel") === key);
        });
    }

    stations.forEach(function (btn) {
        btn.addEventListener("click", function () {
            setStation(btn);
        });
    });

    var navLeft = document.getElementById("ship-nav-left");
    var navRight = document.getElementById("ship-nav-right");
    var reduceMotion = window.matchMedia
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : { matches: false };
    var tiltTimer = null;

    function applyTilt(delta) {
        if (!document.body.classList.contains("ship-bridge")) return;
        if (reduceMotion && reduceMotion.matches) return;

        document.body.classList.remove("ship-tilting-left", "ship-tilting-right");
        document.body.classList.add(delta < 0 ? "ship-tilting-left" : "ship-tilting-right");

        if (tiltTimer) window.clearTimeout(tiltTimer);
        tiltTimer = window.setTimeout(function () {
            document.body.classList.remove("ship-tilting-left", "ship-tilting-right");
        }, 240);
    }

    function getActiveIndex() {
        for (var i = 0; i < stations.length; i++) {
            if (stations[i].classList.contains("is-active")) return i;
        }
        return 0;
    }

    function goDelta(delta) {
        var idx = getActiveIndex() + delta;
        if (idx < 0 || idx >= stations.length) return;
        applyTilt(delta);
        setStation(stations[idx]);
    }

    function updateEdgeButtons() {
        var idx = getActiveIndex();
        if (navLeft) navLeft.hidden = idx <= 0;
        if (navRight) navRight.hidden = idx >= stations.length - 1;
    }

    if (navLeft) {
        navLeft.addEventListener("click", function () {
            goDelta(-1);
        });
    }

    if (navRight) {
        navRight.addEventListener("click", function () {
            goDelta(1);
        });
    }

    document.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") goDelta(-1);
        if (e.key === "ArrowRight") goDelta(1);
    });

    updateEdgeButtons();
    updateSidePanel("home.html");

    if (clockEl) {
        var t0 = Date.now();
        function tick() {
            var s = Math.floor((Date.now() - t0) / 1000);
            var h = String(Math.floor(s / 3600)).padStart(2, "0");
            var m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
            var sec = String(s % 60).padStart(2, "0");
            clockEl.textContent = h + ":" + m + ":" + sec + " MET";
        }
        tick();
        setInterval(tick, 1000);
    }
})();
