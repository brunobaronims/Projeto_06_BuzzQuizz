load();

async function getQuizzes() {
  try {
    const response = await axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes');
    return response.data;
  } catch (error) {
    console.error('Não foi possível resgatar os quizzes: ', error);
    return;
  }
}

async function renderQuiz(data) {
  const list = document.querySelector('.Quiz-container');

  data.forEach(quiz => {
    const children = [Object.assign(document.createElement('img'), { src: `${quiz.image}` }),
    Object.assign(document.createElement('div'), { className: 'gradient' }),
    Object.assign(document.createElement('div'), { className: 'text-card' })];
    const quizTemplate = Object.assign(document.createElement('div'), { className: 'Quiz-item' });
    quizTemplate.setAttribute('onclick', 'quizListClick()');
    children[2].appendChild(Object.assign(document.createElement('p'), { innerHTML: `${quiz.title}` }));
    children.forEach(Child => {
      quizTemplate.appendChild(Child);
    })
    list.appendChild(quizTemplate);
  });
}

function quizListClick() {
  const list = Array.from(document.querySelectorAll('.page'));
  const quizPage = document.querySelector('.quiz-page');
  list.forEach(page => {
    page.classList.remove('visible');
    page.classList.add('hidden');
  });
  setTimeout(() => {
    quizPage.classList.remove('hidden');
    quizPage.classList.add('visible');
  }, 500);
}

function createQuizClick() {
  const list = Array.from(document.querySelectorAll('.page'));
  const createQuizPage = document.querySelector('.quiz-creation');
  list.forEach(page => {
    page.classList.remove('visible');
    page.classList.add('hidden');
  });
  setTimeout(() => {
    createQuizPage.classList.remove('hidden');
    createQuizPage.classList.add('visible');
  }, 500);
}

async function load() {
  const data = await getQuizzes();
  renderQuiz(data);
}

function answerClick(event) {
  const divClass = Array.from(event.parentElement.classList)[1];
  const answers = Array.from(document.querySelectorAll(`.${divClass}`));
  const clickedDiv = event.parentElement;
  answers.forEach(answer => {
    const children = answer.children;
    Array.from(children).forEach(child => {
      child.removeAttribute('onclick');
    });
    answer.classList.add('bloco-translucido', 'resposta-errada');
  });
  clickedDiv.classList.remove('bloco-translucido', 'resposta-errada');
  clickedDiv.classList.add('resposta-certa');
  const nextQuestion = clickedDiv.parentElement.parentElement.nextElementSibling;
  if (nextQuestion) {
    setTimeout(() => {
      nextQuestion.scrollIntoView({ behavior: 'smooth' });
    }, 2000);
  }
}


let pontuacao = 0;

const verificaSeEhOcerto = (quadroselecionado) => {
  if (quadroselecionado.isCorrectAnswer == true) {
    pontuacao += 1;
  }
  if (pontuacao == 0) return "nivel 1"
  if (pontuacao == 1) return "nivel 2"
  if (pontuacao == 3) return "nivel 3"
};