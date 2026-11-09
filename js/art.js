/**
 * Operação QueryZero - Arte vetorial: personagens e cenários (SVG gerado por código)
 * O elenco é diverso em raça, gênero e idade; as expressões são trocadas fala a fala.
 */

const Art = (() => {
    function rng(seed) {
        let a = seed >>> 0;
        return () => {
            a = (a + 0x6D2B79F5) | 0;
            let t = Math.imul(a ^ (a >>> 15), 1 | a);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    /* ------------------------------------------------------------------
       PERSONAGENS
       ------------------------------------------------------------------ */
    const LOOKS = {
        maya: {
            skin: "#6a3d28", shade: "#52301f", lip: "#8c3d3a", mouth: "#8c3d3a", eye: "#1c120d",
            hair: "#17110f", hairHi: "#35291f", torso: "blazer", o: "#27384f", o2: "#38bdf8",
            hairStyle: "braidsBun", acc: ["earringGold"]
        },
        kenji: {
            skin: "#e6c19c", shade: "#cba27d", lip: "#b5655a", mouth: "#b5655a", eye: "#1a120e",
            hair: "#15110f", hairHi: "#2a2420", torso: "hoodie", o: "#3f2e6b", o2: "#a78bfa",
            hairStyle: "messy", acc: ["glasses"]
        },
        luna: {
            skin: "#b8784f", shade: "#9a6240", lip: "#8a4338", mouth: "#8a4338", eye: "#1a0f0a",
            hair: "#0e0a09", hairHi: "#2a1f1b", torso: "jacket", o: "#0f766e", o2: "#fbbf24",
            hairStyle: "longStraight", acc: ["headband", "earringFeather"]
        },
        rafa: {
            skin: "#4b2c20", shade: "#3a2118", lip: "#7a3a33", mouth: "#a8574d", beard: true, eye: "#120a07",
            hair: "#0b0807", hairHi: "#1d1512", torso: "hoodie", o: "#b45309", o2: "#fde68a",
            hairStyle: "buzzBeard", acc: ["headphones"]
        },
        ivy: {
            skin: "#f1d3bf", shade: "#d9b49c", lip: "#c0646a", mouth: "#c0646a", eye: "#2f6b4f",
            hair: "#a78bfa", hairHi: "#c4b5fd", torso: "jacket", o: "#334155", o2: "#f43f5e",
            hairStyle: "pixie", acc: ["earringsMulti", "freckles"]
        },
        valente: {
            skin: "#efcab0", shade: "#d4a98b", lip: "#b0615b", mouth: "#b0615b", eye: "#2a1b12",
            hair: "#9ca3af", hairHi: "#d1d5db", torso: "suit", o: "#111827", o2: "#dc2626",
            hairStyle: "slick", acc: ["wrinkles"]
        }
    };

    const BROWS = {
        neutral:   ["M86 103 Q100 98 113 102", "M127 102 Q140 98 154 103"],
        smile:     ["M86 101 Q100 95 113 100", "M127 100 Q140 95 154 101"],
        worried:   ["M86 106 Q100 103 113 96", "M127 96 Q140 103 154 106"],
        sad:       ["M86 106 Q100 103 113 96", "M127 96 Q140 103 154 106"],
        serious:   ["M86 99 Q100 100 113 106", "M127 106 Q140 100 154 99"],
        angry:     ["M86 99 Q100 100 113 107", "M127 107 Q140 100 154 99"],
        surprised: ["M86 94 Q100 87 113 93", "M127 93 Q140 87 154 94"]
    };

    function mouthFor(mood, color, beard) {
        switch (mood) {
            case "smile":
                if (beard) {
                    return `<path d="M104 150 Q120 169 136 150 Q120 157 104 150Z" fill="#f4f1ec" stroke="${color}" stroke-width="2.6" stroke-linejoin="round"/>`;
                }
                return `<path d="M104 149 Q120 168 136 149" fill="none" stroke="${color}" stroke-width="3.2" stroke-linecap="round"/>`;
            case "smirk":
                return `<path d="M107 154 Q124 161 136 148" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round"/>`;
            case "worried":
            case "sad":
                return `<path d="M107 159 Q120 149 133 159" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round"/>`;
            case "surprised":
                return `<ellipse cx="120" cy="156" rx="6" ry="8.5" fill="#3a1717"/>`;
            case "serious":
            case "angry":
                return `<path d="M108 155 L132 155" fill="none" stroke="${color}" stroke-width="3.2" stroke-linecap="round"/>`;
            default:
                return `<path d="M107 153 Q120 157 133 153" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round"/>`;
        }
    }

    function eyesFor(look, mood) {
        const ry = { surprised: 9, smile: 4.6, serious: 5.4, angry: 5, neutral: 6.4, worried: 6.4, sad: 6, smirk: 5.6 }[mood] || 6.4;
        const iris = mood === "surprised" ? 4.2 : 4.6;
        const eye = (cx) => `
            <ellipse cx="${cx}" cy="117" rx="9.5" ry="${ry}" fill="#f8fafc"/>
            <circle cx="${cx}" cy="117.5" r="${iris}" fill="${look.eye}"/>
            <circle cx="${cx + 1.6}" cy="115.6" r="1.4" fill="#fff"/>
            <path d="M${cx - 10} ${117 - ry * 0.6} Q${cx} ${117 - ry - 1.6} ${cx + 10} ${117 - ry * 0.6}" fill="none" stroke="${look.shade}" stroke-width="2"/>`;
        return eye(99) + eye(141);
    }

    function hairParts(look) {
        const h = look.hair, hi = look.hairHi;
        let back = "", front = "";
        switch (look.hairStyle) {
            case "braidsBun": {
                const left = [[72, 142], [66, 162], [63, 184], [61, 206], [59, 228], [57, 250]];
                const braid = (pts, mirror) => pts.map(([x, y]) => {
                    const px = mirror ? 240 - x : x;
                    return `<ellipse cx="${px}" cy="${y}" rx="9" ry="8" fill="${h}" stroke="${hi}" stroke-width="1.6"/>`;
                }).join("");
                back = `<circle cx="120" cy="47" r="26" fill="${h}"/>
                        <path d="M98 40 Q120 26 142 40" fill="none" stroke="${hi}" stroke-width="2"/>
                        ${braid(left, false)}${braid(left, true)}`;
                front = `<path d="M69 118 C65 66 94 53 120 53 C146 53 175 66 171 118 C165 92 146 80 120 80 C94 80 75 92 69 118Z" fill="${h}"/>
                         <path d="M82 96 Q120 58 158 96 M92 92 Q120 66 148 92 M104 88 Q120 72 136 88" fill="none" stroke="${hi}" stroke-width="2" opacity=".8"/>`;
                break;
            }
            case "messy":
                front = `<path d="M68 118 C62 66 92 50 120 52 C150 50 178 66 172 118 C168 100 160 90 150 92 L142 76 L130 94 L120 74 L110 94 L98 78 L92 96 C80 94 72 104 68 118Z" fill="${h}"/>
                         <path d="M100 66 L108 82 M134 64 L128 82" stroke="${hi}" stroke-width="2"/>`;
                break;
            case "longStraight":
                back = `<path d="M63 114 C45 176 47 238 72 258 L168 258 C193 238 195 176 177 114 C177 60 63 60 63 114Z" fill="${h}"/>`;
                front = `<path d="M69 118 C64 68 98 54 120 56 C142 54 176 68 171 118 C166 94 150 80 120 78 C90 80 74 94 69 118Z" fill="${h}"/>
                         <path d="M120 56 L120 78" stroke="${hi}" stroke-width="2"/>
                         <path d="M74 150 C70 190 76 220 88 244 M166 150 C170 190 164 220 152 244" stroke="${hi}" stroke-width="2" fill="none" opacity=".6"/>`;
                break;
            case "buzzBeard":
                front = `<path d="M71 112 C68 70 96 58 120 58 C144 58 172 70 169 112 C160 90 144 82 120 82 C96 82 80 90 71 112Z" fill="${h}"/>
                         <path d="M72 132 C72 192 98 208 120 208 C142 208 168 192 168 132 C160 152 145 160 120 160 C95 160 80 152 72 132Z" fill="${h}"/>
                         <path d="M98 148 Q120 142 142 148 Q120 154 98 148Z" fill="${h}"/>`;
                break;
            case "pixie":
                front = `<path d="M68 118 C58 70 92 50 124 52 C158 54 180 76 171 120 C165 100 157 92 142 90 C122 98 98 92 78 106 C73 110 70 114 68 118Z" fill="${h}"/>
                         <path d="M84 72 C110 56 150 60 168 92" fill="none" stroke="${hi}" stroke-width="3" opacity=".85"/>
                         <path d="M96 84 C118 70 144 72 160 96" fill="none" stroke="${hi}" stroke-width="2" opacity=".6"/>`;
                break;
            case "slick":
                front = `<path d="M71 110 C69 70 96 58 120 58 C146 58 171 70 169 110 C163 93 150 84 134 82 C120 86 96 84 80 96 C76 100 73 104 71 110Z" fill="${h}"/>
                         <path d="M88 76 Q120 62 152 78" fill="none" stroke="${hi}" stroke-width="2.4"/>
                         <path d="M68 120 L72 108 L74 124Z M172 120 L168 108 L166 124Z" fill="${h}"/>`;
                break;
        }
        return { back, front };
    }

    function accessory(name, look) {
        switch (name) {
            case "glasses":
                return `<g fill="rgba(56,189,248,.10)" stroke="#0b0f19" stroke-width="3">
                        <rect x="82" y="105" width="34" height="25" rx="9"/><rect x="124" y="105" width="34" height="25" rx="9"/>
                        <path d="M116 116 H124" fill="none"/><path d="M82 113 L71 111 M158 113 L169 111" fill="none"/></g>`;
            case "earringGold":
                return `<circle cx="70" cy="136" r="3.4" fill="#fbbf24"/><circle cx="170" cy="136" r="3.4" fill="#fbbf24"/>`;
            case "earringFeather":
                return `<path d="M170 134 L171 156" stroke="#fbbf24" stroke-width="1.6"/><ellipse cx="171" cy="161" rx="3.6" ry="7.5" fill="#dc2626" stroke="#fbbf24" stroke-width="1"/>`;
            case "earringsMulti":
                return `<circle cx="68" cy="119" r="2.4" fill="#e5e7eb"/><circle cx="67" cy="127" r="2.4" fill="#e5e7eb"/><circle cx="69" cy="135" r="2.8" fill="#f43f5e"/><circle cx="171" cy="132" r="2.6" fill="#e5e7eb"/>`;
            case "freckles":
                return `<g fill="#b9785c" opacity=".7"><circle cx="106" cy="134" r="1.3"/><circle cx="112" cy="138" r="1.2"/><circle cx="100" cy="138" r="1.2"/><circle cx="134" cy="134" r="1.3"/><circle cx="128" cy="138" r="1.2"/><circle cx="140" cy="138" r="1.2"/></g>`;
            case "wrinkles":
                return `<path d="M96 92 Q120 86 144 92 M100 98 Q120 94 140 98 M104 134 Q108 146 110 156 M136 134 Q132 146 130 156" fill="none" stroke="${look.shade}" stroke-width="1.6" opacity=".8"/>`;
            case "headband":
                return `<path d="M70 98 Q120 66 170 98" stroke="#dc2626" stroke-width="9" fill="none"/>
                        <path d="M79 92 Q120 64 161 92" stroke="#fbbf24" stroke-width="2" stroke-dasharray="4 6" fill="none"/>`;
            case "headphones":
                return `<path d="M65 118 C61 38 179 38 175 118" stroke="#1f2937" stroke-width="8" fill="none"/>
                        <ellipse cx="65" cy="124" rx="11" ry="18" fill="#1f2937"/><ellipse cx="175" cy="124" rx="11" ry="18" fill="#1f2937"/>
                        <ellipse cx="65" cy="124" rx="6" ry="12" fill="none" stroke="${look.o2}" stroke-width="2.4"/>
                        <ellipse cx="175" cy="124" rx="6" ry="12" fill="none" stroke="${look.o2}" stroke-width="2.4"/>`;
            default:
                return "";
        }
    }

    function torso(look) {
        const o = look.o, o2 = look.o2;
        const base = `<path d="M14 300 C14 238 58 216 120 216 C182 216 226 238 226 300Z" fill="${o}"/>`;
        switch (look.torso) {
            case "blazer":
                return base + `<path d="M104 218 L120 270 L136 218 L120 232Z" fill="#e5e7eb"/>
                    <path d="M100 218 L86 300 M140 218 L154 300" stroke="${o2}" stroke-width="3" fill="none"/>
                    <path d="M100 218 L120 270 M140 218 L120 270" stroke="#0f172a" stroke-width="2" fill="none"/>`;
            case "hoodie":
                return base + `<path d="M80 222 C88 256 152 256 160 222 C150 238 90 238 80 222Z" fill="${o2}" opacity=".9"/>
                    <path d="M108 244 L106 282 M132 244 L134 282" stroke="${o2}" stroke-width="3" stroke-linecap="round"/>`;
            case "jacket":
                return base + `<path d="M120 222 L120 300" stroke="${o2}" stroke-width="4"/>
                    <path d="M96 220 L84 252 M144 220 L156 252" stroke="${o2}" stroke-width="3" fill="none"/>
                    <path d="M92 232 Q120 252 148 232" fill="none" stroke="#0f172a" stroke-width="2" opacity=".6"/>`;
            case "suit":
                return base + `<path d="M100 220 L120 266 L140 220Z" fill="#f3f4f6"/>
                    <path d="M114 240 L126 240 L129 292 L120 300 L111 292Z" fill="${o2}"/>
                    <path d="M100 220 L86 300 M140 220 L154 300" stroke="#0b1220" stroke-width="3" fill="none"/>`;
        }
        return base;
    }

    function zero() {
        return `<svg class="char-svg" viewBox="0 0 240 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="ZERO, figura encapuzada">
            <defs><filter id="zglow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3.5"/></filter>
            <radialGradient id="zhalo" cx=".5" cy=".42" r=".6"><stop offset="0" stop-color="#38bdf8" stop-opacity=".85"/><stop offset=".6" stop-color="#a78bfa" stop-opacity=".3"/><stop offset="1" stop-color="#38bdf8" stop-opacity="0"/></radialGradient></defs>
            <ellipse cx="120" cy="140" rx="128" ry="150" fill="url(#zhalo)"/>
            <path d="M10 300 C10 230 50 205 120 205 C190 205 230 230 230 300Z" fill="#0b1220" stroke="#38bdf8" stroke-opacity=".7" stroke-width="3"/>
            <path d="M50 142 C46 58 86 20 120 20 C154 20 194 58 190 142 C188 188 160 216 120 216 C80 216 52 188 50 142Z" fill="#0b1220" stroke="#38bdf8" stroke-opacity=".85" stroke-width="3.2"/>
            <ellipse cx="120" cy="134" rx="40" ry="50" fill="#000"/>
            <g filter="url(#zglow)" opacity=".9"><rect x="94" y="124" width="22" height="6" rx="3" fill="#38bdf8"/><rect x="124" y="124" width="22" height="6" rx="3" fill="#38bdf8"/></g>
            <rect x="94" y="124" width="22" height="6" rx="3" fill="#e0f2fe"/><rect x="124" y="124" width="22" height="6" rx="3" fill="#e0f2fe"/>
            <g class="zero-glitch"><rect x="40" y="96" width="70" height="6" fill="#f43f5e" opacity=".5"/><rect x="132" y="150" width="64" height="5" fill="#38bdf8" opacity=".5"/><rect x="60" y="188" width="50" height="4" fill="#a78bfa" opacity=".5"/></g>
            <text x="120" y="288" text-anchor="middle" font-family="monospace" font-size="16" fill="#38bdf8" opacity=".7">0 0 0</text>
        </svg>`;
    }

    function character(id, mood = "neutral") {
        if (id === "zero") return zero();
        const look = LOOKS[id];
        if (!look) return "";
        const uid = `${id}-${Math.floor(Math.random() * 1e6)}`;
        const hp = hairParts(look);
        const brows = BROWS[mood] || BROWS.neutral;
        const browColor = look.hairStyle === "pixie" ? look.hair : look.hair === "#9ca3af" ? "#6b7280" : look.hair;
        const mouthColor = look.mouth || look.lip;
        const accBack = look.acc.filter(a => a === "headphones");
        const accFront = look.acc.filter(a => a !== "headphones");
        return `<svg class="char-svg" viewBox="0 0 240 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Personagem ${id}">
            <defs><clipPath id="head-${uid}"><ellipse cx="120" cy="116" rx="50" ry="60"/></clipPath></defs>
            ${hp.back}
            <path d="M103 166 L103 226 Q120 242 137 226 L137 166Z" fill="${look.shade}"/>
            ${torso(look)}
            <ellipse cx="70" cy="124" rx="8.5" ry="13.5" fill="${look.skin}"/><ellipse cx="170" cy="124" rx="8.5" ry="13.5" fill="${look.skin}"/>
            <ellipse cx="120" cy="116" rx="50" ry="60" fill="${look.skin}"/>
            <g clip-path="url(#head-${uid})"><ellipse cx="156" cy="130" rx="48" ry="70" fill="${look.shade}" opacity=".28"/></g>
            ${hp.front}
            ${eyesFor(look, mood)}
            <path d="${BROWS[mood] ? brows[0] : BROWS.neutral[0]}" fill="none" stroke="${browColor}" stroke-width="4" stroke-linecap="round"/>
            <path d="${BROWS[mood] ? brows[1] : BROWS.neutral[1]}" fill="none" stroke="${browColor}" stroke-width="4" stroke-linecap="round"/>
            <path d="M120 124 Q113 140 120 142" fill="none" stroke="${look.shade}" stroke-width="2.4" stroke-linecap="round"/>
            ${mouthFor(mood, mouthColor, look.beard)}
            ${accFront.map(a => accessory(a, look)).join("")}
            ${accBack.map(a => accessory(a, look)).join("")}
        </svg>`;
    }

    /* ------------------------------------------------------------------
       CENÁRIOS
       ------------------------------------------------------------------ */
    const svgOpen = `<svg class="bg-svg" viewBox="0 0 1280 720" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">`;

    function skyline(r, baseY, minH, maxH, fill, windows) {
        let shapes = "", wins = "", x = -30;
        while (x < 1310) {
            const w = 52 + r() * 90, h = minH + r() * (maxH - minH), y = baseY - h;
            shapes += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${w.toFixed(0)}" height="${(h + 260).toFixed(0)}" fill="${fill}"/>`;
            if (windows) {
                for (let wy = y + 14; wy < baseY - 10; wy += 22) {
                    for (let wx = x + 8; wx < x + w - 12; wx += 16) {
                        if (r() < 0.26) {
                            const c = r() < 0.7 ? "#fbbf24" : "#38bdf8";
                            wins += `<rect x="${wx.toFixed(0)}" y="${wy.toFixed(0)}" width="7" height="10" fill="${c}" opacity="${(0.3 + r() * 0.55).toFixed(2)}"/>`;
                        }
                    }
                }
            }
            x += w + 5 + r() * 10;
        }
        return shapes + wins;
    }

    const BGS = {
        city_night() {
            const r = rng(7);
            let rain = "";
            for (let i = 0; i < 70; i++) {
                const x = (r() * 1400 - 60).toFixed(0), y = (r() * 700).toFixed(0);
                rain += `<line class="rain" x1="${x}" y1="${y}" x2="${(+x - 14)}" y2="${(+y + 46)}" style="animation-delay:-${(r() * 1.2).toFixed(2)}s"/>`;
            }
            return `${svgOpen}
              <defs><linearGradient id="skyc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070a1f"/><stop offset=".6" stop-color="#1a1d45"/><stop offset="1" stop-color="#3b1e5e"/></linearGradient>
              <radialGradient id="moonc"><stop offset="0" stop-color="#e0e7ff" stop-opacity=".9"/><stop offset="1" stop-color="#e0e7ff" stop-opacity="0"/></radialGradient></defs>
              <rect width="1280" height="720" fill="url(#skyc)"/>
              <circle cx="1020" cy="150" r="130" fill="url(#moonc)"/><circle cx="1020" cy="150" r="40" fill="#eef2ff"/>
              ${skyline(r, 600, 140, 330, "#10163a", false)}
              ${skyline(r, 690, 230, 520, "#070a18", true)}
              <rect class="blink" x="302" y="150" width="6" height="6" fill="#f43f5e"/><rect class="blink" x="770" y="120" width="6" height="6" fill="#f43f5e" style="animation-delay:-.8s"/>
              ${rain}
              <rect width="1280" height="720" fill="url(#skyc)" opacity=".12"/></svg>`;
        },

        server_room() {
            const r = rng(11);
            const ledColors = ["#10b981", "#38bdf8", "#f59e0b", "#10b981", "#f43f5e"];
            let racks = "";
            for (let i = 0; i < 7; i++) {
                const x = 30 + i * 178, y = 90;
                racks += `<rect x="${x}" y="${y}" width="152" height="540" rx="6" fill="#0b1220" stroke="#1e2d46" stroke-width="2"/>`;
                for (let k = 0; k < 12; k++) {
                    const ry = y + 14 + k * 43;
                    racks += `<rect x="${x + 10}" y="${ry}" width="132" height="35" rx="3" fill="#101a2c" stroke="#1b2a42"/>`;
                    for (let j = 0; j < 5; j++) {
                        const c = ledColors[Math.floor(r() * ledColors.length)];
                        racks += `<circle class="led" cx="${x + 22 + j * 11}" cy="${ry + 17}" r="2.7" fill="${c}" style="animation-delay:-${(r() * 3).toFixed(2)}s;animation-duration:${(1.2 + r() * 2.4).toFixed(2)}s"/>`;
                    }
                    racks += `<path d="M${x + 88} ${ry + 10} h44 M${x + 88} ${ry + 17} h44 M${x + 88} ${ry + 24} h44" stroke="#1d2b44" stroke-width="2"/>`;
                }
            }
            return `${svgOpen}
              <defs><linearGradient id="floorc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1322"/><stop offset="1" stop-color="#04070d"/></linearGradient>
              <radialGradient id="glowc" cx=".5" cy=".4" r=".7"><stop offset="0" stop-color="#38bdf8" stop-opacity=".18"/><stop offset="1" stop-color="#38bdf8" stop-opacity="0"/></radialGradient></defs>
              <rect width="1280" height="720" fill="#050810"/>
              <rect x="0" y="0" width="1280" height="70" fill="#0a111e"/><rect x="120" y="30" width="1040" height="6" fill="#bae6fd" opacity=".55"/>
              ${racks}
              <rect x="0" y="630" width="1280" height="90" fill="url(#floorc)"/>
              <rect x="0" y="632" width="1280" height="3" fill="#38bdf8" opacity=".35"/>
              <rect width="1280" height="720" fill="url(#glowc)"/>
              <rect class="alarm-light" width="1280" height="720" fill="#f43f5e" opacity="0"/></svg>`;
        },

        office() {
            const r = rng(21);
            let notes = "", lines = "";
            const pts = [[160, 150], [330, 120], [500, 170], [280, 280], [470, 300], [640, 230]];
            pts.forEach(([x, y], i) => {
                notes += `<g transform="rotate(${(r() * 10 - 5).toFixed(1)} ${x} ${y})"><rect x="${x - 44}" y="${y - 38}" width="88" height="76" fill="#e2e8f0"/><rect x="${x - 38}" y="${y - 32}" width="76" height="46" fill="${["#334155", "#475569", "#1e293b"][i % 3]}"/><path d="M${x - 30} ${y + 24} h50" stroke="#64748b" stroke-width="3"/></g>`;
                if (i) lines += `<path d="M${pts[i - 1][0]} ${pts[i - 1][1]} L${x} ${y}" stroke="#f43f5e" stroke-width="2" opacity=".85"/>`;
            });
            let code = "";
            for (let m = 0; m < 3; m++) {
                const mx = 760 + m * 160;
                code += `<rect x="${mx}" y="330" width="146" height="100" rx="6" fill="#050b16" stroke="#1f3a5f" stroke-width="3"/>`;
                for (let l = 0; l < 6; l++) code += `<rect x="${mx + 10}" y="${342 + l * 13}" width="${(30 + r() * 100).toFixed(0)}" height="5" fill="${["#38bdf8", "#10b981", "#fbbf24"][l % 3]}" opacity=".8"/>`;
            }
            return `${svgOpen}
              <defs><linearGradient id="offw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c1428"/><stop offset="1" stop-color="#111c36"/></linearGradient></defs>
              <rect width="1280" height="720" fill="url(#offw)"/>
              <rect x="90" y="70" width="640" height="300" rx="6" fill="#0a1020" stroke="#243a5e" stroke-width="4"/>
              ${notes}${lines}
              <rect x="780" y="90" width="420" height="190" fill="#0a1226" stroke="#243a5e" stroke-width="4"/>
              <g opacity=".9">${skyline(rng(5), 276, 40, 140, "#10163a", false)}</g>
              <rect x="780" y="90" width="420" height="190" fill="none" stroke="#243a5e" stroke-width="4"/>
              <path d="M990 90 V280 M780 185 H1200" stroke="#243a5e" stroke-width="3"/>
              ${code}
              <rect x="0" y="520" width="1280" height="200" fill="#0a1020"/><rect x="700" y="470" width="540" height="22" fill="#162340"/>
              <rect width="1280" height="720" fill="#38bdf8" opacity=".03"/></svg>`;
        },

        terminal_void() {
            const r = rng(33);
            let cols = "";
            for (let c = 0; c < 22; c++) {
                const x = 30 + c * 58;
                let chars = "";
                const n = 12 + Math.floor(r() * 6);
                for (let i = 0; i < n; i++) chars += `<tspan x="${x}" dy="26">${"01ABCDEF<>/{}"[Math.floor(r() * 13)]}</tspan>`;
                cols += `<text class="codecol" font-family="monospace" font-size="22" fill="#38bdf8" style="animation-delay:-${(r() * 8).toFixed(2)}s;animation-duration:${(7 + r() * 6).toFixed(1)}s">${chars}</text>`;
            }
            let grid = "";
            for (let i = -8; i <= 8; i++) grid += `<line x1="${640 + i * 40}" y1="430" x2="${640 + i * 230}" y2="720" stroke="#38bdf8" stroke-width="1" opacity=".25"/>`;
            for (let j = 0; j < 8; j++) grid += `<line x1="0" y1="${430 + j * j * 6 + 6}" x2="1280" y2="${430 + j * j * 6 + 6}" stroke="#38bdf8" stroke-width="1" opacity=".22"/>`;
            return `${svgOpen}
              <defs><radialGradient id="vd" cx=".5" cy=".45" r=".75"><stop offset="0" stop-color="#0d1b33"/><stop offset="1" stop-color="#02040a"/></radialGradient></defs>
              <rect width="1280" height="720" fill="url(#vd)"/>
              <g opacity=".35">${cols}</g>${grid}
              <circle cx="640" cy="300" r="190" fill="none" stroke="#38bdf8" stroke-width="1.5" opacity=".25"/><circle cx="640" cy="300" r="150" fill="none" stroke="#a78bfa" stroke-width="1" opacity=".25"/>
              <text x="640" y="350" text-anchor="middle" font-family="monospace" font-size="220" fill="#38bdf8" opacity=".08">0</text></svg>`;
        },

        vault() {
            const r = rng(44);
            let rays = "", dust = "", bolts = "";
            for (let i = 0; i < 16; i++) {
                const a = (i / 16) * Math.PI * 2;
                rays += `<path d="M640 360 L${(640 + Math.cos(a - 0.06) * 900).toFixed(0)} ${(360 + Math.sin(a - 0.06) * 900).toFixed(0)} L${(640 + Math.cos(a + 0.06) * 900).toFixed(0)} ${(360 + Math.sin(a + 0.06) * 900).toFixed(0)}Z" fill="#fbbf24" opacity=".05"/>`;
                bolts += `<circle cx="${(640 + Math.cos(a) * 250).toFixed(0)}" cy="${(360 + Math.sin(a) * 250).toFixed(0)}" r="9" fill="#78350f" stroke="#fbbf24" stroke-width="2"/>`;
            }
            for (let i = 0; i < 34; i++) dust += `<circle class="dust" cx="${(r() * 1280).toFixed(0)}" cy="${(r() * 720).toFixed(0)}" r="${(1 + r() * 2.2).toFixed(1)}" fill="#fde68a" style="animation-delay:-${(r() * 9).toFixed(2)}s;animation-duration:${(6 + r() * 7).toFixed(1)}s"/>`;
            return `${svgOpen}
              <defs><radialGradient id="vg" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#7c5a12" stop-opacity=".9"/><stop offset="1" stop-color="#05070d" stop-opacity="1"/></radialGradient></defs>
              <rect width="1280" height="720" fill="url(#vg)"/>${rays}
              <circle cx="640" cy="360" r="290" fill="#1f2937" stroke="#fbbf24" stroke-width="6"/>
              <circle cx="640" cy="360" r="262" fill="#111827" stroke="#92400e" stroke-width="4"/>
              <g class="spin-slow" style="transform-origin:640px 360px"><circle cx="640" cy="360" r="170" fill="none" stroke="#fbbf24" stroke-width="5"/>
              <path d="M640 190 V530 M470 360 H810 M520 240 L760 480 M760 240 L520 480" stroke="#fbbf24" stroke-width="7" stroke-linecap="round"/></g>
              <circle cx="640" cy="360" r="46" fill="#451a03" stroke="#fbbf24" stroke-width="5"/>${bolts}${dust}</svg>`;
        },

        rooftop() {
            const r = rng(55);
            return `${svgOpen}
              <defs><linearGradient id="dawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1140"/><stop offset=".45" stop-color="#8b3a62"/><stop offset=".75" stop-color="#ff7a59"/><stop offset="1" stop-color="#ffd27a"/></linearGradient>
              <radialGradient id="sun"><stop offset="0" stop-color="#fff7d6"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient></defs>
              <rect width="1280" height="720" fill="url(#dawn)"/>
              <circle cx="640" cy="470" r="220" fill="url(#sun)"/><circle cx="640" cy="470" r="70" fill="#fff3c4"/>
              ${skyline(r, 560, 120, 300, "#2a1a3f", false)}
              ${skyline(r, 700, 200, 420, "#120a24", true)}
              <rect x="0" y="650" width="1280" height="70" fill="#0b0716"/><path d="M0 650 H1280" stroke="#3b2a5c" stroke-width="5"/>
              <path d="M0 610 H1280 M0 570 H1280" stroke="#3b2a5c" stroke-width="3" opacity=".7"/></svg>`;
        },

        blackout() {
            const r = rng(66);
            let shapes = "";
            for (let i = 0; i < 7; i++) shapes += `<rect x="${30 + i * 178}" y="110" width="152" height="540" rx="6" fill="#06080f" stroke="#12192a" stroke-width="2"/>`;
            return `${svgOpen}
              <rect width="1280" height="720" fill="#020308"/>${shapes}
              <rect class="alarm-light" width="1280" height="720" fill="#f43f5e" opacity=".0"/>
              <circle class="blink" cx="${(200 + r() * 800).toFixed(0)}" cy="180" r="4" fill="#f43f5e"/><circle class="blink" cx="${(200 + r() * 800).toFixed(0)}" cy="340" r="4" fill="#f43f5e" style="animation-delay:-.6s"/></svg>`;
        }
    };

    const cache = {};
    function background(name) {
        if (!cache[name]) cache[name] = (BGS[name] || BGS.terminal_void)();
        return cache[name];
    }

    return { character, background, looks: () => Object.keys(LOOKS) };
})();
