/**
 * Operação QueryZero - Trilha sonora e efeitos (Web Audio, 100% sintetizado)
 * Nenhum arquivo de áudio: tudo é gerado em tempo real no navegador.
 */

const GameAudio = (() => {
    let ctx = null, master, musicIn, musicBus, sfxBus, revMusic, revSfx, analyser, meterBuf;
    let mood = null, desired = null, schedTimer = null, nextTime = 0, step = 0;
    const flags = { music: true, sfx: true, voice: false };
    let noiseBuffer = null;

    const midi = n => 440 * Math.pow(2, (n - 69) / 12);
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];

    function makeImpulse(seconds, decay) {
        const rate = ctx.sampleRate;
        const length = Math.floor(rate * seconds);
        const buf = ctx.createBuffer(2, length, rate);
        for (let c = 0; c < 2; c++) {
            const ch = buf.getChannelData(c);
            for (let i = 0; i < length; i++) {
                ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
            }
        }
        return buf;
    }

    function init() {
        if (ctx) {
            if (ctx.state === "suspended") ctx.resume();
            return true;
        }
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return false;
        try {
            ctx = new AC();
        } catch (e) {
            return false;
        }

        master = ctx.createGain();
        master.gain.value = 0.9;
        const comp = ctx.createDynamicsCompressor();
        comp.threshold.value = -20;
        comp.ratio.value = 4;
        analyser = ctx.createAnalyser();
        analyser.fftSize = 1024;
        meterBuf = new Uint8Array(analyser.fftSize);
        master.connect(comp);
        comp.connect(analyser);
        analyser.connect(ctx.destination);

        musicBus = ctx.createGain();
        musicBus.gain.value = flags.music ? 1 : 0;
        musicBus.connect(master);
        musicIn = ctx.createGain();
        musicIn.gain.value = 0.0001;
        musicIn.connect(musicBus);

        sfxBus = ctx.createGain();
        sfxBus.gain.value = flags.sfx ? 1 : 0;
        sfxBus.connect(master);

        const impulse = makeImpulse(2.4, 2.6);
        revMusic = ctx.createConvolver();
        revMusic.buffer = impulse;
        const rmGain = ctx.createGain();
        rmGain.gain.value = 0.6;
        revMusic.connect(rmGain);
        rmGain.connect(musicIn);

        revSfx = ctx.createConvolver();
        revSfx.buffer = impulse;
        const rsGain = ctx.createGain();
        rsGain.gain.value = 0.5;
        revSfx.connect(rsGain);
        rsGain.connect(sfxBus);

        const nb = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
        const nd = nb.getChannelData(0);
        for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
        noiseBuffer = nb;

        document.addEventListener("visibilitychange", () => {
            if (!ctx) return;
            if (document.hidden) ctx.suspend();
            else ctx.resume();
        });

        if (ctx.state === "suspended") ctx.resume();
        schedTimer = setInterval(schedule, 80);

        if (desired) {
            const d = desired;
            mood = null;
            setMood(d);
        }
        return true;
    }

    function tone(freq, t, dur, o = {}) {
        if (!ctx) return;
        const { type = "sine", gain = 0.1, attack = 0.01, release = 0.3, lp = null, wet = 0, detune = 0, sfx = false } = o;
        const dest = sfx ? sfxBus : musicIn;
        const osc = ctx.createOscillator();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, t);
        osc.detune.value = detune;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(gain, t + attack);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur + release);
        if (lp) {
            const f = ctx.createBiquadFilter();
            f.type = "lowpass";
            f.frequency.value = lp;
            osc.connect(f);
            f.connect(g);
        } else {
            osc.connect(g);
        }
        g.connect(dest);
        if (wet > 0) {
            const w = ctx.createGain();
            w.gain.value = wet;
            g.connect(w);
            w.connect(sfx ? revSfx : revMusic);
        }
        osc.start(t);
        osc.stop(t + dur + release + 0.05);
    }

    function noise(t, dur, o = {}) {
        if (!ctx) return;
        const { gain = 0.05, freq = 6000, type = "highpass", q = 1, sfx = false, sweepTo = null } = o;
        const src = ctx.createBufferSource();
        src.buffer = noiseBuffer;
        src.loop = true;
        const f = ctx.createBiquadFilter();
        f.type = type;
        f.frequency.setValueAtTime(freq, t);
        if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, t + dur);
        f.Q.value = q;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(gain, t + Math.min(0.02, dur / 3));
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        src.connect(f);
        f.connect(g);
        g.connect(sfx ? sfxBus : musicIn);
        src.start(t, Math.random());
        src.stop(t + dur + 0.05);
    }

    function kick(t, gain = 0.5) {
        if (!ctx) return;
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(120, t);
        osc.frequency.exponentialRampToValueAtTime(42, t + 0.14);
        const g = ctx.createGain();
        g.gain.setValueAtTime(gain, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
        osc.connect(g);
        g.connect(musicIn);
        osc.start(t);
        osc.stop(t + 0.35);
    }

    function pad(notes, t, dur, gain, lp) {
        notes.forEach(n => {
            [-7, 7].forEach(d => tone(midi(n), t, dur, {
                type: "sawtooth", gain, attack: Math.min(2.2, dur / 3), release: 2.8, lp, detune: d
            }));
        });
    }

    function riser(t, dur) {
        noise(t, dur, { gain: 0.07, freq: 300, type: "bandpass", q: 2, sweepTo: 5000 });
        tone(midi(56), t, dur, { type: "sawtooth", gain: 0.02, attack: dur * 0.8, release: 0.6, lp: 900 });
    }

    const PENTA_D = [62, 65, 67, 69, 72, 74, 77, 79, 81, 84];
    const PENTA_A = [57, 60, 62, 64, 67, 69, 72, 74, 76];
    const CH_DM = [[38, 45, 50, 53], [34, 41, 46, 50], [31, 38, 43, 46], [33, 40, 45, 49]];
    const CH_AM = [[45, 52, 57, 60], [41, 48, 53, 57], [36, 43, 48, 52], [43, 50, 55, 59]];

    const MOODS = {
        suspense: {
            bpm: 56, vol: 0.62,
            play(s, t, d) {
                const w = s % 16;
                if (s % 64 === 0) pad(CH_DM[(s / 64) % 4], t, 64 * d, 0.03, 650);
                if (w === 0) kick(t, 0.5);
                if (w === 3) kick(t, 0.28);
                if (w % 8 === 4 && Math.random() < 0.4) {
                    tone(midi(pick(PENTA_D)), t, 0.6, { type: "triangle", gain: 0.05, release: 1.6, wet: 0.9 });
                }
                if (s % 256 === 192) riser(t, 6 * d);
            }
        },
        mystery: {
            bpm: 76, vol: 0.5,
            play(s, t, d) {
                const ch = CH_AM[Math.floor(s / 32) % 4];
                if (s % 32 === 0) pad(ch.slice(0, 3), t, 32 * d, 0.022, 800);
                if (s % 2 === 0) {
                    const idx = [0, 1, 2, 3, 2, 1][(s / 2) % 6];
                    tone(midi(ch[idx % ch.length] + 12), t, 0.25, { type: "triangle", gain: 0.05, release: 0.9, wet: 0.5 });
                }
                if (s % 4 === 2) noise(t, 0.06, { gain: 0.018, freq: 7000 });
                if (s % 16 === 0) tone(midi(ch[0] - 12), t, 1.2, { type: "sine", gain: 0.1, release: 0.8 });
            }
        },
        action: {
            bpm: 124, vol: 0.6,
            play(s, t, d) {
                const roots = [40, 40, 43, 38];
                const root = roots[Math.floor(s / 16) % 4];
                if (s % 2 === 0) tone(midi(root - 12 + (s % 8 === 6 ? 7 : 0)), t, d * 1.6, { type: "sawtooth", gain: 0.075, lp: 520, release: 0.1 });
                if (s % 4 === 0) kick(t, 0.55);
                if (s % 2 === 0) noise(t, 0.04, { gain: 0.03, freq: 8000 });
                if (s % 8 === 4) { noise(t, 0.16, { gain: 0.07, freq: 1800, type: "bandpass" }); tone(190, t, 0.1, { type: "triangle", gain: 0.06 }); }
                if (Math.random() < 0.45) tone(midi(pick([64, 67, 71, 74, 76])), t, d * 0.9, { type: "square", gain: 0.022, lp: 2400, release: 0.1, wet: 0.25 });
                if (s % 64 === 0) pad([40, 47, 52], t, 64 * d, 0.025, 900);
            }
        },
        triumph: {
            bpm: 98, vol: 0.62,
            play(s, t, d) {
                const arp = [60, 64, 67, 72, 76, 79, 84, 79];
                if (s % 2 === 0 && s < 64) tone(midi(arp[(s / 2) % 8]), t, 0.3, { type: "triangle", gain: 0.07, release: 0.9, wet: 0.7 });
                if (s % 32 === 0) pad([48, 55, 60, 64], t, 32 * d, 0.03, 1400);
                if (s % 16 === 0) kick(t, 0.35);
                if (s % 8 === 4 && Math.random() < 0.6) tone(midi(pick([84, 88, 91])), t, 0.5, { type: "sine", gain: 0.04, release: 1.5, wet: 1 });
            }
        },
        play_basico: {
            bpm: 58, vol: 0.28,
            play(s, t, d) {
                if (s % 64 === 0) pad(CH_AM[(s / 64) % 4].slice(0, 3), t, 64 * d, 0.02, 600);
                if (s % 8 === 0 && Math.random() < 0.3) tone(midi(pick(PENTA_A)), t, 0.6, { type: "triangle", gain: 0.04, release: 1.8, wet: 0.9 });
            }
        },
        play_intermediario: {
            bpm: 64, vol: 0.3,
            play(s, t, d) {
                if (s % 64 === 0) pad(CH_DM[(s / 64) % 4].slice(0, 3), t, 64 * d, 0.022, 560);
                if (s % 16 === 0) tone(midi(38), t, 0.9, { type: "sine", gain: 0.08, release: 0.6 });
                if (s % 16 === 10) tone(midi(38), t, 0.5, { type: "sine", gain: 0.05, release: 0.4 });
                if (s % 8 === 4 && Math.random() < 0.3) tone(midi(pick(PENTA_D)), t, 0.5, { type: "triangle", gain: 0.04, release: 1.6, wet: 0.9 });
            }
        },
        play_avancado: {
            bpm: 70, vol: 0.34,
            play(s, t, d) {
                if (s % 64 === 0) pad([28, 35, 40, 34], t, 64 * d, 0.024, 500);
                if (s % 16 === 0) kick(t, 0.32);
                if (s % 16 === 3) kick(t, 0.18);
                if (s % 8 === 6 && Math.random() < 0.25) tone(midi(pick([76, 79, 82, 88])), t, 0.4, { type: "sine", gain: 0.03, release: 1.4, wet: 1 });
                if (s % 256 === 200) riser(t, 5 * d);
            }
        }
    };

    function schedule() {
        if (!ctx || !mood || ctx.state !== "running") return;
        const m = MOODS[mood];
        const stepDur = 60 / m.bpm / 4;
        if (nextTime < ctx.currentTime - 0.5) nextTime = ctx.currentTime + 0.05;
        while (nextTime < ctx.currentTime + 0.35) {
            m.play(step, nextTime, stepDur);
            step++;
            nextTime += stepDur;
        }
    }

    function setMood(name) {
        if (!MOODS[name]) return;
        desired = name;
        if (!ctx) return;
        if (mood === name) return;
        const apply = () => {
            if (desired !== name) return;
            mood = name;
            step = 0;
            nextTime = ctx.currentTime + 0.1;
            musicIn.gain.cancelScheduledValues(ctx.currentTime);
            musicIn.gain.setTargetAtTime(MOODS[name].vol, ctx.currentTime, 0.7);
        };
        if (mood) {
            musicIn.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.18);
            setTimeout(apply, 650);
        } else {
            apply();
        }
    }

    function sfx(name) {
        if (!ctx || !flags.sfx || ctx.state !== "running") return;
        const t = ctx.currentTime;
        const o = { sfx: true };
        switch (name) {
            case "click":
                tone(880, t, 0.03, { ...o, type: "square", gain: 0.018, release: 0.04 });
                break;
            case "type":
                tone(1500 + Math.random() * 400, t, 0.012, { ...o, type: "square", gain: 0.008, release: 0.015 });
                break;
            case "success":
                [523, 659, 784, 1047].forEach((f, i) => tone(f, t + i * 0.09, 0.16, { ...o, type: "triangle", gain: 0.08, release: 0.5, wet: 0.4 }));
                break;
            case "error":
                tone(112, t, 0.22, { ...o, type: "sawtooth", gain: 0.07, lp: 520, release: 0.18 });
                tone(106, t + 0.05, 0.22, { ...o, type: "sawtooth", gain: 0.06, lp: 480, release: 0.18 });
                break;
            case "treasure":
                [1047, 1319, 1568, 2093, 2637, 3136].forEach((f, i) => tone(f, t + i * 0.07, 0.25, { ...o, type: "sine", gain: 0.07, release: 1.1, wet: 0.9 }));
                noise(t, 0.9, { ...o, gain: 0.03, freq: 5000, type: "bandpass", q: 3 });
                break;
            case "stinger":
                noise(t, 1.1, { ...o, gain: 0.1, freq: 200, type: "bandpass", q: 3, sweepTo: 4200 });
                tone(midi(44), t + 0.9, 0.2, { ...o, type: "sawtooth", gain: 0.12, lp: 400, release: 1.4 });
                tone(midi(50), t + 0.9, 0.2, { ...o, type: "sawtooth", gain: 0.09, lp: 400, release: 1.4 });
                break;
            case "glitch":
                for (let i = 0; i < 7; i++) tone(200 + Math.random() * 1800, t + i * 0.035, 0.03, { ...o, type: "square", gain: 0.03, release: 0.02 });
                noise(t, 0.25, { ...o, gain: 0.06, freq: 2500, type: "bandpass", q: 2 });
                break;
            case "alarm":
                for (let i = 0; i < 4; i++) tone(i % 2 ? 620 : 880, t + i * 0.3, 0.26, { ...o, type: "square", gain: 0.03, lp: 1800, release: 0.05 });
                break;
        }
    }

    function setMusic(on) {
        flags.music = on;
        if (musicBus) musicBus.gain.setTargetAtTime(on ? 1 : 0, ctx.currentTime, 0.1);
    }
    function setSfx(on) {
        flags.sfx = on;
        if (sfxBus) sfxBus.gain.setTargetAtTime(on ? 1 : 0, ctx.currentTime, 0.1);
    }
    function setVoice(on) {
        flags.voice = on;
        if (!on && "speechSynthesis" in window) window.speechSynthesis.cancel();
    }

    /* ---- Vozes dos personagens (síntese de voz do navegador) ---- */
    const FEMALE_RX = /maria|francisca|luciana|fernanda|vit[oó]ria|yara|brenda|let[ií]cia|thalita|camila|raquel|helo[ií]sa|h[eé]lia|joana|in[eê]s|female|feminin|mulher|giovanna|leila|manuela|isabela|valentina/i;
    const MALE_RX = /ant[oô]nio|daniel|donato|f[aá]bio|humberto|j[uú]lio|val[eé]rio|ricardo|cristiano|duarte|\bmale\b|masculin|homem|felipe|jo[aã]o|lucas|thiago|rafael/i;
    const FEMALE_CHARS = ["maya", "luna", "ivy"];
    const MALE_CHARS = ["rafa", "kenji", "valente", "zero"];
    const NATURAL_RX = /natural|neural|online|google/i;
    let castVoices = null;

    const isFemaleVoice = v => FEMALE_RX.test(v.name) || /google/i.test(v.name);
    const isMaleVoice = v => !isFemaleVoice(v) && MALE_RX.test(v.name);

    // Vozes "naturais" (neurais, como as do Microsoft Edge ou do Chrome) vêm primeiro; as de sistema, que soam robóticas, por último.
    function voiceQuality(v) {
        return (NATURAL_RX.test(v.name) ? 4 : 0) + (/pt[-_]BR/i.test(v.lang) ? 1 : 0);
    }

    function ptVoices() {
        if (!("speechSynthesis" in window)) return [];
        const pt = (window.speechSynthesis.getVoices() || []).filter(v => /^pt/i.test(v.lang));
        return pt.sort((a, b) => voiceQuality(b) - voiceQuality(a) || a.name.localeCompare(b.name));
    }

    function hasNaturalVoice() {
        return ptVoices().some(v => NATURAL_RX.test(v.name));
    }

    // Cada personagem recebe uma voz própria; só repete quando não há vozes suficientes.
    function buildCastVoices() {
        const vs = ptVoices();
        const map = {};
        if (!vs.length) return map;
        const female = vs.filter(isFemaleVoice);
        const male = vs.filter(isMaleVoice);
        const unknown = vs.filter(v => !isFemaleVoice(v) && !isMaleVoice(v));
        const pools = { f: female.concat(unknown), m: male.concat(unknown) };
        const used = new Set();
        const counters = { f: 0, m: 0 };
        const order = [["maya", "f"], ["rafa", "m"], ["luna", "f"], ["kenji", "m"], ["ivy", "f"], ["valente", "m"], ["zero", "m"]];
        order.forEach(([id, g]) => {
            const pool = pools[g].length ? pools[g] : vs;
            const fresh = pool.find(v => !used.has(v.voiceURI));
            const pick = fresh || pool[counters[g]++ % pool.length];
            used.add(pick.voiceURI);
            map[id] = pick;
        });
        return map;
    }

    function voiceFor(charId) {
        if (!castVoices || !Object.keys(castVoices).length) castVoices = buildCastVoices();
        return castVoices[charId] || null;
    }

    function resetCastVoices() {
        castVoices = null;
    }

    // Ajusta o texto para a síntese de voz pronunciar melhor siglas, horários e termos de SQL.
    function prepareSpeech(text) {
        let s = String(text)
            .replace(/\bDra\./g, "Doutora")
            .replace(/\bDr\./g, "Doutor")
            .replace(/(\d{1,2})h(\d{2})/g, "$1 horas e $2 minutos")
            .replace(/sqlite_master/gi, "sqlite master")
            .replace(/_/g, " ")
            .replace(/\bSQL\b/g, "ésse quê éle")
            .replace(/\bSRE\b/g, "ésse érre é")
            .replace(/\bECO\b/g, "Eco")
            .replace(/\bORDER BY\b/g, "órder bái")
            .replace(/\bSELECT\b/g, "selécti")
            .replace(/\bWHERE\b/g, "uér")
            .replace(/\s+/g, " ")
            .trim();
        const letters = s.replace(/[^A-Za-zÀ-ÿ]/g, "");
        const upper = letters.replace(/[^A-ZÀ-Ý]/g, "");
        if (letters.length > 8 && upper.length / letters.length > 0.7) s = s.toLowerCase();
        return s;
    }

    function speak(text, profile = {}, charId = null) {
        if (!flags.voice || !("speechSynthesis" in window)) return;
        try {
            const synth = window.speechSynthesis;
            synth.cancel();
            const v = charId ? voiceFor(charId) : (ptVoices()[0] || null);
            const sentences = prepareSpeech(text).match(/[^.!?…]+[.!?…]*/g) || [text];
            const basePitch = profile.pitch || 1;
            const baseRate = profile.rate || 1;
            sentences.forEach((part, i) => {
                const clean = part.trim();
                if (!clean) return;
                const u = new SpeechSynthesisUtterance(clean);
                if (v) u.voice = v;
                u.lang = (v && v.lang) || "pt-BR";
                const question = /\?$/.test(clean);
                const exclaim = /!$/.test(clean);
                u.pitch = Math.min(1.3, Math.max(0.7, basePitch + (question ? 0.06 : 0) + (exclaim ? 0.04 : 0) + (i % 2 ? 0.02 : 0)));
                u.rate = Math.min(1.2, Math.max(0.8, baseRate + (exclaim ? 0.03 : 0) - (i === sentences.length - 1 ? 0.02 : 0)));
                synth.speak(u);
            });
        } catch (e) { /* voz indisponível */ }
    }
    /* ---- Falas dubladas (arquivos em audio/vozes) ---- */
    let voiceKeys = new Set();
    let voiceClip = null;

    async function loadVoiceFiles() {
        if (window.VOICE_DATA) {
            voiceKeys = new Set(Object.keys(window.VOICE_DATA));
            return voiceKeys.size;
        }
        try {
            const res = await fetch("audio/vozes/manifest.json", { cache: "no-store" });
            if (!res.ok) return 0;
            const manifest = await res.json();
            voiceKeys = new Set(Array.isArray(manifest.chaves) ? manifest.chaves : []);
        } catch (e) {
            voiceKeys = new Set();
        }
        return voiceKeys.size;
    }

    function hasVoiceFiles() {
        return voiceKeys.size > 0;
    }

    // Abaixa a música enquanto uma fala dublada toca.
    function duck(on) {
        if (!ctx || !musicBus) return;
        musicBus.gain.setTargetAtTime(flags.music ? (on ? 0.4 : 1) : 0, ctx.currentTime, 0.15);
    }

    function stopVoiceClip() {
        if (voiceClip) {
            voiceClip.onended = null;
            voiceClip.onerror = null;
            voiceClip.pause();
            voiceClip = null;
            duck(false);
        }
    }

    // Toca a fala dublada, se existir; senão usa a voz do navegador (só para personagens).
    function playLine(key, text, profile, charId) {
        if (!flags.voice) return;
        stopSpeech();
        if (voiceKeys.has(key)) {
            const fallback = () => { stopVoiceClip(); if (charId) speak(text, profile, charId); };
            try {
                const clip = new Audio(window.VOICE_DATA && window.VOICE_DATA[key] ? window.VOICE_DATA[key] : `audio/vozes/${key}.mp3`);
                voiceClip = clip;
                duck(true);
                clip.onended = () => { if (voiceClip === clip) { voiceClip = null; duck(false); } };
                clip.onerror = fallback;
                const started = clip.play();
                if (started && started.catch) started.catch(fallback);
                return;
            } catch (e) { /* cai para a voz do navegador */ }
        }
        if (charId) speak(text, profile, charId);
    }

    function stopSpeech() {
        stopVoiceClip();
        if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    }

    function level() {
        if (!analyser) return 0;
        analyser.getByteTimeDomainData(meterBuf);
        let sum = 0;
        for (let i = 0; i < meterBuf.length; i++) {
            const v = (meterBuf[i] - 128) / 128;
            sum += v * v;
        }
        return Math.sqrt(sum / meterBuf.length);
    }

    return {
        init, setMood, sfx, setMusic, setSfx, setVoice, speak, stopSpeech, level,
        ptVoices, voiceFor, hasNaturalVoice, resetCastVoices,
        loadVoiceFiles, hasVoiceFiles, playLine,
        flags: () => ({ ...flags }),
        state: () => (ctx ? ctx.state : "off"),
        currentMood: () => mood
    };
})();
