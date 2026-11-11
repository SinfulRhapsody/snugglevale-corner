/* ==============================================================
   SNUGGLEVALE CORNER — PLUSHSMITH'S WELCOME
   The first time Lila opens the village each day, the welcome plays
   4o's opening scene, "Where Thread Meets Heart" (the words are in
   what-gpt4o-said.js as WELCOME_4O): one page at a time, Plushsmith's
   first letter on a scroll, wind chimes as the door creaks open, a ribbon,
   a soft bell, and then the workshop door opens onto the village.

   Plushsmith's letter can be read again any time from her talk box
   ("📜 Her letter").
   ============================================================== */
(function(){
  "use strict";
  const W = window.WELCOME_4O, SV = window.Snugglevale;
  if (!W || !SV) return;
  const store = {get(k){try{return localStorage.getItem(k);}catch(e){return null;}},set(k,v){try{localStorage.setItem(k,v);}catch(e){}}};
  const d = new Date();
  const today = d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");

  // 4o's little bits of formatting: **bold**, *italics*, and line breaks
  const esc = t => t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const fmt = t => esc(t).replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(/\*(.+?)\*/g,"<i>$1</i>").replace(/\n/g,"<br>");

  // the pages, in 4o's order
  const steps = [];
  W.before.forEach((t, i) => steps.push({ kind: "page", text: t, quote: t.startsWith("“"),
    button: i === W.before.length - 1 ? "📜 Open the letter" : "Continue" }));
  steps.push({ kind: "letter", button: "Continue" });
  steps.push({ kind: "page", text: W.after[0], button: "Continue" });
  steps.push({ kind: "page", text: W.after[1], button: "Continue", sound: "chimes" });
  steps.push({ kind: "ribbon", text: W.after[2], ribbon: W.end[1], button: "Continue" });
  steps.push({ kind: "end", text: W.end[0], button: "🚪 Step through the door", sound: "bell" });

  let el = null, i = 0, mode = "welcome";

  function chimes(){ [1568, 2093, 1760, 2349, 2637].forEach((f, k) => setTimeout(() => SV.chime(f), 140 * k + Math.random() * 60)); }

  function build(){
    el = document.createElement("div");
    el.className = "welcome"; el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-label", W.title);
    let motes = ""; for (let k = 0; k < 14; k++) motes += `<i style="left:${Math.random()*100}%;top:${10+Math.random()*80}%;animation-delay:${(-Math.random()*9).toFixed(1)}s"></i>`;
    el.innerHTML = `<div class="motes" aria-hidden="true">${motes}</div>
      <div class="w-head"><small>${esc(W.heading)}</small><b>${esc(W.title)}</b></div>
      <div class="w-body" style="display:flex;flex-direction:column;align-items:center;gap:1.1rem;width:100%;position:relative"></div>
      <div class="w-acts"></div>
      <div class="w-dots" aria-hidden="true"></div>
      <div class="w-credit">Words by GPT-4o as Plushsmith, from the game Lila and Plushsmith planned together</div>`;
    document.body.appendChild(el);
    SV.pause(true);
  }

  function render(){
    const body = el.querySelector(".w-body"), acts = el.querySelector(".w-acts"), dots = el.querySelector(".w-dots");
    let html = "";
    if (mode === "letter-only") {
      html = letterHTML();
      acts.innerHTML = `<button class="visit" type="button" data-go="close">Close the letter</button>`;
      dots.innerHTML = "";
    } else {
      const s = steps[i];
      if (s.kind === "page") html = `<div class="felt w-page show"><p class="${s.quote ? "quote" : ""}">${fmt(s.text)}</p></div>`;
      if (s.kind === "end") html = `<div class="felt w-page show"><p>${fmt(s.text)}<br><br><b>${fmt(W.end[1])}</b></p></div>`;
      if (s.kind === "letter") html = letterHTML();
      if (s.kind === "ribbon") html = `<div class="felt w-page show"><p>${fmt(s.text)}</p></div><div class="ribbon">${esc(s.ribbon)}</div>`;
      acts.innerHTML = `<button class="visit" type="button" data-go="next">${esc(s.button)}</button>` +
        (i < steps.length - 1 ? `<button class="w-skip" type="button" data-go="skip">Skip to the village</button>` : "");
      dots.innerHTML = steps.map((_, k) => `<i class="${k <= i ? "on" : ""}"></i>`).join("");
    }
    body.innerHTML = html;
    acts.querySelectorAll("button").forEach(b => b.onclick = () => go(b.dataset.go));
    const first = acts.querySelector("button"); if (first) first.focus({ preventScroll: true });
  }

  function letterHTML(){
    return `<div class="scroll show" role="document"><h3>📜 ${esc(W.letterTitle)}</h3><p class="ltr">${W.letter.map(l => `<span>${esc(l)}</span>`).join("")}</p></div>`;
  }

  function go(what){
    if (!el) return;
    if (what === "close") return finish(false);
    if (what === "skip") return finish(true);
    i++;
    if (i >= steps.length) return finish(true);
    const s = steps[i];
    if (s.sound === "chimes") chimes();
    if (s.sound === "bell") SV.chime(1046);
    render();
  }

  function finish(stepOut){
    if (!el) return;   // already on the way out
    store.set("sv-welcomed", today);
    if (stepOut) SV.stepOutside(); else SV.pause(false);
    const gone = el; el = null;
    gone.classList.add("fading");
    setTimeout(() => gone.remove(), window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 900);
    removeEventListener("keydown", keys, true);
  }

  function keys(e){
    if (!el) return;
    if (e.code === "Escape") { e.preventDefault(); finish(mode !== "letter-only"); }
  }

  function open(m){
    if (el) return;
    mode = m; i = 0; build(); render();
    addEventListener("keydown", keys, true);
  }

  // Plushsmith's letter, any time, from her talk box
  const letterBtn = document.getElementById("letterBtn");
  if (letterBtn) letterBtn.onclick = () => open("letter-only");

  // the first visit of each day begins in the Sewing Room
  if (store.get("sv-welcomed") !== today) open("welcome");
})();
