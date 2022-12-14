const newQuiz = (function () {
  let data = { title: "", image: "", questions: [], levels: [] };
  let failsafe = false;

  return {
    addTitle(input) {
      data.title = input;
    },

    addImage(input) {
      data.image = input;
    },

    questionsNumber(input) {
      data.questions.length = input;
      data.questions.fill(null);
    },

    setQuestions(input) {
      data.questions = input;
    },

    levelsNumber(input) {
      data.levels.length = input;
      data.levels.fill(null);
    },
    setLevels(input) {
      data.levels.push(input);
    },
    resetLevels() {
      data.levels = [];
    },
    reset() {
      data = { title: "", image: "", questions: [], levels: [] };
    },

    data() {
      return data;
    },

    setFailsafe() {
      failsafe = true;
    },

    removeFailsafe() {
      failsafe = false;
    },

    failsafe() {
      return failsafe;
    }
  };
})();

const Quizzes = (function () {
  let quizList;

  async function getQuizzes() {
    try {
      const response = await axios.get(
        "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes"
      );
      return await response.data;
    } catch (error) {
      console.error("Não foi possível resgatar os quizzes: ", error);
      return;
    }
  }

  return {
    load() {
      quizList = getQuizzes();
    },

    data() {
      return quizList;
    }
  };
})();

const Nivel = (function () {
  let atual = 0;

  return {
    acerto() {
      atual++;
    },

    valor() {
      return atual;
    },

    reset() {
      atual = 0;
    },
  };
})();

Quizzes.load();
renderQuizList(Quizzes.data());


async function renderQuizList(promise) {
  const data = await promise;

  data.forEach((quiz) => {
    addQuizToList(quiz);
  });
}

