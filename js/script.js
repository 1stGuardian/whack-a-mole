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

const showMole = (dirts) => {
  console.log(dirts);
};

// First time
if (!localStorage.getItem('difficulty')) {
  const difficulties = document.querySelector('.difficulties');
  popup.classList.remove('d-none');

  difficulties.addEventListener('click', function (e) {
    if (e.target.tagName === 'H3') {
      setDifficulty(e.target.parentElement.dataset.difficulty);

      localStorage.setItem('easy', 0);
      localStorage.setItem('medium', 0);
      localStorage.setItem('hard', 0);

      popup.classList.add('d-none');
    }
  });
}

showMole(dirts);
