document.addEventListener("DOMContentLoaded", () => {
  const book = document.querySelector(".book");
  const frontCover = document.getElementById("frontCover");
  const pages = Array.from(document.querySelectorAll(".page"));

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const pageNumber = document.getElementById("pageNumber");

  const musicBtn = document.getElementById("musicBtn");
  const bgMusic = document.getElementById("bgMusic");

  const letterBtn = document.getElementById("letterBtn");
  const letter = document.getElementById("letter");

  const heartContainer = document.getElementById("heartContainer");

  const scrapNumber = document.getElementById("scrapNumber");
  const scrapQuote = document.getElementById("scrapQuote");
  const scrapLabel = document.getElementById("scrapLabel");

  let currentPage = 0;
  let coverOpened = false;
  let letterOpened = false;
  let secretShown = false;

  let musicFadeTimer = null;

  const scrapbookData = [
    [
      "01",
      "THE BEGINNING",
      "Awalnya kita cuma satu organisasi. Nggak pernah kepikiran kalau dari tempat ini, bakal ada cerita tentang kita."
    ],
    [
      "02",
      "FIRST MEETING",
      "Awalnya cuma tahu nama. Ketemu kalau ada kegiatan, ngobrol seperlunya, lalu lanjut dengan kesibukan masing-masing."
    ],
    [
      "03",
      "MORE OFTEN",
      "Lama-lama kita jadi lebih sering ketemu. Entah karena kegiatan, rapat, atau memang kebetulan yang terlalu sering terjadi."
    ],
    [
      "04",
      "START TALKING",
      "Dari yang awalnya cuma ngobrol soal organisasi, mulai merembet ke hal-hal random. Dan ternyata ngobrol sama kamu nggak pernah terasa membosankan."
    ],
    [
      "05",
      "RANDOM TALKS",
      "Kadang kita ngomongin hal yang nggak penting sama sekali. Tapi justru dari obrolan kecil itu, kita jadi makin mengenal satu sama lain."
    ],
    [
      "06",
      "COMFORT",
      "Tanpa sadar, kita mulai nyaman. Nggak perlu terlalu banyak mikir buat mulai ngobrol atau sekadar bercanda."
    ],
    [
      "07",
      "A FEELING",
      "Sampai akhirnya ada sesuatu yang mulai terasa berbeda. Yang tadinya biasa saja, perlahan mulai jadi sesuatu yang ditunggu."
    ],
    [
      "08",
      "WAITING",
      "Mulai senang kalau ketemu. Mulai nunggu chat, nunggu kesempatan ngobrol, bahkan kadang cuma berharap bisa ketemu lagi."
    ],
    [
      "09",
      "REALIZING",
      "Mungkin dari sini kita mulai sadar. Kayaknya hubungan ini sudah nggak sesederhana teman satu organisasi."
    ],
    [
      "10",
      "LITTLE MOMENTS",
      "Bukan cuma tentang momen besar. Justru hal-hal kecil yang sederhana malah jadi bagian yang paling diingat."
    ],
    [
      "11",
      "UNPLANNED",
      "Nggak ada yang pernah merencanakan semuanya. Kita cuma menjalani hari seperti biasa, sampai akhirnya kedekatan itu tumbuh sendiri."
    ],
    [
      "12",
      "THIS FAR",
      "Kalau dipikir-pikir, lucu juga. Dari dua orang yang awalnya cuma saling kenal, akhirnya bisa sampai sedekat ini."
    ],
    [
      "13",
      "CINLOK",
      "Dan ternyata benar. Awalnya satu organisasi, sering ketemu, sering ngobrol, lalu... ujung-ujungnya cinlok. ♡"
    ],
    [
      "14",
      "ONE OF THE BEST",
      "Dari semua hal yang terjadi di organisasi itu, mungkin salah satu yang paling berkesan adalah kita bisa saling menemukan. Sesuatu yang awalnya nggak pernah direncanakan."
    ],
    [
      "15",
      "ABOUT US",
      "Mungkin cerita kita dimulai dari hal yang sederhana. Tapi siapa sangka, dari satu organisasi bisa lahir cerita tentang kita. Dan sampai sekarang, cerita itu masih terus berjalan. ♡"
    ]
  ];


  /*
    =========================
    PAGE ORDER
  =========================
  */

  pages.sort((a, b) => {
    const aNum = parseInt(
      a.className.match(/page(\d+)/)?.[1] || "0",
      10
    );

    const bNum = parseInt(
      b.className.match(/page(\d+)/)?.[1] || "0",
      10
    );

    return aNum - bNum;
  });


  pages.forEach((page, index) => {
    page.style.zIndex = String(30 - index);
  });


  /*
    =========================
    SCRAPBOOK
  =========================
  */

  function updateScrapbook(index, animate = true) {
    const data = scrapbookData[index];

    if (!data) {
      return;
    }

    if (!animate) {
      scrapNumber.textContent = data[0];
      scrapLabel.textContent = data[1];
      scrapQuote.textContent = data[2];
      return;
    }

    scrapQuote.classList.add("changing");

    setTimeout(() => {
      scrapNumber.textContent = data[0];
      scrapLabel.textContent = data[1];
      scrapQuote.textContent = data[2];

      scrapQuote.classList.remove("changing");
    }, 180);
  }


  /*
    =========================
    PAGE UPDATE
  =========================
  */

  function updatePages() {
    pages.forEach((page, index) => {
      page.classList.toggle(
        "flipped",
        index < currentPage
      );
    });

    updateScrapbook(
      Math.min(currentPage, 14),
      true
    );

    updateControls();

    if (currentPage >= 12) {
      createHearts(
        currentPage === pages.length
          ? 20
          : 5
      );
    }
  }


  /*
    =========================
    CONTROLS
  =========================
  */

  function updateControls() {
    if (pageNumber) {
      if (currentPage >= pages.length) {
        pageNumber.textContent = "END";
      } else {
        pageNumber.textContent =
          String(currentPage + 1).padStart(2, "0") +
          " / " +
          String(pages.length).padStart(2, "0");
      }
    }

    if (prevBtn) {
      prevBtn.disabled =
        !coverOpened ||
        currentPage === 0;

      prevBtn.style.opacity =
        prevBtn.disabled ? "0.4" : "1";
    }

    if (nextBtn) {
      nextBtn.disabled =
        !coverOpened ||
        currentPage >= pages.length;

      nextBtn.style.opacity =
        nextBtn.disabled ? "0.4" : "1";
    }
  }


  /*
    =========================
    COVER
  =========================
  */

  function openCover() {
    if (coverOpened) {
      return;
    }

    coverOpened = true;

    frontCover.classList.add("open");

    currentPage = 0;

    updatePages();

    fadeMusicIn();

    setTimeout(() => {
      createHearts(6);
    }, 600);
  }


  function closeCover() {
    if (
      !coverOpened ||
      currentPage !== 0
    ) {
      return;
    }

    coverOpened = false;

    frontCover.classList.remove("open");

    updateControls();
  }


  frontCover.addEventListener(
    "click",
    openCover
  );


  /*
    =========================
    NEXT PAGE
  =========================
  */

  function nextPage() {
    if (!coverOpened) {
      openCover();
      return;
    }

    if (currentPage >= pages.length) {
      return;
    }

    currentPage++;

    updatePages();

    if (currentPage === 13) {
      createHearts(12);
    }

    if (currentPage === 14) {
      createHearts(20);
    }

    if (currentPage === pages.length) {
      createHearts(30);

      setTimeout(() => {
        if (!secretShown) {
          showSecretEnding();
        }
      }, 1200);
    }
  }


  /*
    =========================
    PREVIOUS PAGE
  =========================
  */

  function previousPage() {
    if (!coverOpened) {
      return;
    }

    if (secretShown) {
      hideSecretEnding();
    }

    if (currentPage === 0) {
      closeCover();
      return;
    }

    currentPage--;

    updatePages();
  }


  nextBtn.addEventListener(
    "click",
    nextPage
  );

  prevBtn.addEventListener(
    "click",
    previousPage
  );


  /*
    =========================
    KEYBOARD
  =========================
  */

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "ArrowRight") {
        nextPage();
      }

      if (event.key === "ArrowLeft") {
        previousPage();
      }

      if (event.key === "Escape") {
        if (letterOpened) {
          closeLetter();
        }

        if (secretShown) {
          hideSecretEnding();
        }
      }
    }
  );


  /*
    =========================
    MUSIC
  =========================
  */

  function fadeMusicIn() {
    if (!bgMusic) {
      return;
    }

    clearInterval(musicFadeTimer);

    bgMusic.volume = 0;

    const playPromise = bgMusic.play();

    if (!playPromise) {
      return;
    }

    playPromise
      .then(() => {
        updateMusicButton(true);

        let volume = 0;

        musicFadeTimer = setInterval(() => {
          volume += 0.025;

          if (volume >= 0.35) {
            volume = 0.35;

            clearInterval(
              musicFadeTimer
            );
          }

          bgMusic.volume = volume;
        }, 80);
      })
      .catch(() => {
        updateMusicButton(false);
      });
  }


  function fadeMusicOut() {
    if (!bgMusic) {
      return;
    }

    clearInterval(musicFadeTimer);

    let volume = bgMusic.volume;

    musicFadeTimer = setInterval(() => {
      volume -= 0.04;

      if (volume <= 0) {
        volume = 0;

        clearInterval(
          musicFadeTimer
        );

        bgMusic.pause();

        updateMusicButton(false);

        return;
      }

      bgMusic.volume = volume;
    }, 70);
  }


  function toggleMusic() {
    if (!bgMusic) {
      return;
    }

    if (bgMusic.paused) {
      fadeMusicIn();
    } else {
      fadeMusicOut();
    }
  }


  function updateMusicButton(isPlaying) {
    if (!musicBtn) {
      return;
    }

    if (isPlaying) {
      musicBtn.classList.add("playing");
      musicBtn.textContent = "♫";
    } else {
      musicBtn.classList.remove("playing");
      musicBtn.textContent = "🔇";
    }
  }


  musicBtn.addEventListener(
    "click",
    (event) => {
      event.stopPropagation();
      toggleMusic();
    }
  );


  /*
    =========================
    LETTER
  =========================
  */

  function openLetter() {
    if (!letter) {
      return;
    }

    letterOpened = true;

    letter.classList.add("show");

    letterBtn.textContent =
      "Tutup surat ♡";

    createHearts(5);
  }


  function closeLetter() {
    if (!letter) {
      return;
    }

    letterOpened = false;

    letter.classList.remove("show");

    letterBtn.textContent =
      "Buka surat ♡";

    if (currentPage >= pages.length) {
      setTimeout(() => {
        if (!secretShown) {
          showSecretEnding();
        }
      }, 500);
    }
  }


  letterBtn.addEventListener(
    "click",
    (event) => {
      event.stopPropagation();

      if (letterOpened) {
        closeLetter();
      } else {
        openLetter();
      }
    }
  );


  /*
    =========================
    SECRET ENDING
  =========================
  */

  function getSecretEnding() {
    let ending =
      document.getElementById(
        "secretEnding"
      );

    if (ending) {
      return ending;
    }

    ending =
      document.createElement("div");

    ending.id = "secretEnding";
    ending.className =
      "secret-ending";

    ending.innerHTML = `
      <div class="secret-card">

        <div class="secret-small">
          A MEMORY WORTH KEEPING
        </div>

        <div class="secret-title">
          OUR DAY
        </div>

        <div class="secret-date">
          14 · 05 · 2025
        </div>

        <div class="secret-text">
          The day our story became ours.
        </div>

        <div class="secret-text">
          Dan sejak hari itu, kita mulai menulis
          cerita yang nggak pernah kita rencanakan.
        </div>

        <div class="secret-heart">
          ♡
        </div>

        <div class="secret-text">
          And somehow, we're still writing it.
        </div>

        <button
          class="secret-close"
          type="button"
        >
          Kembali ke cerita ♡
        </button>

      </div>
    `;

    document.body.appendChild(ending);

    const closeButton =
      ending.querySelector(
        ".secret-close"
      );

    closeButton.addEventListener(
      "click",
      hideSecretEnding
    );

    return ending;
  }


  function showSecretEnding() {
    const ending =
      getSecretEnding();

    secretShown = true;

    ending.classList.add("show");

    createHearts(35);
  }


  function hideSecretEnding() {
    const ending =
      document.getElementById(
        "secretEnding"
      );

    if (!ending) {
      return;
    }

    ending.classList.remove("show");

    secretShown = false;
  }


  /*
    =========================
    FLOATING HEARTS
  =========================
  */

  function createHearts(amount = 5) {
    if (!heartContainer) {
      return;
    }

    for (let i = 0; i < amount; i++) {
      const heart =
        document.createElement("span");

      heart.className =
        "floating-heart";

      heart.textContent =
        Math.random() > 0.5
          ? "♡"
          : "♥";

      heart.style.left =
        Math.random() * 100 + "%";

      heart.style.fontSize =
        12 +
        Math.random() * 16 +
        "px";

      heart.style.animationDuration =
        3.5 +
        Math.random() * 3 +
        "s";

      heart.style.animationDelay =
        Math.random() * 0.8 +
        "s";

      heartContainer.appendChild(
        heart
      );

      setTimeout(() => {
        heart.remove();
      }, 7500);
    }
  }


  /*
    =========================
    TOUCH / SWIPE
  =========================
  */

  let touchStartX = 0;
  let touchStartY = 0;

  book.addEventListener(
    "touchstart",
    (event) => {
      const touch =
        event.touches[0];

      if (!touch) {
        return;
      }

      touchStartX =
        touch.clientX;

      touchStartY =
        touch.clientY;
    },
    {
      passive: true
    }
  );


  book.addEventListener(
    "touchend",
    (event) => {
      const touch =
        event.changedTouches[0];

      if (!touch) {
        return;
      }

      const dx =
        touch.clientX -
        touchStartX;

      const dy =
        touch.clientY -
        touchStartY;

      if (
        Math.abs(dy) >
        Math.abs(dx)
      ) {
        return;
      }

      if (dx < -50) {
        nextPage();
      }

      if (dx > 50) {
        previousPage();
      }
    },
    {
      passive: true
    }
  );


  /*
    =========================
    INITIAL STATE
  =========================
  */

  updateScrapbook(
    0,
    false
  );

  updatePages();

  updateMusicButton(false);

  frontCover.classList.remove(
    "open"
  );

  if (letter) {
    letter.classList.remove(
      "show"
    );
  }
});