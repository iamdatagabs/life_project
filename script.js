const audio = document.getElementById("audio");
const sound = document.getElementById("soundToggle");
const button = document.getElementById("answerButton");
const note = document.getElementById("answerNote");

function syncSoundControl() {
  const playing = !audio.paused;
  sound.classList.toggle("playing", playing);
  sound.querySelector("small").textContent = playing ? "pausar" : "som";
  sound.setAttribute("aria-label", playing ? "Pausar música" : "Ativar música");
}

async function startMusic() {
  if (!audio.paused) return true;
  try {
    await audio.play();
    syncSoundControl();
    return true;
  } catch {
    // O navegador pode bloquear autoplay com som; tentaremos novamente
    // assim que houver uma interação legítima da pessoa com a página.
    return false;
  }
}

sound.addEventListener("click", async () => {
  if (audio.paused) {
    const started = await startMusic();
    if (!started) {
      note.textContent = "Toque novamente para ouvir a música.";
    }
  } else {
    audio.pause();
    syncSoundControl();
  }
});

// Primeiro tentamos iniciar ao abrir a página. Se o navegador bloquear,
// a primeira interação com o conteúdo libera a reprodução automaticamente.
startMusic().then(started => {
  if (started) return;

  const resumeOnInteraction = event => {
    if (event.type === "pointerdown" && sound.contains(event.target)) return;
    startMusic().then(ok => {
      if (ok) {
        window.removeEventListener("pointerdown", resumeOnInteraction);
        window.removeEventListener("keydown", resumeOnInteraction);
        window.removeEventListener("scroll", resumeOnInteraction);
      }
    });
  };

  window.addEventListener("pointerdown", resumeOnInteraction, { passive: true });
  window.addEventListener("keydown", resumeOnInteraction);
  window.addEventListener("scroll", resumeOnInteraction, { passive: true });
});

audio.addEventListener("play", syncSoundControl);
audio.addEventListener("pause", syncSoundControl);

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


// Barra de distância sincronizada com a posição de leitura.
(() => {
  const dock = document.getElementById("distanceDock");
  const line = document.getElementById("dockLine");
  const kmLabel = document.getElementById("dockKm");
  const youLabel = document.getElementById("dockYou");
  const herLabel = document.getElementById("dockHer");
  const timeline = document.querySelector(".timeline");
  const ending = document.querySelector(".ending");
  const chapters = Array.from(document.querySelectorAll(".timeline .chapter"));
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

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  let points = [];
  let timelineStart = 0;
  let endingStart = 0;
  let framePending = false;

  // Só mede quando o layout muda; o evento de scroll usa valores já calculados.
  function measureLayout() {
    const scrollY = window.scrollY || window.pageYOffset;
    timelineStart = scrollY + timeline.getBoundingClientRect().top;
    endingStart = scrollY + ending.getBoundingClientRect().top;
    points = milestones.map(item => {
      const chapter = chapters[item.chapter];
      const rect = chapter.getBoundingClientRect();
      return {
        y: scrollY + rect.top + rect.height * item.at,
        you: item.you,
        her: item.her,
        km: item.km
      };
    });
    update();
  }

  function update() {
    const readingY = (window.scrollY || window.pageYOffset) + window.innerHeight * 0.68;
    const visible = readingY >= timelineStart && readingY < endingStart;
    dock.classList.toggle("is-visible", visible);
    if (!visible || !points.length) return;

    let a = points[0];
    let b = points[0];
    if (readingY >= points[points.length - 1].y) {
      a = b = points[points.length - 1];
    } else {
      for (let i = 0; i < points.length - 1; i++) {
        if (readingY >= points[i].y && readingY < points[i + 1].y) {
          a = points[i];
          b = points[i + 1];
          break;
        }
      }
    }

    const fraction = a === b ? 0 : clamp((readingY - a.y) / Math.max(1, b.y - a.y), 0, 1);
    const distance = a.km + (b.km - a.km) * fraction;
    const place = fraction < 0.5 ? a : b;

    youLabel.textContent = place.you;
    herLabel.textContent = place.her;
    kmLabel.textContent = Math.round(distance).toLocaleString("pt-BR") + " km";
    // A largura acompanha cada frame do scroll, sem uma segunda transição CSS atrasada.
    line.style.width = (distance / 10170 * 100).toFixed(3) + "%";
  }

  function onScroll() {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(() => {
      framePending = false;
      update();
    });
  }

  // Remove o atributo hidden para que a transição de entrada/saída seja controlada pelo CSS.
  dock.hidden = false;
  measureLayout();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", measureLayout, { passive: true });
  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(measureLayout);
    observer.observe(timeline);
    observer.observe(ending);
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(measureLayout);
  }
  window.addEventListener("load", measureLayout, { once: true });
})();
