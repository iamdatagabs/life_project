const audio = document.getElementById("backgroundAudio");
const soundToggle = document.getElementById("soundToggle");
const answerButton = document.getElementById("answerButton");
const answerNote = document.getElementById("answerNote");

soundToggle.addEventListener("click", async () => {
  if (audio.paused) {
    try {
      await audio.play();
      soundToggle.classList.add("is-playing");
      soundToggle.setAttribute("aria-label", "Pausar música");
      soundToggle.querySelector(".sound-label").textContent = "pausar";
    } catch {
      answerNote.textContent = "Para ativar a música, adicione o arquivo de áudio indicado no README.";
    }
  } else {
    audio.pause();
    soundToggle.classList.remove("is-playing");
    soundToggle.setAttribute("aria-label", "Ativar música");
    soundToggle.querySelector(".sound-label").textContent = "som";
  }
});

answerButton.addEventListener("click", () => {
  answerNote.textContent = "Não precisa responder agora. Eu só queria que você soubesse que esse convite existe.";
  answerButton.textContent = "convite feito ♥";
  answerButton.disabled = true;
});
