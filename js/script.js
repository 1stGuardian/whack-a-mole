if (!localStorage) {
  alert(
    'The browser does not support local storage, please use a browser that supports local storage such as Firefox and Google Chrome.'
  );
}

const popup = document.getElementById('popup');

if (!localStorage.getItem('difficulty')) {
  const difficulties = document.querySelector('.difficulties');
  popup.classList.remove('d-none');

  difficulties.addEventListener('click', function (e) {
    if (e.target.tagName === 'H3') {
      localStorage.setItem(
        'difficulty',
        e.target.parentElement.dataset.difficulty
      );
      localStorage.setItem('easy', 0);
      localStorage.setItem('medium', 0);
      localStorage.setItem('hard', 0);

      popup.classList.add('d-none');
    }
  });
}
