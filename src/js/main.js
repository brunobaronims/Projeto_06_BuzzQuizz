async function getQuizzes() {
  try {
    const response = await axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes');
    console.log(response.data);
    return response.data;
  } catch(error) {
    console.error('Não foi possível resgatar os quizzes: ', error);
    return;
  }
}

async function renderQuiz(data) {
  const list = document.querySelector('.Quiz-container');
  const quiz = document.createElement('div');
  data.forEach(quiz => {

  });
}

getQuizzes();