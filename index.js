const tabuleiro = document.getElementById('tabuleiro')
const tamanhoTabuleiro = 32;
const velocidadeSnake = 6;
const corpoSnake = [{ x: 14, y: 14 }];

//Gerando a comida em um lugar aleatório do TABULEIRO
let posicaoComida = geradorDePosicoes();

function geradorDePosicoes() {
    return {
        //Random vai de 0 a 0.9 {1 excluso} - Floor arredonda
        x: Math.floor(Math.random() * tamanhoTabuleiro) + 1,
        y: Math.floor(Math.random() * tamanhoTabuleiro) + 1
    }
};

// Variavel de direção
let direcaoSnake = { x: 0, y: 0 };

function atualizaTela() {
    direcaoSnake = direcaoKeyDown();

    //Cabeça Snake
    corpoSnake[0].x += direcaoSnake.x;
    corpoSnake[0].y += direcaoSnake.y;
    tabuleiro.innerHTML = '';
};

//Criando os elementos {Pegando os atributos do CSS (Class List)}
function desenhaTela() {

    //Snake
    corpoSnake.forEach(cumprimento => {
        const elementoSnake = document.createElement('div');
        elementoSnake.classList.add('snake')
        elementoSnake.style.gridRowStart = cumprimento.y;
        elementoSnake.style.gridColumnStart = cumprimento.x;
        tabuleiro.appendChild(elementoSnake);
    });

    //Comida
    const elementoComida = document.createElement('div');
    elementoComida.classList.add('comida')
    elementoComida.style.gridRowStart = posicaoComida.y;
    elementoComida.style.gridColumnStart = posicaoComida.x;
    tabuleiro.appendChild(elementoComida);


};

//Qnt passou dês da ultima Render
let ultimaRenderizacao = 0;

function looping(tempoAtual) {

    window.requestAnimationFrame(looping);
    const segundosRenderizados = (tempoAtual - ultimaRenderizacao) / 1000;

    //Enquanto não acumular o tempo {1/Vel.Snake} não anda.
    if (segundosRenderizados < 1 / velocidadeSnake) { return }

    //Liberar {timer acumulado}
    ultimaRenderizacao = tempoAtual;

    atualizaTela();
    desenhaTela();

};
requestAnimationFrame(looping);

function direcaoKeyDown() {
    return direcaoSnake;
};

window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
            direcaoSnake.x = 0;
            direcaoSnake.y = -1;
            break;
        case 'ArrowDown':
            direcaoSnake.x = 0;
            direcaoSnake.y = 1;
            break;
        case 'ArrowRight':
            direcaoSnake.x = 1;
            direcaoSnake.y = 0;
            break;
        case 'ArrowLeft':
            direcaoSnake.x = -1;
            direcaoSnake.y = 0;
            break;

    }

});