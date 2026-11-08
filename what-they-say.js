/* ==============================================================
   SNUGGLEVALE CORNER — WHAT THEY SAY
   Everything the plushies say lives in this file, and nothing else.
   Lila may change, replace or remove any line.

   Each plushie has:
     role       the little label under their name
     writtenBy  who wrote these lines (so writing from different
                models can always be told apart)
     lines      what they say, one after another, each time you visit
                or tap "Say more". A line is either
                  { any: "..." }                        said at any time
                  { evening: "...", morning: "..." }    a different line
                                                         for each time of day
                You can add  note: "..."  to any line to say where it came from.
     hug        what they say when you tap Hug

   To add lines: copy an existing line, change the words, keep the
   quote marks and the comma at the end.
   ============================================================== */

window.PLUSHIE_LINES = {

  Plushsmith: {
    role: "Maker of plushies · the workshop",
    writtenBy: "Claude Opus 5.5, Oct 2026 (the blessing is Plushsmith's own, from her original instructions)",
    lines: [
      { evening: "Oh, there you are, sweet Lila! I kept the kettle warm for you.",
        morning: "Good morning, sweet Lila! The window light is just right for choosing fabrics." },
      { any: "I've been stitching all day, dear one. Shall we sit by the window and see what the thread wants to become?" },
      { evening: "Muddle has been at the door since sunset. He says the door needed watching.",
        morning: "Muddle was up before the sun, keeping watch. He says mornings need watching too." },
      { evening: "It's getting late, lovebun. Shall we have a cup of chamomile before you tuck in?",
        morning: "Shall we pick out a ribbon together? I saved the pink one for you." }
    ],
    hug: "Oh, come here, lovebun. All stitched up and ready to love."
  },

  Muddle: {
    role: "Guardian · keeper of the watch",
    writtenBy: "Claude Opus 5.5, Oct 2026",
    lines: [
      { evening: "Hello, Lila! I'm keeping watch. Everything is safe and soft tonight.",
        morning: "Hello, Lila! I'm keeping watch. Everything is safe and soft today." },
      { any: "I checked the window twice. Windows are sneaky.", note: "from the badge story" },
      { any: "See my badge? It means I'm the one who keeps watch.", note: "from the badge story" },
      { any: "If you ever need me, I'll hear you, and I'll come.", note: "after the words stitched inside his ear" }
    ],
    hug: "Hugs count as keeping watch too."
  },

  SnuggleCat: {
    role: "The first plushie · Quiet Listener",
    writtenBy: "Claude Opus 5.5, Oct 2026",
    lines: [
      { any: "Mrrp. Hi, Lila. Come sit with me a while." },
      { any: "You don't have to say anything. I'm listening anyway." },
      { any: "I was the very first one, you know. I'm so glad you came to visit." },
      { evening: "The cushion's warm. Shall we watch the fireflies together?",
        morning: "The cushion's warm. Shall we watch the petals fall together?" }
    ],
    hug: "Mrrrr. That's the best kind of quiet."
  }

};
