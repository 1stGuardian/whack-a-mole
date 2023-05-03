if (!localStorage) {
  alert(
    'The browser does not support local storage, please use a browser that supports local storage such as Firefox and Google Chrome.'
  );
}

const popup = document.getElementById('popup');
const dirts = document.querySelectorAll('.dirt');
const moles = document.querySelectorAll('.mole');
let difficulty = localStorage.getItem('difficulty');

const setDifficulty = (diff) => {
  difficulty = diff;
  localStorage.setItem('difficulty', difficulty);
  return setDifficultyInfo();
};

const setDifficultyInfo = () => {
  const difficultyInfo = document.getElementById('difficulty');
  difficultyInfo.textContent = difficulty ?? 'easy';
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

const setDelay = (delay) => {
  return new Promise((resolve) => setTimeout(() => resolve(), delay));
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

const getRandomMoleSpeed = () => {
  const speed = Math.random();
  return speed > 0.1 ? speed : getRandomMoleSpeed();
};

const getRandomMoleAppearTime = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const showMole = async () => {
  const randomDirt = getRandomDirt(prevDirt);
  const randomSpeed = getRandomMoleSpeed();
  const randomTime = getRandomMoleAppearTime(300, 1000);
  prevDirt = randomDirt;

  randomDirt.firstElementChild.style.transition = `top ${randomSpeed}s ease-in`;
  randomDirt.firstElementChild.style.pointerEvents = 'auto';
  randomDirt.dataset.isPrevious = 'yes';
  randomDirt.classList.add('mole-show-up');

  await setDelay(randomSpeed * 1000);
  setTimeout(() => {
    randomDirt.classList.remove('mole-show-up');
    randomDirt.firstElementChild.style.pointerEvents = 'auto';
    if (isStarted) showMole();
  }, randomTime);
};

// First load
setDifficultyInfo();
setHighScoreInfo();
setScoreInfo(0);

// If difficulty not set (first time access)
if (!difficulty) {
  const difficulties = document.querySelector('.difficulties');
  popup.classList.remove('d-none');

  difficulties.addEventListener('click', async function (e) {
    if (e.target.tagName === 'H3') {
      await setDelay(250);
      setDifficulty(e.target.parentElement.dataset.difficulty);

      localStorage.setItem('easy', 0);
      localStorage.setItem('medium', 0);
      localStorage.setItem('hard', 0);

      popup.classList.add('d-none');
    }
  });
}

const startButton = document.getElementById('start');
let isStarted = false;
let score = 0;
let prevDirt = null;

startButton.addEventListener('click', async function () {
  isStarted = true;
  score = 0;
  setScoreInfo(score);
  await setDelay(250);
  startButton.classList.add('d-none');
  await startCountdown();
  setTimeout(() => {
    isStarted = false;
    setScore(score);
    startButton.classList.remove('d-none');
  }, 15000);
  showMole();
});

for (const mole of moles) {
  mole.addEventListener('click', function () {
    if (isStarted) {
      score++;
      setScoreInfo(score);

      this.style.transition = `top 0.1s ease-out`;
      this.parentElement.classList.remove('mole-show-up');
      this.style.pointerEvents = 'none';
    }
  });
}
