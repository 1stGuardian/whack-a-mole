if (!localStorage) {
  alert(
    'The browser does not support local storage, please use a browser that supports local storage such as Firefox and Google Chrome.'
  );
}

const bgm = new Audio('audio/bgm.mp3');
const whackSfx = new Audio('audio/pop.mp3');
const maskBgm = new Audio('audio/mask.mp3');

const startButton = document.getElementById('start');
const settingsButton = document.getElementById('settings');
const options = document.getElementById('options');
const bgmVolume = document.getElementById('bgm-volume');
const sfxVolume = document.getElementById('sfx-volume');
const difficultyInfo = document.getElementById('difficulty');
const saveButton = document.getElementById('save-button');
const extraMole = document.getElementById('extra-mole');

const init = () => {
  playBgm();
  setDifficultyInfo();
  setHighScoreInfo();
  setScoreInfo(0);
  if (!difficulty) showPopup();
};

const playBgm = () => {
  bgm.loop = true;
  bgm.play();
};

const showPopup = () => {
  const popup = document.getElementById('popup');
  const difficulties = document.querySelector('.difficulties');

  const addDifficultyClickHandler = (e) => {
    if (e.target.classList.contains('difficulty')) {
      setTimeout(() => {
        // Just delay
        setDifficulty(e.target.dataset.difficulty);

        localStorage.setItem('easy', 0);
        localStorage.setItem('medium', 0);
        localStorage.setItem('hard', 0);

        popup.classList.add('d-none');
        startButton.setAttribute('tabindex', '1');

        difficulties.removeEventListener('click', addDifficultyClickHandler);
      }, 250);
    }
  };

  popup.classList.remove('d-none');
  startButton.setAttribute('tabindex', '-1');
  difficulties.addEventListener('click', addDifficultyClickHandler);
};

const setDifficulty = (diff) => {
  difficulty = diff;
  localStorage.setItem('difficulty', difficulty);
  return setDifficultyInfo();
};

const setDifficultyInfo = () => {
  for (const child of difficultyInfo.children) {
    child.value === difficulty
      ? child.setAttribute('selected', '')
      : child.removeAttribute('selected');
  }
};

const setScore = (score) => {
  if (score > localStorage.getItem(difficulty)) {
    localStorage.setItem(difficulty, score);
    return setHighScoreInfo();
  }
};

const setScoreInfo = (score) => {
  document.getElementById('score').textContent = score;
};

const setHighScoreInfo = () => {
  const highScoreInfo = document.getElementById('high-score');
  const highScore = localStorage.getItem(difficulty) ?? 0;
  highScoreInfo.textContent = highScore;
};

