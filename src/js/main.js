function esconderLayout(){
    const pegarQuizz = document.querySelector(".mainPage");
    pegarQuizz.classList.add("escondido");

    const quizzEscondido = document.querySelector(".quizz");
    quizzEscondido.classList.remove("Quizz-escondido")
}


let pontuacao = 0;

  const verificaSeEhOcerto = (quadroselecionado) => {
    if(quadroselecionado.isCorrectAnswer == true) {
      pontuacao += 1;
    }
    if(pontuacao == 0) return "nivel 1"
    if(pontuacao == 1) return "nivel 2"
    if(pontuacao == 3) return "nivel 3"
};


  console.log(pontuacao)