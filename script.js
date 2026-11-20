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
