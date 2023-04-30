if (!localStorage) {
  alert(
    'The browser does not support local storage, please use a browser that supports local storage such as Firefox and Google Chrome.'
  );
}

const popup = document.getElementById('popup');
const dirts = document.querySelectorAll('.dirt');
const moles = document.querySelectorAll('.mole');

const setDifficulty = (difficulty) => {
  const difficultyInfo = document.getElementById('difficulty');

  localStorage.setItem('difficulty', difficulty);
  difficultyInfo.textContent = difficulty;
};

const setScore = (score) => {
  const difficulty = localStorage.getItem('difficulty');
  localStorage.setItem(difficulty, score);
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

const getRandomTime = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomMoleSpeed = (min, max) => getRandomTime(min, max);

const getRandomMoleAppearTime = (min, max) => getRandomTime(min, max);

const showMole = () => {
  const randomDirt = getRandomDirt(prevDirt);
  const randomSpeed = getRandomMoleSpeed(0.5, 1);
  const randomTime = getRandomMoleAppearTime(750, 1500);
  prevDirt = randomDirt;

  randomDirt.style.transition = `top ${randomSpeed}s ease-in`;
  randomDirt.dataset.isPrevious = 'yes';
  randomDirt.classList.add('mole-show-up');
  console.log(randomDirt, randomSpeed, randomTime);
  setTimeout(() => {
    randomDirt.classList.remove('mole-show-up');
    if (isStarted) showMole();
  }, randomTime);
};

// First time
if (!localStorage.getItem('difficulty')) {
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
  await setDelay(250);
  startButton.classList.add('d-none');
  await startCountdown();
  setTimeout(() => {
    isStarted = false;
    startButton.classList.remove('d-none');
  }, 15000);
  showMole();
});
