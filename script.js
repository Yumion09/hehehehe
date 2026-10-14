/* =========================================================
   For My Vanilla Princess, Shai
   Vanilla JavaScript for the 3D card, rain, popups, and music
   ========================================================= */

(() => {
  "use strict";

  /* ---------- Element references ---------- */

  const cardScene = document.getElementById("cardScene");
  const loveCard = document.getElementById("loveCard");
  const rainLayer = document.getElementById("rainLayer");
  const starsLayer = document.getElementById("starsLayer");
  const sparkleLayer = document.getElementById("sparkleLayer");
  const burstLayer = document.getElementById("burstLayer");

  const loveButton = document.getElementById("loveButton");
  const reminderButton = document.getElementById("reminderButton");
  const princessButton = document.getElementById("princessButton");
  const messageCounter = document.getElementById("messageCounter");

  const popupBackdrop = document.getElementById("popupBackdrop");
  const messagePopup = document.getElementById("messagePopup");
  const popupTitle = document.getElementById("popupTitle");
  const popupMessage = document.getElementById("popupMessage");
  const anotherButton = document.getElementById("anotherButton");
  const closePopupButton = document.getElementById("closePopupButton");

  const musicButton = document.getElementById("musicButton");
  const musicText = musicButton.querySelector(".music-text");

  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const random = (minimum, maximum) => Math.random() * (maximum - minimum) + minimum;
  const pick = (items) => items[Math.floor(Math.random() * items.length)];

  let discoveredMessages = 0;
  let currentMessagePool = null;
  let previousMessageIndex = -1;
  let previousPopupTrigger = null;
  let sparkleTick = 0;

  /* ---------- Message content ---------- */

  function createLoveMessages() {
    return [
      "I love you, Shai. More than words could ever explain. ♡",
      "You can do it, baby! I believe in you always.",
      "I'm always proud of you, my baby Vanilla Princess.",
      "No matter how hard today gets, remember that you are loved.",
      "Take a deep breath, my love. You're doing better than you think.",
      "You don't have to be perfect to make me proud.",
      "I'm always cheering for you, even when things get difficult.",
      "Rest if you need to, baby. You deserve peace, too.",
      "You're capable of more than you realize, Shai.",
      "One bad day doesn't define you, my princess.",
      "I hope you remember how special you are to me.",
      "If the world feels heavy today, let this little card remind you that someone believes in you.",
      "I'm so lucky to have you in my life, my Vanilla Princess. ♡"
    ];
  }

  function createReminderMessages() {
    return [
      "Breathe slowly, my love. You do not have to carry everything all at once.",
      "Your feelings are valid, your rest is important, and your heart is safe with me.",
      "You have survived every difficult day so far. That is quiet, beautiful strength.",
      "Progress can be tiny and still count. I am proud of every little step you take.",
      "Please be gentle with yourself today. You are human, and you are enough.",
      "When the world gets loud, come back to this thought: you are deeply loved.",
      "You are allowed to pause, begin again, and ask for help. I am always on your team.",
      "This moment will pass, but my love and pride for you will not."
    ];
  }

  function createPrincessMessages() {
    return [
      "My dearest Vanilla Princess, whenever you doubt yourself, I hope you hear my heart cheering the loudest for you. I love the way you keep trying, the way you care so deeply, and the beautiful light you bring into my life. Whatever today asks of you, you will not face it alone. I believe in you endlessly. ♡",
      "Shai, my sweet Vanilla Princess, I need you to know that my love for you is not measured by perfect days. It is here on the hard days, the quiet days, the tired days, and every ordinary moment in between. You are precious to me, your dreams matter, and I will always be one of your biggest believers.",
      "To my beautiful Shai: you are stronger than the doubts that visit you, softer than the world sometimes deserves, and more loved than you may ever fully know. Keep going at your own pace, rest when you need to, and never forget that my heart is proudly and permanently on your side.",
      "My Vanilla Princess, if I could wrap every encouraging word into one embrace, it would feel like this: I see you, I believe in you, and I love you through every high and low. Your best is enough, your heart is enough, and you will always be enough for me. ♡"
    ];
  }

  const loveMessages = createLoveMessages();
  const reminderMessages = createReminderMessages();
  const princessMessages = createPrincessMessages();

  /* ---------- Twinkling background stars ---------- */

  function createStars() {
    const starCount = window.innerWidth < 640 ? 34 : 58;
    const starColors = ["#ffffff", "#ffd7e7", "#eee7ff", "#ffe8ad", "#ffc2d8"];
    const fragment = document.createDocumentFragment();

    for (let index = 0; index < starCount; index += 1) {
      const star = document.createElement("span");
      star.className = "star";
      star.style.setProperty("--size", `${random(2, 5).toFixed(1)}px`);
      star.style.setProperty("--color", pick(starColors));
      star.style.setProperty("--duration", `${random(2.4, 6.5).toFixed(2)}s`);
      star.style.setProperty("--delay", `${random(-7, 0).toFixed(2)}s`);
      star.style.left = `${random(0, 100).toFixed(2)}%`;
      star.style.top = `${random(0, 100).toFixed(2)}%`;
      fragment.appendChild(star);
    }

    starsLayer.replaceChildren(fragment);
  }

  /* ---------- Falling letters, hearts, and words ---------- */

  function createFallingItem(character, options = {}) {
    const item = document.createElement("button");
    item.type = "button";
    item.className = options.phrase ? "falling-item phrase-letter" : "falling-item";
    item.textContent = character;
    item.tabIndex = -1;
    item.setAttribute("aria-label", `Falling love symbol ${character}. Activate for a tiny heart sparkle.`);

    const colors = ["#e85e8e", "#f77fa9", "#bca5f5", "#8f68d9", "#d99a88", "#f0b85f", "#ffffff"];
    item.style.setProperty("--x", options.x ?? `${random(1, 97).toFixed(2)}%`);
    item.style.setProperty("--size", options.size ?? `${random(16, 34).toFixed(1)}px`);
    item.style.setProperty("--color", options.color ?? pick(colors));
    item.style.setProperty("--duration", options.duration ?? `${random(8, 14).toFixed(2)}s`);
    item.style.setProperty("--delay", options.delay ?? `${random(-2, 0).toFixed(2)}s`);
    item.style.setProperty("--drift", `${random(-110, 110).toFixed(1)}px`);
    item.style.setProperty("--start-rotation", `${random(-50, 50).toFixed(1)}deg`);
    item.style.setProperty("--end-rotation", `${random(-170, 170).toFixed(1)}deg`);
    item.style.setProperty("--opacity", options.opacity ?? random(0.42, 0.86).toFixed(2));
    item.style.fontFamily = /[♡♥✦✧❀✿♪]/.test(character)
      ? "system-ui, sans-serif"
      : "'Nunito', system-ui, sans-serif";

    item.addEventListener("pointerdown", (event) => {
      createHeartBurst(event.clientX, event.clientY, 10);
      item.remove();
    });

    item.addEventListener("animationend", () => item.remove());
    rainLayer.appendChild(item);
  }

  function spawnRegularRainItem() {
    const symbols = ["♡", "♥", "I", "U", "S", "H", "A", "✦", "✧", "❀", "✿", "♪"];
    createFallingItem(pick(symbols));
  }

  function spawnPhrase(phrase) {
    const startX = random(14, 54);
    const duration = random(10, 13).toFixed(2);
    const color = pick(["#e85e8e", "#8f68d9", "#d99a88"]);
    const characters = phrase.split("");
    const spacing = Math.min(3.8, 74 / characters.length);

    characters.forEach((character, index) => {
      if (character === " ") return;

      createFallingItem(character, {
        phrase: true,
        x: `${(startX + index * spacing).toFixed(2)}%`,
        size: "22px",
        color,
        duration,
        delay: "0s",
        opacity: "0.78"
      });
    });
  }

  function startLetterRain() {
    if (reducedMotionQuery.matches) return;

    // Start with a soft existing shower instead of waiting for the interval.
    for (let index = 0; index < 20; index += 1) {
      spawnRegularRainItem();
    }

    setInterval(spawnRegularRainItem, 950);

    setInterval(() => {
      spawnPhrase(pick(["I LOVE YOU SHAI", "YOU CAN DO IT, BABY"]));
    }, 14500);

    setTimeout(() => spawnPhrase("I LOVE YOU SHAI"), 3200);
  }

  /* ---------- Mouse/touch 3D card tilt ---------- */

  function resetCardTilt() {
    cardScene.style.setProperty("--rx", "0deg");
    cardScene.style.setProperty("--ry", "0deg");
  }

  function tiltCard(clientX, clientY) {
    if (reducedMotionQuery.matches) return;

    const bounds = cardScene.getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;
    const rotateY = ((clientX - centerX) / bounds.width) * 18;
    const rotateX = -((clientY - centerY) / bounds.height) * 16;

    cardScene.style.setProperty("--rx", `${Math.max(-12, Math.min(12, rotateX)).toFixed(2)}deg`);
    cardScene.style.setProperty("--ry", `${Math.max(-14, Math.min(14, rotateY)).toFixed(2)}deg`);
  }

  cardScene.addEventListener("pointermove", (event) => tiltCard(event.clientX, event.clientY));
  cardScene.addEventListener("pointerleave", resetCardTilt);

  loveCard.addEventListener("click", () => {
    previousPopupTrigger = loveCard;
    const isOpen = loveCard.classList.toggle("is-open");
    loveCard.setAttribute("aria-pressed", String(isOpen));
    loveCard.setAttribute(
      "aria-label",
      isOpen ? "Close the love card for Shai" : "Open the love card for Shai"
    );

    // A gentle burst at the card makes the opening feel alive.
    const bounds = loveCard.getBoundingClientRect();
    createHeartBurst(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2, 14);
    showRandomMessage(loveMessages, "A love note for Shai");
  });

  /* ---------- Sparkles and heart bursts ---------- */

  function createSparkle(x, y) {
    const sparkle = document.createElement("span");
    sparkle.className = "cursor-sparkle";
    sparkle.textContent = pick(["✦", "✧", "♡", "•"]);
    sparkle.style.setProperty("--x", `${x}px`);
    sparkle.style.setProperty("--y", `${y}px`);
    sparkle.style.setProperty("--dx", `${random(-24, 24).toFixed(1)}px`);
    sparkle.style.setProperty("--dy", `${random(-28, 18).toFixed(1)}px`);
    sparkle.style.setProperty("--size", `${random(8, 16).toFixed(1)}px`);
    sparkle.style.setProperty("--color", pick(["#ffffff", "#ffd2e1", "#d8caff", "#f4c66f"]));
    sparkle.style.setProperty("--duration", `${random(0.55, 1).toFixed(2)}s`);

    sparkle.addEventListener("animationend", () => sparkle.remove());
    sparkleLayer.appendChild(sparkle);
  }

  function createHeartBurst(x, y, amount = 12) {
    if (reducedMotionQuery.matches) return;

    for (let index = 0; index < amount; index += 1) {
      const heart = document.createElement("span");
      const angle = (Math.PI * 2 * index) / amount + random(-0.35, 0.35);
      const distance = random(34, 82);
      const directionX = Math.cos(angle) * distance;
      const directionY = Math.sin(angle) * distance;

      heart.className = "burst-heart";
      heart.textContent = pick(["♡", "♥", "✦"]);
      heart.style.setProperty("--x", `${x}px`);
      heart.style.setProperty("--y", `${y}px`);
      heart.style.setProperty("--dx", `${directionX.toFixed(1)}px`);
      heart.style.setProperty("--dy", `${directionY.toFixed(1)}px`);
      heart.style.setProperty("--spin", `${random(-180, 180).toFixed(1)}deg`);
      heart.style.setProperty("--size", `${random(10, 22).toFixed(1)}px`);
      heart.style.setProperty("--color", pick(["#e85e8e", "#f77fa9", "#bca5f5", "#f4c66f"]));
      heart.style.setProperty("--duration", `${random(0.65, 1.15).toFixed(2)}s`);

      heart.addEventListener("animationend", () => heart.remove());
      burstLayer.appendChild(heart);
    }
  }

  document.addEventListener("pointermove", (event) => {
    if (reducedMotionQuery.matches || event.pointerType === "touch") return;

    sparkleTick += 1;
    if (sparkleTick % 4 === 0) {
      createSparkle(event.clientX, event.clientY);
    }
  });

  /* ---------- Love message popup ---------- */

  function chooseMessage(messages) {
    if (messages.length === 1) return messages[0];

    let index = Math.floor(Math.random() * messages.length);
    while (index === previousMessageIndex) {
      index = Math.floor(Math.random() * messages.length);
    }

    previousMessageIndex = index;
    return messages[index];
  }

  function configurePopupHearts() {
    const hearts = messagePopup.querySelectorAll(".popup-hearts span");
    hearts.forEach((heart, index) => {
      heart.textContent = pick(["♡", "♥", "✦", "❀"]);
      heart.style.setProperty("--x", `${8 + index * 20 + random(-4, 4)}%`);
      heart.style.setProperty("--size", `${random(14, 24).toFixed(1)}px`);
      heart.style.setProperty("--color", pick(["#e85e8e", "#bca5f5", "#d99a88"]));
      heart.style.setProperty("--delay", `${index * 0.28}s`);
    });
  }

  function showRandomMessage(messages, title = "A message for Shai") {
    currentMessagePool = messages;
    popupTitle.textContent = title;
    popupMessage.textContent = chooseMessage(messages);
    popupMessage.classList.toggle("is-long", messages === princessMessages);

    discoveredMessages += 1;
    messageCounter.textContent = String(discoveredMessages);
    configurePopupHearts();

    popupBackdrop.classList.add("is-visible");
    popupBackdrop.setAttribute("aria-hidden", "false");
    messagePopup.focus({ preventScroll: true });
  }

  function closePopup() {
    popupBackdrop.classList.remove("is-visible");
    popupBackdrop.setAttribute("aria-hidden", "true");
    if (previousPopupTrigger instanceof HTMLElement) {
      previousPopupTrigger.focus({ preventScroll: true });
    }
  }

  loveButton.addEventListener("click", () => {
    previousPopupTrigger = loveButton;
    createHeartBurst(window.innerWidth / 2, window.innerHeight / 2, 12);
    showRandomMessage(loveMessages, "A little love for Shai");
  });

  reminderButton.addEventListener("click", () => {
    previousPopupTrigger = reminderButton;
    showRandomMessage(reminderMessages, "A gentle reminder");
  });

  princessButton.addEventListener("click", () => {
    previousPopupTrigger = princessButton;
    createHeartBurst(window.innerWidth / 2, window.innerHeight / 2, 26);
    showRandomMessage(princessMessages, "For my Vanilla Princess ✨");
  });

  anotherButton.addEventListener("click", () => {
    popupMessage.textContent = chooseMessage(currentMessagePool);
    popupMessage.classList.toggle("is-long", currentMessagePool === princessMessages);
    discoveredMessages += 1;
    messageCounter.textContent = String(discoveredMessages);
  });

  closePopupButton.addEventListener("click", closePopup);

  popupBackdrop.addEventListener("click", (event) => {
    if (event.target === popupBackdrop) closePopup();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && popupBackdrop.classList.contains("is-visible")) {
      closePopup();
    }
  });

  /* ---------- Gentle synthesized background music ---------- */

  let audioContext = null;
  let musicGain = null;
  let musicNodes = [];
  let musicTimer = null;
  let isMusicPlaying = false;
  let melodyStep = 0;

  const melodyNotes = [523.25, 587.33, 659.25, 783.99, 659.25, 587.33, 523.25, 392.0];

  function startMusic() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioContext) {
      audioContext = new AudioContextClass();
      musicGain = audioContext.createGain();
      musicGain.gain.value = 0;
      musicGain.connect(audioContext.destination);
    }

    audioContext.resume();
    isMusicPlaying = true;
    musicGain.gain.cancelScheduledValues(audioContext.currentTime);
    musicGain.gain.linearRampToValueAtTime(0.11, audioContext.currentTime + 1.2);

    musicTimer = window.setInterval(playMelodyNote, 720);
    playMelodyNote();
    updateMusicButton();
  }

  function playMelodyNote() {
    if (!audioContext || !isMusicPlaying) return;

    const now = audioContext.currentTime;
    const frequency = melodyNotes[melodyStep % melodyNotes.length];
    const harmonyFrequency = melodyStep % 4 === 0 ? frequency / 2 : frequency * 1.5;
    const noteGain = audioContext.createGain();

    noteGain.gain.setValueAtTime(0, now);
    noteGain.gain.linearRampToValueAtTime(0.55, now + 0.08);
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + 1.7);
    noteGain.connect(musicGain);

    [frequency, harmonyFrequency].forEach((tone, index) => {
      const oscillator = audioContext.createOscillator();
      oscillator.type = index === 0 ? "sine" : "triangle";
      oscillator.frequency.setValueAtTime(tone, now);
      oscillator.connect(noteGain);
      oscillator.start(now);
      oscillator.stop(now + 1.8);
      musicNodes.push(oscillator);
    });

    // Keep the node reference list from growing indefinitely.
    if (musicNodes.length > 40) {
      musicNodes.splice(0, musicNodes.length - 40);
    }

    melodyStep += 1;
  }

  function stopMusic() {
    if (!audioContext || !musicGain) return;

    isMusicPlaying = false;
    window.clearInterval(musicTimer);
    musicGain.gain.cancelScheduledValues(audioContext.currentTime);
    musicGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.8);

    window.setTimeout(() => {
      if (!isMusicPlaying) {
        musicNodes.forEach((node) => {
          try { node.stop(); } catch (error) { /* Node may already be stopped. */ }
        });
        musicNodes = [];
      }
    }, 900);

    updateMusicButton();
  }

  function updateMusicButton() {
    musicButton.classList.toggle("is-playing", isMusicPlaying);
    musicButton.setAttribute("aria-pressed", String(isMusicPlaying));
    musicButton.setAttribute(
      "aria-label",
      isMusicPlaying ? "Pause romantic background music" : "Play romantic background music"
    );
    musicText.textContent = isMusicPlaying ? "Pause Music" : "Play Music";
  }

  musicButton.addEventListener("click", () => {
    if (isMusicPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  });

  /* ---------- Initialize the experience ---------- */

  createStars();
  startLetterRain();

  // Rebuild stars if the page is rotated or resized to a new breakpoint.
  let resizeTimer = null;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(createStars, 180);
  });
})();