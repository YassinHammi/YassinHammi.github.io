(function () {
    "use strict";

    var KEY = "shipTheme";

    function normalize(theme) {
        return theme === "light" ? "light" : "dark";
    }

    function apply(theme) {
        var t = normalize(theme);
        document.documentElement.setAttribute("data-theme", t);
        if (document.body) {
            document.body.setAttribute("data-theme", t);
        }
    }

    var stored = null;
    try {
        stored = localStorage.getItem(KEY);
    } catch (e) {
        stored = null;
    }
    apply(stored || "dark");

    window.addEventListener("message", function (event) {
        var data = event.data;
        if (!data || data.type !== "ship-theme") return;
        var t = normalize(data.theme);
        apply(t);
        try {
            localStorage.setItem(KEY, t);
        } catch (e) {
            // Storage may be unavailable; applying theme is enough.
        }
    });
})();
