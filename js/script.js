if (!localStorage) {
  alert(
    'The browser does not support local storage, please use a browser that supports local storage such as Firefox and Google Chrome.'
  );
}

const bgm = new Audio('audio/bgm.mp3');
const whackSfx = new Audio('audio/pop.mp3');
const maskBgm = new Audio('audio/mask.mp3');
const popup = document.getElementById('popup');
const settingsButton = document.getElementById('settings');
const options = document.getElementById('options');
const bgmVolume = document.getElementById('bgm-volume');
const sfxVolume = document.getElementById('sfx-volume');
const saveButton = document.getElementById('save-button');
const startButton = document.getElementById('start');
const difficultyInfo = document.getElementById('difficulty');
const extraMole = document.getElementById('extra-mole');
const dirts = document.querySelectorAll('.dirt');
const moles = document.querySelectorAll('.mole');
const playTime = 1000 * 60;
let difficulty = localStorage.getItem('difficulty');

settingsButton.addEventListener('click', function () {
  options.classList.remove('d-none');
});

saveButton.addEventListener('click', function () {
  options.classList.add('d-none');
});

bgmVolume.addEventListener('input', function () {
  bgmVolume.setAttribute('title', bgmVolume.value);
  bgm.volume = bgmVolume.value / 100;
});

sfxVolume.addEventListener('change', function () {
  sfxVolume.setAttribute('title', sfxVolume.value);
  whackSfx.volume = sfxVolume.value / 100;
  whackSfx.play();
});

const setDifficulty = (diff) => {
  difficulty = diff;
  localStorage.setItem('difficulty', difficulty);
  return setDifficultyInfo();
};

const setDifficultyInfo = () => {
  for (const child of difficultyInfo.children) {
    if (child.value === difficulty) {
      return child.setAttribute('selected', '');
    }
    child.removeAttribute('selected');
  }
};

const setScore = (score) => {
  if (score > localStorage.getItem(difficulty)) {
    localStorage.setItem(difficulty, score);
    return setHighScoreInfo();
  }
};

const setScoreInfo = (score) => {
  const scoreInfo = document.getElementById('score');
  scoreInfo.textContent = score;
};

const setHighScoreInfo = () => {
  const highScoreInfo = document.getElementById('high-score');
  const highScore = localStorage.getItem(difficulty) ?? 0;
  highScoreInfo.textContent = highScore;
};

const startCountdown = () => {
  return new Promise((resolve) => {
    let int = 3;
    const countdown = document.getElementById('countdown');
    countdown.innerHTML = '';
    countdown.classList.remove('d-none');

    const interval = setInterval(() => {
      if (int === 0) {
        clearInterval(interval);
        countdown.classList.add('d-none');
        countdown.innerHTML = '';
        resolve();
      }
      countdown.innerHTML = `<div class="countdown-container">${int}</div>`;
      int--;
    }, 1000);
  });
};

const getRandomDirt = (prevDirt) => {
  const randomNum = Math.floor(Math.random() * dirts.length);

  if (dirts[randomNum].dataset.isPrevious) {
    return getRandomDirt(prevDirt);
  }

  if (prevDirt) prevDirt.dataset.isPrevious = '';

  return dirts[randomNum];
};

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomMoleSpeed = () => {
  return getRandomInt(1, 10) / 10;
};

const getRandomMoleAppearTime = () => {
  let min, max;

  if (difficulty === 'easy') {
    min = 1000;
    max = 1500;
  } else if (difficulty === 'medium') {
    min = 750;
    max = 1000;
  } else if (difficulty === 'hard') {
    min = 500;
    max = 750;
  }

  return getRandomInt(min, max);
};

const showMole = (isExtra) => {
  const randomDirt = getRandomDirt(prevDirt);
  const randomSpeed = getRandomMoleSpeed();
  const randomAppearTime = getRandomMoleAppearTime();
  const chance = getRandomInt(0, 100);
  prevDirt = randomDirt;
  console.log(randomDirt, randomSpeed, randomAppearTime, chance);

  randomDirt.firstElementChild.style.transition = `top ${randomSpeed}s ease-in`;
  randomDirt.lastElementChild.style.transition = `top ${randomSpeed}s ease-in`;
  randomDirt.firstElementChild.style.pointerEvents = 'auto';
  randomDirt.lastElementChild.style.pointerEvents = 'auto';
  randomDirt.dataset.isPrevious = 'yes';
  randomDirt.classList.add('mole-show-up');

  setTimeout(() => {
    if (difficulty === 'medium') {
      if (chance > 75) {
        randomDirt.lastElementChild.style.zIndex = '667';
      }
    } else if (difficulty === 'hard') {
      if (chance > 50) {
        randomDirt.lastElementChild.style.zIndex = '667';
      }
    }

    setTimeout(() => {
      randomDirt.classList.remove('mole-show-up');
      randomDirt.lastElementChild.style.zIndex = '666';
      if (isStarted && !isExtra) showMole();
    }, randomAppearTime);
  }, randomSpeed * 1000);
};

// First load
bgm.loop = true;
bgm.play();
setDifficultyInfo();
setHighScoreInfo();
setScoreInfo(0);

// If difficulty not set (first time access)
if (!difficulty) {
  const difficulties = document.querySelector('.difficulties');
  popup.classList.remove('d-none');
  startButton.setAttribute('tabindex', '-1');

  difficulties.addEventListener('click', async function (e) {
    console.log(e);
    if (e.target.classList.contains('difficulty')) {
      setTimeout(() => {
        setDifficulty(e.target.dataset.difficulty);

        localStorage.setItem('easy', 0);
        localStorage.setItem('medium', 0);
        localStorage.setItem('hard', 0);

        popup.classList.add('d-none');
        startButton.setAttribute('tabindex', '1');
      }, 250);
    }
  });
}

difficultyInfo.addEventListener('change', function () {
  setDifficulty(difficultyInfo.value);
});

let isStarted = false;
let score = 0;
let prevDirt = null;

startButton.addEventListener('click', async function () {
  isStarted = true;
  score = 0;
  setScoreInfo(score);
  setTimeout(async () => {
    startButton.classList.add('d-none');
    await startCountdown();
    setTimeout(() => {
      isStarted = false;
      setScore(score);
      startButton.classList.remove('d-none');
    }, playTime);
    showMole();
  }, 250);
});

for (const mole of moles) {
  mole.addEventListener('click', function () {
    if (isStarted) {
      whackSfx.play();

      if (this.classList.contains('second-mole')) {
        extraMole.classList.remove('mole-hidden');
        extraMole.classList.add('mole-show-up');
        this.style.zIndex = '666';
        maskBgm.loop = true;
        maskBgm.play();
        setTimeout(() => {
          extraMole.classList.remove('mole-show-up');
          extraMole.classList.add('mole-hidden');
          maskBgm.pause();
        }, 5000);
      }
      score++;
      setScoreInfo(score);
      this.style.pointerEvents = 'none';

      this.parentElement.firstElementChild.style.transition = `top 0.1s ease-out`;
      this.parentElement.lastElementChild.style.transition = `top 0.1s ease-out`;
      this.parentElement.classList.remove('mole-show-up');
    }
  });
}

document.addEventListener('mousemove', async function (e) {
  if (extraMole.classList.contains('mole-show-up')) {
    // setTimeout(() => {
    extraMole.style.left = `${e.clientX - 200}px`;
    // }, 500);
  }
});
