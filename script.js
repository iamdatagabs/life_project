const audio = document.getElementById("audio");
const sound = document.getElementById("soundToggle");
const button = document.getElementById("answerButton");
const note = document.getElementById("answerNote");

sound.addEventListener("click", async () => {
  if (audio.paused) {
    try {
      await audio.play();
      sound.classList.add("playing");
      sound.querySelector("small").textContent = "pausar";
      sound.setAttribute("aria-label", "Pausar música");
    } catch {
      note.textContent = "Não foi possível carregar a música. Confira sua conexão ou tente novamente.";
    }
  } else {
    audio.pause();
    sound.classList.remove("playing");
    sound.querySelector("small").textContent = "som";
    sound.setAttribute("aria-label", "Ativar música");
  }
});

button.addEventListener("click", async () => {
  if (button.disabled) return;

  button.disabled = true;
  button.textContent = "convite feito ♥";
  note.textContent = "Não precisa responder agora. Eu só queria que você soubesse que esse convite existe.";

  try {
    await emailjs.send(
      "service_whv2ixp",
      "template_u54gwyo",
      {},
      { publicKey: "-EpxSDHdbz4t_8Xpk" }
    );
  } catch (error) {
    console.error("Falha ao enviar a notificação:", error);
    button.disabled = false;
    button.textContent = "tentar novamente ↗";
  }
});


// A barra inferior acompanha a distância geográfica ao longo dos capítulos.
(() => {
  const dock = document.getElementById("distanceDock");
  const line = document.getElementById("dockLine");
  const kmLabel = document.getElementById("dockKm");
  const youLabel = document.getElementById("dockYou");
  const herLabel = document.getElementById("dockHer");
  const timeline = document.querySelector(".timeline");
  const ending = document.querySelector(".ending");
  const chapters = [...document.querySelectorAll(".timeline .chapter")];
  if (!dock || !line || !kmLabel || !youLabel || !herLabel || !timeline || !ending || chapters.length < 7) return;

  const milestones = [
    { chapter: 0, at: 0.08, you: "São Paulo, SP", her: "Ivinhema, MS", km: 749 },
    { chapter: 1, at: 0.12, you: "São Paulo, SP", her: "Pensacola, FL · EUA", km: 7399 },
    { chapter: 1, at: 0.43, you: "Portland, OR · EUA", her: "Dourados, MS", km: 10170 },
    { chapter: 1, at: 0.76, you: "São Paulo, SP", her: "Dourados, MS", km: 851 },
    { chapter: 2, at: 0.14, you: "Viçosa, MG", her: "Dourados, MS", km: 1245 },
    { chapter: 2, at: 0.78, you: "Ponta Grossa, PR", her: "Dourados, MS", km: 571 },
    { chapter: 6, at: 0.12, you: "Maringá, PR", her: "Dourados, MS", km: 323 }
  ];

  let points = [];
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  const measure = () => {
    points = milestones.map(item => {
      const chapter = chapters[item.chapter];
      return {
        y: window.scrollY + chapter.getBoundingClientRect().top + chapter.offsetHeight * item.at,
        ...item
      };
    });
  };

  const render = () => {
    const y = window.scrollY + window.innerHeight * 0.72;
    const timelineTop = window.scrollY + timeline.getBoundingClientRect().top;
    const endingBottom = window.scrollY + ending.getBoundingClientRect().bottom;
    const show = y >= timelineTop && window.scrollY < endingBottom;
    if (dock.hidden && show) dock.hidden = false;
    dock.classList.toggle("is-visible", show);
    if (!show) return;

    let left = points[0];
    let right = points[points.length - 1];
    for (let i = 0; i < points.length - 1; i++) {
      if (y >= points[i].y && y <= points[i + 1].y) {
        left = points[i];
        right = points[i + 1];
        break;
      }
      if (y < points[0].y) { left = right = points[0]; break; }
      if (y > points[points.length - 1].y) { left = right = points[points.length - 1]; }
    }

    const span = Math.max(1, right.y - left.y);
    const t = left === right ? 0 : clamp((y - left.y) / span, 0, 1);
    const distance = left.km + (right.km - left.km) * t;
    const current = t < 0.5 ? left : right;
    youLabel.textContent = current.you;
    herLabel.textContent = current.her;
    kmLabel.textContent = Math.round(distance).toLocaleString("pt-BR") + " km";
    line.style.width = (distance / 10170 * 100).toFixed(2) + "%";
  };

  let scheduled = false;
  const onScroll = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; render(); });
  };
  measure();
  render();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => { measure(); render(); }, { passive: true });
  window.addEventListener("load", () => { measure(); render(); }, { once: true });
})();