function addQuizToList(quiz) {
  const serverList = document.querySelector(".Quiz-container");
  const emptyList = document.querySelector('.createQuizzBox');
  const userList = document.querySelector('.newquiz-content');

  const quizTemplate = Object.assign(document.createElement("div"), {
    className: "Quiz-item",
    id: `${quiz.id}`
  });
  quizTemplate.setAttribute("onclick", "quizListClick(this)");
  quizTemplate.setAttribute('data-identifier', 'quizz-card');

  const children = [
    Object.assign(document.createElement("img"), { src: `${quiz.image}` }),
    Object.assign(document.createElement("div"), { className: "gradient" }),
    Object.assign(document.createElement("div"), { className: "text-card" }),
  ];

  children[2].appendChild(
    Object.assign(document.createElement("p"), { innerHTML: `${quiz.title}` })
  );
  children.forEach((Child) => {
    quizTemplate.appendChild(Child);
  });
  if (localStorage.getItem(quiz.id)) {
    emptyList.setAttribute('class', 'createQuizzBox hidden');
    userList.querySelector('.seus-novos-quizzes').setAttribute('class', 'seus-novos-quizzes visible');
    userList.querySelector('.user-quizzes').appendChild(quizTemplate);
  } else {
    serverList.appendChild(quizTemplate);
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

async function renderQuiz(promise, id) {
  const data = await promise;
  const headerImage = document
    .querySelector(".Quizz-header")
    .querySelector("img");
  const headerTitle = document
    .querySelector(".Quizz-header")
    .querySelector("h1");
  const list = document.querySelector(".quizz-box");
  const currentQuiz = data.find((element) => element.id === Number(id));

  headerImage.setAttribute("src", `${currentQuiz.image}`);
  headerTitle.innerHTML = currentQuiz.title;

  currentQuiz.questions.forEach((question, index) => {
    const div = Object.assign(document.createElement("div"), {
      className: `pergunta${index}`,
    });
    div.setAttribute('data-identifier', 'question');
    const tags = ["img", "p"];
    const respostas = question.answers;
    shuffleArray(respostas);

    div.appendChild(
      Object.assign(document.createElement("div"), {
        className: "titulo-pergunta",
      })
    );

    div.querySelector(".titulo-pergunta").appendChild(
      Object.assign(document.createElement("div"), {
        className: "quizz-pergunta",
      })
    );

    div.querySelector('.quizz-pergunta').style.backgroundColor = `${question.color}`
    div.querySelector(".quizz-pergunta").appendChild(
      Object.assign(document.createElement("h2"), {
        innerHTML: `${question.title}`,
      })
    );
    div.appendChild(
      Object.assign(document.createElement("div"), { className: "respostas" })
    );

    respostas.forEach((answer, step) => {
      div.querySelector(".respostas").appendChild(
        Object.assign(document.createElement("div"), {
          className: `bloco r${step} b${index}`,
        })
      );
    });

    let blockList = div.querySelectorAll(`.b${index}`);
    blockList.forEach((block, step) => {
      tags.forEach((tag) => {
        block.appendChild(document.createElement(`${tag}`));
        block.lastChild.setAttribute("onclick", `answerClick(this, ${id})`);
      });
      block.setAttribute('data-identifier', 'answer');
      block.querySelector("img").classList.add(`board`);
      block.querySelector("img").setAttribute("src", respostas[step].image);
      block.querySelector("p").classList.add("p-resposta");
      block.querySelector("p").innerHTML = respostas[step].text;
    });

    list.appendChild(div);
  });
}

function quizListClick(target) {
  const mainPage = document.querySelector('.mainPage');
  const quizPage = document.querySelector(".quiz-page");
  document
    .querySelector(".resultado-final-do-quizz")
    .querySelector(".Prosseguir-para-perguntas")
    .setAttribute("onclick", `resetQuiz(${target.id})`);

  mainPage.setAttribute('class', 'mainPage hidden');

  setTimeout(() => {
    quizPage.setAttribute('class', 'quiz-page visible');
  }, 500);
  renderQuiz(Quizzes.data(), target.id);
}

function createQuizClick() {
  const mainPage = document.querySelector('.mainPage');
  const createQuizPage = document.querySelector(".tela-de-criacao-do-quiz");
  mainPage.setAttribute('class', 'mainPage hidden');
  setTimeout(() => {
    createQuizPage.setAttribute('class', 'tela-de-criacao-do-quiz visible');
  }, 500);
}

function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

function isNumeric(str) {
  if (typeof str != "string") {
    return false;
  }
  return !isNaN(str) && !isNaN(parseFloat(str));
}

function validateInfo(title, image, questions, levels) {
  if (title.length < 20 || title.length > 65) {
    alert("Título deve ter enter 20 e 65 caracteres");
    return false;
  } else if (!isValidHttpUrl(image)) {
    alert("Imagem deve ter URL válido");
    return false;
  } else if (
    !isNumeric(questions) ||
    questions < 3 ||
    !Number.isInteger(Number(questions))
  ) {
    alert("Quiz deve ter no mínimo 3 perguntas (apenas números inteiros)");
    return false;
  } else if (
    !isNumeric(levels) ||
    levels < 2 ||
    !Number.isInteger(Number(levels))
  ) {
    alert("Quiz deve ter no mínimo 2 níveis (apenas números inteiros)");
    return false;
  } else {
    return true;
  }
}

function moveToQuestions() {
  const info = Array.from(document.querySelector(".Monte-seu-quizz").children);
  const title = info[0].querySelector("input").value;
  const image = info[1].querySelector("input").value;
  const questions = info[2].querySelector("input").value;
  const levels = info[3].querySelector("input").value;

  if (!info.find((input) => input.querySelector("input").value === "")) {
    if (validateInfo(title, image, questions, levels)) {
      newQuiz.addTitle(title);
      newQuiz.addImage(image);
      newQuiz.questionsNumber(questions);
      newQuiz.levelsNumber(levels);

      const infoPage = document.querySelector(".tela-de-criacao-do-quiz");
      const questionsPage = document.querySelector(".crie-suas-perguntas");
      renderQuestions();
      infoPage.setAttribute('class', 'tela-de-criacao-do-quiz hidden');
      setTimeout(() => {
        questionsPage.setAttribute('class', 'crie-suas-perguntas visible');
      }, 200);
    }
  } else {
    alert("Obrigatório preencher todos os campos!");
  }
}

function validateQuestions() {
  const questions = Array.from(document.querySelector(".Perguntas").children);
  const reg = /^#[0-9A-F]{6}$/i;
  const error = [];
  const values = [];

  questions.forEach((question) => {
    const object = { title: "", color: "", answers: [] };
    const divs = Array.from(question.querySelectorAll("div"));
    const questionTitle = Array.from(divs[0].children);
    const correctAnswer = Array.from(divs[1].children);
    const wrongAnswers = Array.from(divs[2].children);
    let atLeastOneAnswer = false;

    if (
      questionTitle[0].value === "" ||
      questionTitle[0].value.length < 20 ||
      questionTitle[0].value.length > 65
    ) {
      error.push("error");
    } else {
      object.title = questionTitle[0].value;
    }

    if (!reg.test(`${questionTitle[1].value}`)) {
      error.push("error");
    } else {
      object.color = questionTitle[1].value;
    }

    if (
      correctAnswer[0].value === "" ||
      !isValidHttpUrl(correctAnswer[1].value)
    ) {
      error.push("error");
    } else {
      const correctAnsObj = {
        text: `${correctAnswer[0].value}`,
        image: `${correctAnswer[1].value}`,
        isCorrectAnswer: true,
      };
      object.answers.push(correctAnsObj);
    }

    wrongAnswers.forEach((answer) => {
      if (
        answer.firstElementChild.value !== "" &&
        isValidHttpUrl(answer.lastElementChild.value)
      ) {
        atLeastOneAnswer = true;
        let wrongAnsObj = {
          text: `${answer.firstElementChild.value}`,
          image: `${answer.lastElementChild.value}`,
          isCorrectAnswer: false,
        };
        object.answers.push(wrongAnsObj);
      }
    });
    if (!atLeastOneAnswer) {
      error.push("error");
    }
    values.push(object);
  });

  if (error.length > 0) {
    return false;
  } else {
    return values;
  }
}

function moveToLevels() {
  newQuiz.removeFailsafe();
  const values = validateQuestions();
  if (values) {
    newQuiz.setQuestions(values);
    const firstPage = document.querySelector(".crie-suas-perguntas");
    const nextPage = document.querySelector(".agora-decida-os-niveis");
    const div = document.querySelector(".qtd-de-niveis-do-quizz");
    const niveis = Number(div.querySelector("input").value);
    firstPage.setAttribute('class', 'crie-suas-perguntas hidden');

    setTimeout(() => {
      nextPage.setAttribute('class', 'agora-decida-os-niveis visible');
    }, 500);
    questionsList(niveis);
  } else {
    alert('Algum campo está incorreto!');
  }
}

function renderQuestions() {
  const questionsPage = document.querySelector(".Perguntas");
  const questions = newQuiz.data().questions;
  questions.forEach((question, index) => {
    const newQuestion = Object.assign(document.createElement("div"), {
      className: "pergunta pergunta-fechada",
    });
    newQuestion.setAttribute('data-identifier', 'question-form');
    const containers = Array(3)
      .fill(null)
      .map(() => {
        return document.createElement("div");
      });
    const inputs = Array(2)
      .fill(null)
      .map(() => {
        return Object.assign(document.createElement("input"), {
          type: "text",
          className: "input",
        });
      });
    const placeholders = [
      "Texto da pergunta",
      "Cor de fundo da pergunta",
      "Resposta correta",
      "URL da imagem",
      "Resposta incorreta 1",
      "URL da imagem 1",
      "Resposta incorreta 2",
      "URL da imagem 2",
      "Resposta incorreta 3",
      "URL da imagem 3",
    ];
    const headerDivs = Array(3)
      .fill(null)
      .map(() => {
        return document.createElement("h2");
      });
    headerDivs[0].classList.add("question-index");
    const headerText = [
      `Pergunta ${index + 1}`,
      "Resposta correta",
      "Respostas incorretas",
    ];
    const incorretas = Array(3)
      .fill(null)
      .map(() => {
        return Object.assign(document.createElement("div"), {
          className: "bloco-resposta-incorreta",
        });
      });

    incorretas.forEach((resposta, step) => {
      containers[2].appendChild(resposta.cloneNode());
      inputs.forEach((input) => {
        containers[2].childNodes[step].appendChild(input.cloneNode());
      });
    });

    inputs.forEach((input, step) => {
      inputs.forEach((i) => {
        containers[step].appendChild(i.cloneNode());
      });
    });

    headerDivs.forEach((header, step) => {
      header.innerHTML = headerText[step];
    });

    containers.forEach((container, step) => {
      newQuestion.appendChild(headerDivs[step]);
      newQuestion.appendChild(container);
    });

    const renderedInputs = Array.from(newQuestion.querySelectorAll(".input"));
    renderedInputs.forEach((input, i) => {
      input.setAttribute("placeholder", `${placeholders[i]}`);
    });
    newQuestion.appendChild(
      Object.assign(document.createElement("img"), {
        src: "./public/images/caderneta.svg",
      })
    );
    newQuestion
      .querySelector("img")
      .setAttribute("onclick", "showQuestion(this)");
    newQuestion
      .querySelector('img')
      .setAttribute('data-identifier', 'expand');

    questionsPage.appendChild(newQuestion);
  });
  questionsPage.querySelector("div").classList.add("pergunta-box");
  questionsPage.querySelector("div").classList.remove("pergunta-fechada");
}

function showQuestion(target) {
  const activeQuestions = Array.from(
    document.querySelectorAll(".pergunta-box")
  );
  const questionTop = target.parentElement.querySelector("h2");
  activeQuestions.forEach((question) => {
    question.classList.add("pergunta-fechada");
    question.classList.remove("pergunta-box");
  });
  target.parentElement.classList.remove("pergunta-fechada");
  target.parentElement.classList.add("pergunta-box");
  questionTop.scrollIntoView({ behavior: "smooth" });
}

function resetQuiz(id) {
  const quizEnd = document.querySelector(".resultado-final-do-quizz");
  const answers = Array.from(document.querySelectorAll(".bloco"));
  const attributes = ["resposta-certa", "resposta-errada", "bloco-translucido"];
  document.querySelector("header").scrollIntoView({ behavior: "smooth" });
  answers.forEach((answer) => {
    const children = Array.from(answer.children);
    children.forEach((child) => {
      child.setAttribute("onclick", `answerClick(this, ${id})`);
    });
    attributes.forEach((attribute) => {
      answer.classList.remove(`${attribute}`);
    });
  });
  Nivel.reset();
  quizEnd.setAttribute('class', 'resultado-final-do-quizz hidden');
}

function loadHome() {
  document.querySelector('.Seu-quizz-esta-pronto').setAttribute('class', 'Seu-quizz-esta-pronto hidden');
  document.querySelector(".quiz-page").setAttribute('class', 'quiz-page hidden');
  document.querySelector(".quizz-box").innerHTML = "";
  document.querySelector('.resultado-final-do-quizz').setAttribute('class', 'resultado-final-do-quizz hidden');
  setTimeout(() => {
    document.querySelector(".mainPage").setAttribute('class', 'mainPage visible');
  }, 500);

  Nivel.reset();
}

async function answerClick(target, id) {
  const data = await Quizzes.data();
  const divClass = target.parentElement.classList[2];
  const answers = Array.from(document.querySelectorAll(`.${divClass}`));
  const clickedDiv = target.parentElement;
  const questionDiv = clickedDiv.parentElement.parentElement;
  const questionIndex = questionDiv.className.charAt(
    questionDiv.className.length - 1
  );
  const nextQuestion = questionDiv.nextElementSibling;
  const currentQuiz = data.find((element) => element.id === Number(id));

  answers.forEach((answer) => {
    const answerIndex = answer.classList[1].charAt(
      answer.classList[1].length - 1
    );

    if (
      currentQuiz.questions[questionIndex].answers[answerIndex].isCorrectAnswer
    ) {
      answer.classList.add("resposta-certa");
    } else {
      answer.classList.add("resposta-errada");
    }

    const children = answer.children;
    Array.from(children).forEach((child) => {
      child.removeAttribute("onclick");
    });

    answer.classList.add("bloco-translucido");
  });
  clickedDiv.classList.remove("bloco-translucido");

  if (
    Array.from(clickedDiv.classList).find(
      (element) => element === "resposta-certa"
    )
  ) {
    Nivel.acerto();
  }

  if (nextQuestion) {
    setTimeout(() => {
      nextQuestion.scrollIntoView({ behavior: "smooth" });
    }, 2000);
  } else {
    const quizEnd = document.querySelector(".resultado-final-do-quizz");
    const acertos = Nivel.valor();
    const porcentagem = Math.round(
      (acertos / currentQuiz.questions.length) * 100
    );
    const sortedLevels = currentQuiz.levels.sort(
      (a, b) => parseFloat(b.minValue) - parseFloat(a.minValue)
    );
    const finalLevel = sortedLevels.find(
      (element) => element.minValue <= porcentagem
    );

    quizEnd.querySelector('span').innerHTML = `${porcentagem}% de acerto: `
    quizEnd.querySelector("h1").innerHTML += finalLevel.title;
    quizEnd.querySelector("img").setAttribute("src", `${finalLevel.image}`);
    quizEnd.querySelector("p").innerHTML = finalLevel.text;
    quizEnd.setAttribute('class', 'resultado-final-do-quizz visible');
    setTimeout(() => {
      quizEnd.scrollIntoView({ behavior: "smooth" });
    }, 2000);
  }
}

function questions(iteration) {
  const box = document.createElement("div");
  box.classList.add("pergunta-box");
  box.appendChild(createLevel());

  function createLevel() {
    const h2 = document.createElement("h2");
    h2.innerHTML = String(`Nível ${iteration + 1}`);
    return h2;
  }

  function createInputs() {
    const inputTitle = document.createElement("input");
    inputTitle.type = "text";
    inputTitle.placeholder = "Título do nível";
    inputTitle.classList.add("input");
    inputTitle.setAttribute("id", "titulo");

    const inputAccuracy = document.createElement("input");
    inputAccuracy.type = "text";
    inputAccuracy.placeholder = "% de acerto mínima";
    inputAccuracy.classList.add("input");
    inputAccuracy.setAttribute("id", "porcentagem");

    const inputUrl = document.createElement("input");
    inputUrl.type = "text";
    inputUrl.placeholder = "URL da imagem do nível";
    inputUrl.classList.add("input");
    inputUrl.setAttribute("id", "url");

    const inputDescription = document.createElement("input");
    inputDescription.type = "text";
    inputDescription.placeholder = "Descrição do nível";
    inputDescription.classList.add("input");
    inputDescription.setAttribute("id", "descricao");

    box.appendChild(inputTitle);
    box.appendChild(inputAccuracy);
    box.appendChild(inputUrl);
    box.appendChild(inputDescription);
  }
  createInputs();

  return box;
}

function questionsList(numberOfQuestions) {
  const numberOfLevels = Number(numberOfQuestions);
  const form = document.querySelector("form");

  for (let i = 0; i < numberOfLevels; i++) {
    form.appendChild(questions(i));
  }

  const button = document.createElement("button");
  button.type = "submit";
  button.innerHTML = "Finalizar Quizz";
  button.classList.add("Prosseguir-para-proxima-pagina");


  form.addEventListener("submit", (e) => {
    e.preventDefault();
    checkForm(
      e.target.titulo,
      e.target.porcentagem,
      e.target.url,
      e.target.descricao
    );
  });

  form.appendChild(button);
}

function checkForm(arrayTitle, arrayPercentage, arrayURL, arrayDescription) {
  let errors = [];
  let allPercentages = [];

  const convertedTitle = Object.values(arrayTitle);
  const convertedPercentage = Object.values(arrayPercentage);
  const convertedURL = Object.values(arrayURL);
  const description = Object.values(arrayDescription);

  convertedTitle.map((e) => {
    const value = e.value;
    if (value.length < 10) errors.push("titulo");
  });

  convertedPercentage.map((e) => {
    const value = e.value;
    allPercentages.push(value);
    if (value < 0 || value > 100) errors.push("porcentagem");
  });

  convertedURL.map((e) => {
    const value = e.value;

    const isValidUrl = (urlString) => {
      var urlPattern = new RegExp(
        "^(https?:\\/\\/)?" + // validate protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
        "(\\#[-a-z\\d_]*)?$",
        "i"
      ); // validate fragment locator
      return !!urlPattern.test(urlString);
    };

    if (!isValidUrl(value)) errors.push("url");
  });

  description.map((e) => {
    const value = e.value;
    if (value < 30) errors.push("descricao");
  });

  if (!allPercentages.includes("0")) errors.push(1);

  if (errors.length > 0) return alert("ERRO! ALGUM CAMPO ESTA ERRADO!");

  createlvls(convertedTitle, convertedPercentage, convertedURL, description);
}

function createlvls(
  convertedTitle,
  convertedPercentage,
  convertedURL,
  description
) {

  const div = document.querySelector(".qtd-de-niveis-do-quizz");
  const niveis = Number(div.querySelector("input").value);

  newQuiz.resetLevels();

  for (let i = 0; i < niveis; i++) {
    const obj = {
      title: convertedTitle[i].value,
      minValue: convertedPercentage[i].value,
      text: description[i].value,
      image: convertedURL[i].value,
    };
    newQuiz.setLevels(obj);
  }
  postQuiz();
}

async function postQuiz() {
  if (!newQuiz.failsafe()) {
    try {
      
      const endPage = document.querySelector('.Seu-quizz-esta-pronto');
      const endImage = endPage.querySelector('.imagemdoquizz').querySelector('img');
      const endText = endPage.querySelector('.imagemdoquizz').querySelector('p');
      const levelsPage = document.querySelector('.agora-decida-os-niveis');
      const quizButton = endPage.querySelector('.Prosseguir-para-perguntas');
      const form = document.querySelector("form");

      const response = await axios.post(
        "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes", newQuiz.data()
      );
      localStorage.setItem(`${response.data.id}`, true);

      document.querySelector('.Perguntas').innerHTML = '';
      document.getElementById('selecionar-perguntas').innerHTML = '';
      document.querySelector('.Quiz-container').innerHTML = '';
      document.querySelector('.user-quizzes').innerHTML = '';

      Quizzes.load();
      renderQuizList(Quizzes.data());

      newQuiz.reset();
      newQuiz.setFailsafe();

      endText.innerHTML = `${response.data.title}`;
      endImage.setAttribute('src', `${response.data.image}`)
      endPage.setAttribute('class', 'Seu-quizz-esta-pronto visible');
      levelsPage.setAttribute('class', 'agora-decida-os-niveis hidden');
      quizButton.setAttribute('onclick', `loadNewQuiz(${response.data.id})`);
      return;
    } catch (error) {
      console.error("Não foi possivel fazer o post: ", error);
      return;
    }
  } else {
    return;
  }
}

function loadNewQuiz(id) {
  const endPage = document.querySelector('.Seu-quizz-esta-pronto');
  const quizPage = document.querySelector(".quiz-page");
  document
    .querySelector(".resultado-final-do-quizz")
    .querySelector(".Prosseguir-para-perguntas")
    .setAttribute("onclick", `resetQuiz(${id})`);

  endPage.setAttribute('class', 'Seu-quizz-esta-pronto hidden');

  setTimeout(() => {
    quizPage.setAttribute('class', 'quiz-page visible');
  }, 500);
  renderQuiz(Quizzes.data(), id);
}