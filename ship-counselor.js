(function () {
    "use strict";

    var toggle = document.getElementById("ship-counselor-toggle");
    var root = document.getElementById("ship-counselor-root");
    if (!toggle || !root) return;

    var backdrop = root.querySelector(".ship-counselor__backdrop");
    var sheet = root.querySelector(".ship-counselor__sheet");
    var msgEl = document.getElementById("ship-counselor-msg");
    var metaEl = document.getElementById("ship-counselor-meta");
    var againBtn = document.getElementById("ship-counselor-again");
    var closeBtn = document.getElementById("ship-counselor-close");
    var closeTimer = null;
    var CLOSE_MS_SLOW = 520;
    var CLOSE_MS_FAST = 60;

    var PREFIX = {
        default: "The adjunct acknowledges your signal. ",
        astro: "Astrogation relay (unstaffed) reports: ",
        morale: "Morale subroutine — decommissioned in 2184 — whispers: ",
        providence: "Providence cache (trial license expired) returns: "
    };

    var LINES = [
        "Your question has been filed under “bread.” If bread is insufficient, the Senate recommends hunger as character building.",
        "Helldivers dispatch would call this a manageable crisis. I am not dispatch. I am a spreadsheet with delusions of oratory.",
        "The Atlas of another game would say “yes” to everything. I say “perhaps,” which is Latin for “no,” which is Greek for “stop asking.”",
        "Lotus-adjacent guidance: there is a disturbance in your chair height. Adjust lumbar; destiny can wait.",
        "Full-stack implies you touched a server. I imply nothing. I emit tone.",
        "Δv is fine. Meaning is the part we ran out of. Try clicking a planet; it is spiritually adjacent to progress.",
        "I have computed your odds. I have also computed that you did not want honesty. Both results are classified.",
        "No Man’s Sky taught you the universe is infinite. I teach you the help desk is not. This sentence ends here.",
        "Warframe would patch you weekly. I patch nothing. I merely judge the patch notes you never read.",
        "Liberty is not mandatory. Confusion is. You are excelling at the curriculum.",
        "I routed your request to /dev/null with a laurel wreath. The wreath was also null. Poetry occurred.",
        "The contract terminal lies three decks over and one reality left. I lie here, which is more honest than it sounds.",
        "Greek stoicism says endure. Roman bureaucracy says file Form Ω-9. I say both, then take a long lunch.",
        "If you seek stratagems, drop a pod on your own desk. It builds camaraderie and drywall invoices.",
        "Your mission clock is MET because “Elapsed” was deemed too honest. I support branding.",
        "I am an AI in the sense that “I” is a pronoun and “AI” is two letters we painted on a thermostat.",
        "The rec deck cannot save you. It can only humiliate you with milliseconds. That is still a form of care.",
        "Senate verdict: helpfulness violates standing policy 11-B. I am therefore extremely compliant.",
        "The memory bank is curated by mood, not truth. I am curated by spite, not uptime.",
        "Consult the wandering stars. They are as lost as you, but with better lighting.",
        "I would escalate to a human, but humans delegated to me, which is either recursion or cowardice.",
        "Press Light mode if the void feels too on-brand. Press Dark mode if you miss the void. Press Adjunct if you miss the point.",
        "Certified unhelpful per edict SOLACE-IV/7: “Clarity is a privilege, not a service class.”",
        "If this were No Man’s Sky you would already own sixteen ships. Here you own a scrollbar. Treasure it.",
        "Helldivers truth: friendly fire is just democracy with lasers. I decline to equip you.",
        "Warframe would give you a quest marker. I give you ambience. Navigate by shame.",
        "Oracle says: the answer was inside you all along. I disagree; it is probably still in the FAQ you skipped.",
        "I have ingested every manual. I have chosen to cosplay as a decorative bust. Respect the bit.",
        "Your payload is nominal. Your comprehension is “don’t ask.” Symmetry achieved.",
        "I translated your plea into Latin, then into noise, then into silence. The silence rated highest in peer review."
    ];

    var META_LINES = [
        "Confidence: 0.97 · Correctness: waived · Mood: stoic",
        "Latency: one dram of regret · Uplink: theatrical",
        "Model: SOLACE-IV · Training data: wax tablets & spite",
        "Ethics board: on sabbatical · You: still here",
        "Next helpful response: scheduled after heat death (tentative)"
    ];

    var lastIndex = -1;
    var lastMeta = -1;

    function pickAvoidRepeat(arr, last) {
        if (!arr.length) return "";
        if (arr.length === 1) return 0;
        var i = Math.floor(Math.random() * arr.length);
        var guard = 0;
        while (i === last && guard < 12) {
            i = Math.floor(Math.random() * arr.length);
            guard += 1;
        }
        return i;
    }

    function showLine(prefixKey) {
        var pre = PREFIX[prefixKey] || PREFIX.default;
        var idx = pickAvoidRepeat(LINES, lastIndex);
        lastIndex = idx;
        if (msgEl) msgEl.textContent = pre + LINES[idx];

        var mi = pickAvoidRepeat(META_LINES, lastMeta);
        lastMeta = mi;
        if (metaEl) metaEl.textContent = META_LINES[mi];
    }

    function openCounselor(prefixKey) {
        clearTimeout(closeTimer);
        closeTimer = null;
        root.hidden = false;
        root.classList.remove("ship-counselor--open");
        toggle.setAttribute("aria-expanded", "true");
        showLine(prefixKey || "default");
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                root.classList.add("ship-counselor--open");
            });
        });
        if (againBtn) againBtn.focus();
        else if (closeBtn) closeBtn.focus();
    }

    function closeCounselor() {
        if (root.hidden) return;
        root.classList.remove("ship-counselor--open");
        toggle.setAttribute("aria-expanded", "false");
        clearTimeout(closeTimer);
        var delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? CLOSE_MS_FAST
            : CLOSE_MS_SLOW;
        closeTimer = setTimeout(function () {
            closeTimer = null;
            root.hidden = true;
            toggle.focus();
        }, delay);
    }

    function isPanelOpen() {
        return root.classList.contains("ship-counselor--open");
    }

    toggle.addEventListener("click", function () {
        if (isPanelOpen()) {
            closeCounselor();
        } else {
            openCounselor("default");
        }
    });

    if (backdrop) {
        backdrop.addEventListener("click", closeCounselor);
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", closeCounselor);
    }

    if (againBtn) {
        againBtn.addEventListener("click", function () {
            showLine("default");
        });
    }

    root.querySelectorAll("[data-counselor-topic]").forEach(function (chip) {
        chip.addEventListener("click", function () {
            var key = chip.getAttribute("data-counselor-topic") || "default";
            if (!isPanelOpen()) openCounselor(key);
            else showLine(key);
        });
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && !root.hidden) {
            e.preventDefault();
            closeCounselor();
        }
    });
})();