const startCountdown = async () => {
  const countdown = document.getElementById('countdown');
  countdown.classList.remove('d-none');

  for (let i = 3; i >= 1; i--) {
    countdown.innerHTML = `<div class="countdown-container">${i}</div>`;
    whackSfx.play();
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  countdown.classList.add('d-none');
  countdown.innerHTML = '';
};

const getRandomDirt = () => {
  const dirts = [...document.querySelectorAll('.dirt')];
  const availableDirts = dirts.filter((dirt) => !dirt.dataset.isPrevious);
  const randomNum = Math.floor(Math.random() * availableDirts.length);
  const randomDirt = availableDirts[randomNum];

  if (prevDirt) prevDirt.dataset.isPrevious = '';
  prevDirt = randomDirt;
  prevDirt.dataset.isPrevious = true;

  return randomDirt;
};

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomMoleSpeed = () => {
  return getRandomInt(1, 10) / 10;
};

const getRandomMoleAppearTime = () => {
  const { min, max } = moleAppearTime[difficulty];
  return getRandomInt(min, max);
};

const showMole = () => {
  const randomDirt = getRandomDirt();
  const randomSpeed = getRandomMoleSpeed();
  const randomAppearTime = getRandomMoleAppearTime();
  const extraMoleChance = getRandomInt(0, 100);
  const zIndex =
    (difficulty === 'medium' && extraMoleChance > 75) ||
    (difficulty === 'hard' && extraMoleChance > 50)
      ? 667
      : 666;

  setMoleTransition(randomDirt, randomSpeed);
  randomDirt.classList.add('mole-show-up');

  // Mole show up duration calculated when the mole transition is complete, then i should add delay
  // Wait until transition end
  setTimeout(() => {
    // then
    // Change to second-mole if condition are met
    if (!extraMole.classList.contains('mole-show-up')) {
      randomDirt.lastElementChild.style.zIndex = zIndex;
    }

    // Wait until moleAppearTime finished
    setTimeout(() => {
      // then
      // Don't change to first-mole until first-mole's transition end
      setTimeout(() => {
        randomDirt.lastElementChild.style.zIndex = '666';
      }, randomSpeed * 1000);

      randomDirt.classList.remove('mole-show-up');
      if (isStarted) showMole();
    }, randomAppearTime);
  }, randomSpeed * 1000);
};

const handleMoleClick = (e) => {
  if (!isStarted) return;

  const mole = e.target;
  whackSfx.play();

  if (mole.classList.contains('second-mole')) {
    showExtraMole(e);
  }

  score++;
  setScoreInfo(score);

  mole.parentElement.firstElementChild.style.pointerEvents = 'none';
  mole.parentElement.lastElementChild.style.pointerEvents = 'none';
  setClickedMoleTransition(mole.parentElement);
  mole.parentElement.classList.remove('mole-show-up');
};

const showExtraMole = (e) => {
  document.addEventListener('mousemove', handleExtraMoleMovement);
  extraMole.classList.remove('mole-hidden');
  extraMole.classList.add('mole-show-up');
  e.target.style.zIndex = '666';
  maskBgm.loop = true;
  maskBgm.play();
  setTimeout(hideExtraMole, 5000);
};

const hideExtraMole = () => {
  extraMole.classList.remove('mole-show-up');
  extraMole.classList.add('mole-hidden');
  maskBgm.pause();
};

const handleExtraMoleMovement = (e) => {
  if (extraMole.classList.contains('mole-show-up')) {
    // setTimeout(() => {
    if (innerWidth < 576) {
      extraMole.style.left = `${e.clientX - 50}px`;
      extraMole.style.bottom = `${0 - e.clientY + 555}px`;
    } else {
      extraMole.style.left = `${e.clientX - 200}px`;
    }
    // }, 500);
  }
};

const setMoleTransition = (dirt, duration) => {
  dirt.firstElementChild.style.transition = `top ${duration}s ease-in`;
  dirt.lastElementChild.style.transition = `top ${duration}s ease-in`;
  dirt.firstElementChild.style.pointerEvents = 'auto';
  dirt.lastElementChild.style.pointerEvents = 'auto';
};

const setClickedMoleTransition = (dirt) => {
  dirt.firstElementChild.style.transition = `top 0.1s ease-out`;
  dirt.lastElementChild.style.transition = `top 0.1s ease-out`;
};

const setMoleClickListener = () => {
  const moles = [...document.querySelectorAll('.mole')];
  for (const mole of moles) {
    mole.addEventListener('click', handleMoleClick);
  }
};

const startGame = () => {
  isStarted = true;
  score = 0;
  setScoreInfo(score);
  setTimeout(async () => {
    // Just delay
    startButton.classList.add('d-none');
    settingsButton.classList.add('d-none');
    await startCountdown();

    setTimeout(() => {
      endGame();
    }, playTime);

    setMoleClickListener();
    showMole();
  }, 250);
};

const endGame = () => {
  isStarted = false;
  setScore(score);
  startButton.classList.remove('d-none');
  settingsButton.classList.remove('d-none');
};

// Main config

const playTime = 1000 * 60; // 1s (1000 ms) * 60s = 1 minute
const moleAppearTime = {
  // Mole appear time (doesn't include transition's time)
  easy: {
    min: 750,
    max: 1250,
  },
  medium: {
    min: 500,
    max: 750,
  },
  hard: {
    min: 250,
    max: 500,
  },
};

// Main program

let difficulty = localStorage.getItem('difficulty');
let isStarted = false;
let score = 0;
let prevDirt = null;

init();

settingsButton.addEventListener('click', () => {
  options.classList.remove('d-none');
});

bgmVolume.addEventListener('input', () => {
  bgmVolume.setAttribute('title', bgmVolume.value);
  bgm.volume = bgmVolume.value / 100;
});

sfxVolume.addEventListener('change', () => {
  sfxVolume.setAttribute('title', sfxVolume.value);
  whackSfx.volume = sfxVolume.value / 100;
  whackSfx.play();
});

difficultyInfo.addEventListener('change', () => {
  setDifficulty(difficultyInfo.value);
  setHighScoreInfo();
});

saveButton.addEventListener('click', () => {
  options.classList.add('d-none');
});

startButton.addEventListener('click', startGame);
