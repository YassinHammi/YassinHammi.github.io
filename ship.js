(function () {
    "use strict";

    var RE_MON_PREFIX = /^MAIN COMPUTER — /i;
    var PANEL_BY_SRC = { "gallery.html": "gallery", "auth.html": "auth", "games.html": "games" };

    var iframe = document.getElementById("ship-screen");
    var labelEl = document.getElementById("ship-screen-label");
    var clockEl = document.getElementById("ship-mission-clock");
    var themeToggle = document.getElementById("theme-toggle");
    var stations = Array.from(document.querySelectorAll(".ship-station")).sort(function (a, b) {
        return Number(a.getAttribute("data-pov")) - Number(b.getAttribute("data-pov"));
    });
    var navStations = stations.filter(function (b) {
        return b.getAttribute("data-src") !== "auth.html";
    });
    var authStation = null;
    var authIndex = -1;
    var homeStation = null;
    for (var si = 0; si < stations.length; si++) {
        var stSrc = stations[si].getAttribute("data-src");
        if (stSrc === "auth.html") {
            authStation = stations[si];
            authIndex = si;
        } else if (stSrc === "home.html") {
            homeStation = stations[si];
        }
    }
    var sidePanels = document.querySelectorAll(".ship-side-panel");
    var monitorFrame = document.querySelector(".ship-monitor-frame");
    var navBusy = false;
    var activeStationIndex = 0;
    var activeArrowIndex = 0;
    for (var ini = 0; ini < stations.length; ini++) {
        if (stations[ini].classList.contains("is-active")) {
            activeStationIndex = ini;
            activeArrowIndex = navStations.indexOf(stations[ini]);
            break;
        }
    }

    if (!iframe || !stations.length) return;

    function pushThemeToFrame(theme) {
        if (!iframe.contentWindow) return;
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
            } catch (e) {}
        });
    }

    iframe.addEventListener("load", function () {
        pushThemeToFrame(document.body.getAttribute("data-theme") || "dark");
    });

    function applyStationUi(btn, src, lab, pov) {
        if (labelEl && lab) labelEl.textContent = lab;
        if (pov !== null && document.body.classList.contains("ship-bridge")) {
            document.body.setAttribute("data-pov", pov);
        }
        for (var i = 0; i < stations.length; i++) {
            var on = stations[i] === btn;
            stations[i].classList.toggle("is-active", on);
            if (on) activeStationIndex = i;
        }
        activeArrowIndex = navStations.indexOf(btn);
        iframe.setAttribute("title", lab ? lab.replace(RE_MON_PREFIX, "") : "Main computer");
        updateSidePanel(src);
        updateEdgeButtons();
    }

    function setStation(btn) {
        var src = btn.getAttribute("data-src");
        var lab = btn.getAttribute("data-label");
        var pov = btn.getAttribute("data-pov");
        if (!src) return;
        if (btn.classList.contains("is-active")) return;
        if (navBusy) return;

        var prevIdx = activeStationIndex;
        var newIdx = stations.indexOf(btn);
        var dir = newIdx > prevIdx ? 1 : -1;

        if (!monitorFrame) {
            iframe.src = src;
            applyStationUi(btn, src, lab, pov);
            return;
        }

        navBusy = true;
        monitorFrame.style.setProperty("--ship-slide-dir", String(dir));
        monitorFrame.classList.remove("is-iframe-enter", "is-iframe-hold");

        monitorFrame.classList.add("is-iframe-out");

        var outFinished = false;
        function finishOut() {
            if (outFinished) return;
            outFinished = true;
            clearTimeout(outFallback);
            iframe.removeEventListener("transitionend", onOutEnd);
            iframe.src = src;
            applyStationUi(btn, src, lab, pov);

            var entered = false;
            function beginEnter() {
                if (entered) return;
                entered = true;
                clearTimeout(loadFallback);
                iframe.removeEventListener("load", onNavLoad);
                monitorFrame.classList.remove("is-iframe-out");
                monitorFrame.classList.add("is-iframe-hold");

                function startEnterAnim() {
                    monitorFrame.classList.remove("is-iframe-hold");
                    monitorFrame.classList.add("is-iframe-enter");

                    var enterCleaned = false;
                    function endEnter() {
                        if (enterCleaned) return;
                        enterCleaned = true;
                        monitorFrame.classList.remove("is-iframe-enter");
                        iframe.removeEventListener("animationend", onAnimEnd);
                        clearTimeout(enterFallback);
                        navBusy = false;
                    }

                    function onAnimEnd(e) {
                        if (e.target !== iframe) return;
                        var name = e.animationName || "";
                        if (
                            name.indexOf("ship-iframe-slide-in") === -1 &&
                            name.indexOf("ship-iframe-fade-in") === -1
                        ) {
                            return;
                        }
                        endEnter();
                    }

                    iframe.addEventListener("animationend", onAnimEnd);
                    var enterFallback = setTimeout(endEnter, 650);
                }

                requestAnimationFrame(function () {
                    requestAnimationFrame(startEnterAnim);
                });
            }

            function onNavLoad() {
                beginEnter();
            }

            iframe.addEventListener("load", onNavLoad);
            var loadFallback = setTimeout(beginEnter, 520);
        }

        function onOutEnd(e) {
            if (e.target !== iframe || e.propertyName !== "opacity") return;
            finishOut();
        }

        iframe.addEventListener("transitionend", onOutEnd);
        var outFallback = setTimeout(finishOut, 420);
    }

    function updateSidePanel(src) {
        if (!sidePanels.length) return;
        var key = PANEL_BY_SRC[src] || "home";
        for (var p = 0; p < sidePanels.length; p++) {
            var panel = sidePanels[p];
            panel.classList.toggle("is-active", panel.getAttribute("data-panel") === key);
        }
    }

    var stationNav = document.querySelector('[aria-label="Ship stations"]');
    if (stationNav) {
        stationNav.addEventListener("click", function (e) {
            var t = e.target.closest(".ship-station");
            if (t && stationNav.contains(t)) setStation(t);
        });
    }

    var homeQuick = document.getElementById("ship-home-btn");
    if (homeQuick && homeStation) {
        homeQuick.addEventListener("click", function () {
            setStation(homeStation);
        });
    }

    var registryQuick = document.getElementById("ship-registry-btn");
    if (registryQuick && authStation) {
        registryQuick.addEventListener("click", function () {
            setStation(authStation);
        });
    }

    var navLeft = document.getElementById("ship-nav-left");
    var navRight = document.getElementById("ship-nav-right");

    function leaveAuthStation(delta) {
        if (authIndex < 0 || !authStation || !authStation.classList.contains("is-active")) return false;
        if (delta < 0) {
            for (var k = authIndex - 1; k >= 0; k--) {
                if (stations[k] !== authStation) {
                    setStation(stations[k]);
                    return true;
                }
            }
            return true;
        }
        for (var k2 = authIndex + 1; k2 < stations.length; k2++) {
            if (stations[k2] !== authStation) {
                setStation(stations[k2]);
                return true;
            }
        }
        return true;
    }

    function goDelta(delta) {
        if (leaveAuthStation(delta)) return;
        var idx = activeArrowIndex;
        if (idx < 0) return;
        var next = idx + delta;
        if (next < 0 || next >= navStations.length) return;
        setStation(navStations[next]);
    }

    function updateEdgeButtons() {
        if (authStation && authStation.classList.contains("is-active")) {
            if (navLeft) navLeft.hidden = false;
            if (navRight) navRight.hidden = false;
            return;
        }
        var idx = activeArrowIndex;
        if (idx < 0) return;
        if (navLeft) navLeft.hidden = idx <= 0;
        if (navRight) navRight.hidden = idx >= navStations.length - 1;
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
        if (e.key === "ArrowLeft") {
            goDelta(-1);
        } else if (e.key === "ArrowRight") {
            goDelta(1);
        }
    });

    updateEdgeButtons();
    updateSidePanel("home.html");

    if (clockEl) {
        var t0 = Date.now();
        var lastClock = "";
        function pad2(n) {
            return n < 10 ? "0" + n : String(n);
        }
        function tick() {
            var s = ((Date.now() - t0) / 1000) | 0;
            var line =
                pad2((s / 3600) | 0) +
                ":" +
                pad2(((s % 3600) / 60) | 0) +
                ":" +
                pad2(s % 60) +
                " MET";
            if (line !== lastClock) {
                lastClock = line;
                clockEl.textContent = line;
            }
        }
        tick();
        setInterval(tick, 1000);
    }
})();
