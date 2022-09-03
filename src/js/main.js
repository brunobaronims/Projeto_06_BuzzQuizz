const Quizzes = (function () {
  let quizList;

  async function getQuizzes() {
    try {
      const response = await axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes');
      return await response.data;
    } catch (error) {
      console.error('Não foi possível resgatar os quizzes: ', error);
      return;
    }
  };

  return {
    load() {
      quizList = getQuizzes();
    },

    data() {
      return quizList;
    },
  };
})();

const Nivel = ( function () { 
  let atual = 0;

  return {
    acerto() {
      atual++;
    },

    valor() {
      return atual;
    }
  }
})();

async function renderQuizList(promise) {
  const list = document.querySelector('.Quiz-container');
  const data = await promise;
  console.log(data);

  data.forEach(quiz => {
    const quizTemplate = Object.assign(document.createElement('div'), { className: 'Quiz-item', id: `${quiz.id}` });
    const children = [Object.assign(document.createElement('img'), { src: `${quiz.image}` }),
    Object.assign(document.createElement('div'), { className: 'gradient' }),
    Object.assign(document.createElement('div'), { className: 'text-card' })];
    quizTemplate.setAttribute('onclick', 'quizListClick(this)');
    children[2].appendChild(Object.assign(document.createElement('p'), { innerHTML: `${quiz.title}` }));
    children.forEach(Child => {
      quizTemplate.appendChild(Child);
    });
    list.appendChild(quizTemplate);
  });
};

async function renderQuiz(promise, id) {
  const data = await promise;
  const headerImage = document.querySelector('.Quizz-header').querySelector('img');
  const headerTitle = document.querySelector('.Quizz-header').querySelector('h1');
  const list = document.querySelector('.quizz-box');
  const currentQuiz = data.find(element => element.id === Number(id));

  headerImage.setAttribute('src', `${currentQuiz.image}`);
  headerTitle.innerHTML = currentQuiz.title;

  currentQuiz.questions.forEach((question, index) => {
    const div = Object.assign(document.createElement('div'), { className: `pergunta${index}` });
    const tags = ['img', 'p'];
    const respostas = question.answers;

    div.appendChild(
      Object.assign(document.createElement('div'), { className: 'titulo-pergunta' })
    );
    div.querySelector('.titulo-pergunta').appendChild(
      Object.assign(document.createElement('div'), { className: 'quizz-pergunta' })
    );
    div.querySelector('.quizz-pergunta').appendChild(
      Object.assign(document.createElement('h2'), { innerHTML: `${question.title}` })
    );
    div.appendChild(
      Object.assign(document.createElement('div'), { className: 'respostas' })
    );

    respostas.forEach((answer, step) => {
      div.querySelector('.respostas').appendChild(
        Object.assign(document.createElement('div'), { className: `bloco r${step} b${index}` })
      );
    });

    let blockList = div.querySelectorAll(`.b${index}`);
    blockList.forEach((block, step) => {
      tags.forEach(tag => {
        block.appendChild(document.createElement(`${tag}`));
        block.lastChild.setAttribute('onclick', `answerClick(this, ${id})`);
      });
      block.querySelector('img').classList.add(`board`);
      block.querySelector('img').setAttribute('src', respostas[step].image);
      block.querySelector('p').classList.add('p-resposta');
      block.querySelector('p').innerHTML = respostas[step].text;
    });

    list.appendChild(div);
  });
}

function quizListClick(target) {
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
  renderQuiz(Quizzes.data(), target.id);
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

async function answerClick(target, id) {
  const data = await Quizzes.data();
  const divClass = target.parentElement.classList[2];
  const answers = Array.from(document.querySelectorAll(`.${divClass}`));
  const clickedDiv = target.parentElement;
  const questionDiv = clickedDiv.parentElement.parentElement;
  const questionNumber = questionDiv.className.charAt(questionDiv.className.length - 1);
  const nextQuestion = questionDiv.nextElementSibling;
  const currentQuiz = data.find(element => element.id === Number(id));

  answers.forEach(answer => {
    const answerIndex = answer.classList[1].charAt(answer.classList[1].length - 1);

    if (currentQuiz.questions[questionNumber].answers[answerIndex].isCorrectAnswer) {
      answer.classList.add('resposta-certa');
    } else {
      answer.classList.add('resposta-errada');
    };

    const children = answer.children;
    Array.from(children).forEach(child => {
      child.removeAttribute('onclick');
    });

    answer.classList.add('bloco-translucido');
  });

  clickedDiv.classList.remove('bloco-translucido');

  if (nextQuestion) {
    Nivel.acerto();
    setTimeout(() => {
      nextQuestion.scrollIntoView({ behavior: 'smooth' });
    }, 2000);
  } else {
    const quizEnd = document.querySelector('.quiz-end');
    const acertos = Nivel.valor();
    const porcentagem = Math.round((acertos / currentQuiz.questions.length) * 100);
    const sortedLevels = currentQuiz.levels.sort((a,b) => parseFloat(b.minValue) - parseFloat(a.minValue));
    const finalLevel = sortedLevels.find(element => element.minValue <= porcentagem);
    console.log(finalLevel);
    quizEnd.querySelector('h2').innerHTML = finalLevel.title;
    //quizEnd.querySelector('.image-container').appendChild();
    quizEnd.classList.add('visible');
    quizEnd.classList.remove('hidden');
  };
}

Quizzes.load();
renderQuizList(Quizzes.data());
