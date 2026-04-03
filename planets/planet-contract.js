(function () {
    "use strict";

    var storedTheme = null;
    try {
        storedTheme = localStorage.getItem("shipTheme");
    } catch (e) {
        storedTheme = null;
    }
    var normalizedTheme = storedTheme === "light" ? "light" : "dark";
    document.body.setAttribute("data-theme", normalizedTheme);
    document.documentElement.setAttribute("data-theme", normalizedTheme);

    window.addEventListener("message", function (event) {
        var data = event.data;
        if (!data || data.type !== "ship-theme") return;
        var t = data.theme === "light" ? "light" : "dark";
        document.body.setAttribute("data-theme", t);
        document.documentElement.setAttribute("data-theme", t);
        try {
            localStorage.setItem("shipTheme", t);
        } catch (e) {
            // Ignore storage errors.
        }
    });

    var planet = document.body.getAttribute("data-planet");
    if (!planet) return;

    var fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href =
        "https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap";
    document.head.appendChild(fontLink);

    var SPHERE_BG = {
        mercury:
            "radial-gradient(circle at 32% 28%, #f0ece4 0%, #c8c2b4 35%, #8a8278 70%, #4a4540 100%)",
        venus:
            "radial-gradient(circle at 30% 30%, #f8f2d4 0%, #e0c878 40%, #c9a85c 72%, #8a7038 100%)",
        earth:
            "radial-gradient(circle at 35% 30%, #6eb8d4 0%, #3d7a5c 38%, #2a4a6a 65%, #1a3048 100%)",
        mars:
            "radial-gradient(circle at 35% 32%, #e8a090 0%, #c45c40 45%, #8a3828 78%, #4a1810 100%)",
        jupiter:
            "linear-gradient(180deg, #c4a882 0%, #a87850 18%, #d4c4a8 35%, #8a6040 52%, #e8d8c0 68%, #6a4830 85%, #a09078 100%)",
        saturn:
            "radial-gradient(circle at 40% 35%, #f0e4c8 0%, #d8c090 45%, #a89068 78%, #6a5840 100%)",
        uranus:
            "radial-gradient(circle at 35% 30%, #d8f4f8 0%, #88c8d8 42%, #4890a8 75%, #285868 100%)",
        neptune:
            "radial-gradient(circle at 32% 28%, #a8c8f0 0%, #5080c0 45%, #304878 78%, #182838 100%)"
    };

    var LABELS = {
        mercury: "Mercury",
        venus: "Venus",
        earth: "Earth",
        mars: "Mars",
        jupiter: "Jupiter",
        saturn: "Saturn",
        uranus: "Uranus",
        neptune: "Neptune"
    };

    var EQUIP = {
        mercury: [
            { id: "eq-merc-1", label: "Helios-grade coronal shade (rental, non-refundable)" },
            { id: "eq-merc-2", label: "Regolith lung scrubber — “probably fine” tier" },
            { id: "eq-merc-3", label: "Emergency beacon that only works on Tuesdays" }
        ],
        venus: [
            { id: "eq-ven-1", label: "Cloud-city harness (certification pending since 1987)" },
            { id: "eq-ven-2", label: "Sulfuric acid umbrella — cosmetic, not functional" },
            { id: "eq-ven-3", label: "Crush-depth denial bracelet" }
        ],
        earth: [
            { id: "eq-ear-1", label: "Gravity loyalty pledge (verbal, notarized)" },
            { id: "eq-ear-2", label: "Nostalgia dampeners for off-world envy" },
            { id: "eq-ear-3", label: "Standard-issue procrastination field" }
        ],
        mars: [
            { id: "eq-mar-1", label: "Perchlorate breakfast substitute" },
            { id: "eq-mar-2", label: "Dust-storm optimism injector" },
            { id: "eq-mar-3", label: "Potato-based survival faith (placebo)" }
        ],
        jupiter: [
            { id: "eq-jup-1", label: "Radiation rosary (spiritual shielding only)" },
            { id: "eq-jup-2", label: "Great Red Spot souvenir cinder" },
            { id: "eq-jup-3", label: "Gas giant “solid ground” delusion kit" }
        ],
        saturn: [
            { id: "eq-sat-1", label: "Ring-particle dental guard" },
            { id: "eq-sat-2", label: "Low-density ego flotation device" },
            { id: "eq-sat-3", label: "Titan methane scent sampler (do not inhale)" }
        ],
        uranus: [
            { id: "eq-ura-1", label: "Axial tilt ankle stabilizers" },
            { id: "eq-ura-2", label: "42-year winter mood license" },
            { id: "eq-ura-3", label: "Cyan despair filter lenses" }
        ],
        neptune: [
            { id: "eq-nep-1", label: "Supersonic windbreaker (marketing name only)" },
            { id: "eq-nep-2", label: "Dark-storm souvenir void" },
            { id: "eq-nep-3", label: "Light-lag loneliness amplifier" }
        ]
    };

    var name = LABELS[planet] || planet;

    var REVIEWS = [
        {
            who: "Cmdr. Ylla V. · verified voidfarer",
            stars: 5,
            text: "Lost three toes to frostbite. Would misread the fine print again. ★ experience."
        },
        {
            who: "anonymous · redacted by legal",
            stars: 5,
            text: "They promised ‘exposure to the infinite.’ Got exposure to invoices. Still euphoric."
        },
        {
            who: "Rico D. · hobbyist corpse",
            stars: 4,
            text: "Snack situation mid-transit was predatory. Views of nothing were Instagrammable."
        },
        {
            who: "Unit 734-B · former intern",
            stars: 5,
            text: "My soul is now a deductible line item. Onboarding was seamless."
        },
        {
            who: "Mara S. · cryo nap enthusiast",
            stars: 5,
            text: "Woke up in a different century and a different debt bracket. Worth it for the story."
        },
        {
            who: "Old Ben · cantina regular",
            stars: 3,
            text: "Narrator lied about the odds. Contract did not. Refreshing honesty in paragraph 900."
        },
        {
            who: "xX_voidlord_Xx",
            stars: 5,
            text: "signed without reading. mom found out. both of us now shareholders in regret llc"
        },
        {
            who: "Dr. H. P. · philosophy dropout",
            stars: 5,
            text: "Existential dread included at no extra charge. Terms said ‘metaphysical fees may apply.’ They did."
        },
        {
            who: "L. van O. · ear replaced with dial",
            stars: 4,
            text: "Customer service hold music was just vacuum. Really set the mood."
        },
        {
            who: "P. ‘Stubs’ K.",
            stars: 5,
            text: "Arbitration on Triton was chilly but fair. Broom closet had character."
        },
        {
            who: "Hivemind fragment #404",
            stars: 5,
            text: "We / us / them enjoyed the waiver experience. Will assimilate referral link."
        },
        {
            who: "Juno (not the moon)",
            stars: 2,
            text: "Two stars because they only took one kidney when the brochure implied two."
        },
        {
            who: "Terry from accounting",
            stars: 5,
            text: "Finally a mission where my spreadsheet trauma is considered an asset."
        },
        {
            who: "ghost_writer_Ω",
            stars: 5,
            text: "The hidden clauses glow if you squint. Aesthetic."
        },
        {
            who: "Citizen Δ-12",
            stars: 5,
            text: "Brushed against Art. 5 by accident. Felt spiritually invoiced. 10/10."
        }
    ];

    var PLANET_QUIPS = {
        mercury: "So hot right now (literally).",
        venus: "Cloud nine, pressure eleven.",
        earth: "Retrograde nostalgia trip.",
        mars: "Rust never sleeps, neither do we.",
        jupiter: "Big gas, bigger dreams.",
        saturn: "Rings included in mental image only.",
        uranus: "Tilt-certified itineraries.",
        neptune: "Windy with a chance of paperwork."
    };

    var HYPE_BLOCKS = [
        { kicker: "Live counter", stat: "∞+", label: "souls in queue" },
        { kicker: "Satisfaction", stat: "98.2%", label: "would sign again*" },
        { kicker: "As seen on", stat: "HOLO", label: "Net (alleged)" },
        { kicker: "Award", stat: "Ω", label: "Most opaque PDF 2187" }
    ];

    function esc(s) {
        var d = document.createElement("div");
        d.textContent = s;
        return d.innerHTML;
    }

    function shuffle(a) {
        var i = a.length;
        var j;
        var t;
        while (i > 1) {
            j = Math.floor(Math.random() * i);
            i -= 1;
            t = a[i];
            a[i] = a[j];
            a[j] = t;
        }
        return a;
    }

    function starsHtml(n) {
        var s = "";
        var i;
        for (i = 0; i < 5; i += 1) {
            s += i < n ? "★" : "☆";
        }
        return s;
    }

    function buildReviewCard(r) {
        return (
            '<blockquote class="contract-review">' +
            '<div class="contract-review__stars" aria-hidden="true">' +
            starsHtml(r.stars) +
            "</div>" +
            "<p class=\"contract-review__text\">" +
            esc(r.text) +
            "</p>" +
            '<footer class="contract-review__who">' +
            esc(r.who) +
            "</footer>" +
            "</blockquote>"
        );
    }

    function buildLeftPromo(planetName) {
        var quip = PLANET_QUIPS[planet] || "The void welcomes spreadsheets.";
        var picks = shuffle(REVIEWS.slice()).slice(0, 4);
        var cards = picks.map(buildReviewCard).join("");
        return (
            '<div class="contract-promo__head contract-no-print">' +
            '<span class="contract-promo__tag">Traveler tales</span>' +
            "<h3 class=\"contract-promo__h\">They chose " +
            esc(planetName) +
            ". So could you.</h3>" +
            '<p class="contract-promo__quip">' +
            esc(quip) +
            "</p>" +
            "</div>" +
            '<div class="contract-promo__print-head contract-print-only">' +
            "<strong>AstraMiners™ endorsements</strong> — excerpt for applicant file" +
            "</div>" +
            '<div class="contract-review-stack">' +
            cards +
            "</div>"
        );
    }

    function buildRightPromo(planetName) {
        var shuffled = shuffle(HYPE_BLOCKS.slice());
        var b1 = shuffled[0];
        var b2 = shuffled[1];
        var b3 = shuffled[2];
        return (
            '<div class="contract-seal contract-no-print" aria-hidden="true">' +
            '<span class="contract-seal__ring">Ω</span>' +
            '<span class="contract-seal__txt">certified<br>opaque</span>' +
            "</div>" +
            '<div class="contract-stat-grid">' +
            '<div class="contract-stat">' +
            '<span class="contract-stat__k">' +
            esc(b1.kicker) +
            "</span>" +
            '<span class="contract-stat__n">' +
            esc(b1.stat) +
            "</span>" +
            '<span class="contract-stat__l">' +
            esc(b1.label) +
            "</span>" +
            "</div>" +
            '<div class="contract-stat">' +
            '<span class="contract-stat__k">' +
            esc(b2.kicker) +
            "</span>" +
            '<span class="contract-stat__n">' +
            esc(b2.stat) +
            "</span>" +
            '<span class="contract-stat__l">' +
            esc(b2.label) +
            "</span>" +
            "</div>" +
            '<div class="contract-stat">' +
            '<span class="contract-stat__k">' +
            esc(b3.kicker) +
            "</span>" +
            '<span class="contract-stat__n">' +
            esc(b3.stat) +
            "</span>" +
            '<span class="contract-stat__l">' +
            esc(b3.label) +
            "</span>" +
            "</div>" +
            "</div>" +
            '<p class="contract-promo__fine contract-no-print">*Self-reported by entities that may no longer exist.</p>' +
            '<p class="contract-ticker contract-no-print" aria-hidden="true">' +
            "sign now · limited regret · " +
            esc(planetName.toUpperCase()) +
            " waits · berths decay in real time · sign now · the void loves paperwork · " +
            esc(planetName.toUpperCase()) +
            "</p>" +
            '<p class="contract-print-only contract-print-destination">Destination dossier: <strong>' +
            esc(planetName) +
            "</strong></p>"
        );
    }

    var tease = document.createElement("button");
    tease.type = "button";
    tease.className = "contract-tease";
    tease.setAttribute("aria-haspopup", "dialog");
    tease.innerHTML =
        '<span class="contract-tease-blink">NEW</span> ' +
        "<span>Wanna go to <strong>" +
        esc(name) +
        "</strong>? · Limited berths · Tap to sign</span>";

    var modal = document.createElement("div");
    modal.className = "contract-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "contract-title");
    modal.hidden = true;

    var equipList = EQUIP[planet] || EQUIP.mercury;
    var equipHtml = equipList
        .map(function (item) {
            return (
                '<label class="contract-check">' +
                '<input type="checkbox" name="equipment" value="' +
                esc(item.id) +
                '"> ' +
                "<span>" +
                esc(item.label) +
                "</span></label>"
            );
        })
        .join("");

    var sphereBg = SPHERE_BG[planet] || SPHERE_BG.mercury;
    var planetWrapClass =
        "contract-planet-wrap" + (planet === "saturn" ? " contract-planet-wrap--saturn" : "");

    var fieldsHtml =
        '<label class="contract-line">' +
        '<span class="contract-line__label">Legal name</span>' +
        '<input type="text" name="legal_name" class="contract-line__input" autocomplete="name" required placeholder="As on your soon-invalid passport">' +
        "</label>" +
        '<label class="contract-line">' +
        '<span class="contract-line__label">Signal address (email)</span>' +
        '<input type="email" name="email" class="contract-line__input" autocomplete="email" required placeholder="Invoices &amp; subpoenas">' +
        "</label>" +
        '<label class="contract-line">' +
        '<span class="contract-line__label">Emergency next-of-kin</span>' +
        '<input type="text" name="next_of_kin" class="contract-line__input" required placeholder="Inherits your debt">' +
        "</label>" +
        '<label class="contract-line">' +
        '<span class="contract-line__label">Blood type &amp; allergies</span>' +
        '<input type="text" name="bio" class="contract-line__input" placeholder="We sell this to insurers">' +
        "</label>";

    modal.innerHTML =
        '<div class="contract-modal__backdrop contract-no-print" data-close aria-hidden="true"></div>' +
        '<div class="contract-modal__layout" id="contract-print-root">' +
        '<aside class="contract-promo contract-promo--left" aria-label="Traveler reviews">' +
        buildLeftPromo(name) +
        "</aside>" +
        '<div class="contract-modal__panel contract-paper">' +
        '<button type="button" class="contract-modal__x contract-no-print" data-close aria-label="Close">&times;</button>' +
        '<button type="button" class="contract-print-btn contract-no-print" id="contract-print-btn" title="Print this contract">Print</button>' +
        '<div class="contract-paper__columns">' +
        '<aside class="contract-paper__aside" aria-hidden="true">' +
        '<div class="' +
        planetWrapClass +
        '">' +
        '<div class="contract-planet-sphere" style="background:' +
        sphereBg +
        '"></div>' +
        "</div>" +
        '<p class="contract-aside-destination">Destination</p>' +
        '<p class="contract-aside-name">' +
        esc(name) +
        "</p>" +
        '<p class="contract-aside-ref">File · ' +
        esc(planet.toUpperCase()) +
        " · Ω</p>" +
        '<div class="contract-paper__fibers" aria-hidden="true"></div>' +
        "</aside>" +
        '<div class="contract-paper__main">' +
        '<div class="contract-modal__ad-strip">AstraMiners™ · Void HR · Ref. ' +
        esc(planet.toUpperCase()) +
        "-Ω</div>" +
        '<h2 id="contract-title" class="contract-modal__title">Pre-departure undertaking</h2>' +
        '<p class="contract-modal__lede">You are one line away from destiny. Or debt. Press <kbd>Enter</kbd> after each field to “sign” in ink.</p>' +
        '<form class="contract-form" id="planet-contract-form">' +
        '<fieldset class="contract-fieldset contract-fieldset--applicant">' +
        "<legend>Applicant — write clearly, regret later</legend>" +
        fieldsHtml +
        "</fieldset>" +
        '<fieldset class="contract-fieldset">' +
        "<legend>Equipment manifest</legend>" +
        equipHtml +
        "</fieldset>" +
        '<fieldset class="contract-fieldset">' +
        "<legend>Binding clauses (scroll)</legend>" +
        '<div class="contract-terms" tabindex="0">' +
        "<p><strong>Art. 1.</strong> The Operator may reroute, abandon, or misplace the Applicant without notice. Comfort is not a metric we track.</p>" +
        "<p><strong>Art. 2.</strong> By progressing past this line you certify that you are of sound mind or sufficiently desperate.</p>" +
        "<p><strong>Art. 3.</strong> Promotional holo-ads may be etched on the inside of your helmet visor. Opt-out costs extra air.</p>" +
        '<p class="terms-muted">Art. 4. Liability for dismemberment, enlightenment, or spontaneous poetry is capped at zero (0) credits.</p>' +
        '<p class="terms-weasel">Art. 4 bis. The Applicant further agrees that any soul, essence, or quantum duplicate encountered in transit becomes co-owned by the Operator and its unnamed subsidiaries.</p>' +
        '<p class="terms-nearly-hidden">Art. 5 (Ω). I acknowledge that nominal survival statistics are decorative. I condemn sacrificing my life for this mission in the ceremonial sense required by Martian maritime precedent, and I assign salvage rights over my remains, organs, and social media to AstraMiners Void Holdings.</p>' +
        '<p class="terms-nearly-hidden">Art. 6. I waive the right to sue in any court that still has oxygen. Arbitration shall occur in a broom closet on Triton.</p>' +
        '<p class="terms-microscopic">Art. 7. Hidden clause: should I vocalize regret, I consent to memory redaction via loud noise. I accept that “voluntary” includes anything I sign while sleep-deprived. I ratify the sacrifice of my life for the mission if marketing later rebrands it as “heroic narrative.”</p>' +
        '<p class="terms-muted"><strong>Art. 8 (visible).</strong> I agree to receive 4–900 promotional communiqués per lunar cycle.</p>' +
        "</div>" +
        '<label class="contract-check contract-check--heavy">' +
        '<input type="checkbox" name="accept_terms" required> ' +
        "<span>I have read and accept the Astral Charter, all schedules, and whatever was too small to see</span></label>" +
        '<label class="contract-check">' +
        '<input type="checkbox" name="accept_organs" required> ' +
        "<span>I consent to post-mortem asset liquidation per Schedule Ω (includes “optional” organ routing)</span></label>" +
        "</fieldset>" +
        '<p class="contract-fine-fraud">This form does not transmit data. It is a museum piece. Your dignity left with Art. 5 (Ω).</p>' +
        '<button type="submit" class="contract-submit contract-no-print">Seal the pact (goes nowhere)</button>' +
        '<p class="contract-result" id="contract-result" hidden></p>' +
        "</form>" +
        "</div>" +
        "</div>" +
        '<aside class="contract-promo contract-promo--right" aria-label="Trust and urgency">' +
        buildRightPromo(name) +
        "</aside>" +
        "</div>";

    document.body.appendChild(tease);
    document.body.appendChild(modal);

    var form = modal.querySelector("#planet-contract-form");
    var resultEl = modal.querySelector("#contract-result");
    var promoLeft = modal.querySelector(".contract-promo--left");
    var promoRight = modal.querySelector(".contract-promo--right");

    function refreshPromo() {
        if (promoLeft) promoLeft.innerHTML = buildLeftPromo(name);
        if (promoRight) promoRight.innerHTML = buildRightPromo(name);
    }

    var layoutEl = modal.querySelector(".contract-modal__layout");
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function focusFirstField() {
        var first = modal.querySelector(".contract-line__input");
        if (first) first.focus();
    }

    function openModal() {
        refreshPromo();
        modal.hidden = false;
        document.body.classList.add("contract-modal-open");

        if (reduceMotion.matches) {
            modal.classList.add("contract-modal--open");
            focusFirstField();
            return;
        }

        modal.classList.remove("contract-modal--open");
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                modal.classList.add("contract-modal--open");
            });
        });

        window.setTimeout(focusFirstField, 340);
    }

    function closeModal() {
        if (modal.hidden) return;

        function finalizeClose() {
            if (modal.hidden) return;
            modal.hidden = true;
            modal.classList.remove("contract-modal--open");
            document.body.classList.remove("contract-modal-open");
            tease.focus();
        }

        if (reduceMotion.matches || !modal.classList.contains("contract-modal--open")) {
            finalizeClose();
            return;
        }

        modal.classList.remove("contract-modal--open");

        var settled = false;
        function done() {
            if (settled) return;
            settled = true;
            finalizeClose();
        }

        if (layoutEl) {
            layoutEl.addEventListener(
                "transitionend",
                function onLayoutTransitionEnd(e) {
                    if (e.target !== layoutEl) return;
                    if (e.propertyName !== "transform") return;
                    layoutEl.removeEventListener("transitionend", onLayoutTransitionEnd);
                    done();
                }
            );
        }

        window.setTimeout(done, 450);
    }

    tease.addEventListener("click", openModal);
    modal.addEventListener("click", function (e) {
        if (e.target.hasAttribute("data-close")) closeModal();
    });

    var printBtn = modal.querySelector("#contract-print-btn");
    if (printBtn) {
        printBtn.addEventListener("click", function () {
            window.print();
        });
    }

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && !modal.hidden) closeModal();
    });

    form.addEventListener("keydown", function (e) {
        var t = e.target;
        if (e.key !== "Enter" || !t || t.tagName !== "INPUT") return;
        var typ = t.type;
        if (typ !== "text" && typ !== "email") return;
        e.preventDefault();
        if (t.value.trim()) {
            t.classList.add("contract-input--inked");
        }
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        resultEl.hidden = false;
        resultEl.textContent =
            "Transmission logged locally only. A representative will never contact you. Your signature dissolves in vacuum.";
        form.querySelector(".contract-submit").disabled = true;
    });
})();
