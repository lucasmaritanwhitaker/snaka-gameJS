const tabuleiro = document.getElementById('tabuleiro')
const tamanhoTabuleiro = 32;
const velocidadeSnake = 6;
const corpoSnake = [{ x: 14, y: 14 }];
let gameOver = false;

// Variavel de direção
let direcaoSnake = { x: 0, y: 0 };

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

//Gerando a comida em um lugar aleatório do TABULEIRO
let posicaoComida = geradorDePosicoesAleatoriasTabuleiro();

//TABULEIRO
function geradorDePosicoesAleatoriasTabuleiro() {
    return {
        //Random vai de 0 a 0.9 {1 excluso} - Floor arredonda
        x: Math.floor(Math.random() * tamanhoTabuleiro) + 1,
        y: Math.floor(Math.random() * tamanhoTabuleiro) + 1
    }
};

//VAD - GAME-OVER
//SNAKE - PAREDE
function foraDoTabuleiro(position) {
    return position.x > tamanhoTabuleiro || position.x < 1 ||
        position.y > tamanhoTabuleiro || position.y < 1;
}

//Validação
function checkGameOver() {
    if (foraDoTabuleiro(cabecaSnake())) {
        gameOver = true;
    }
};
function cabecaSnake() {
    return corpoSnake[0]
};

//SNAKE - COMIDA


//Colisão 3 {COBRA - COMIDA || COBRA - COBRA || COBRA - PAREDE}
function colisao(posicao) {
    return corpoSnake.some(cumprimento => {
        return posicao.x === cumprimento.x && posicao.y === cumprimento.y;
    });
};

function atualizaTela() {
    direcaoSnake = direcaoKeyDown();

    //Cabeça Snake
    corpoSnake[0].y += direcaoSnake.y;
    corpoSnake[0].x += direcaoSnake.x;
    tabuleiro.innerHTML = '';

    if (colisao(posicaoComida)) {
        posicaoComida = geradorDePosicoesAleatoriasTabuleiro();
    }
};

function desenhaTela() {
    //Criando os elementos {Pegando os atributos do CSS (Class List)}
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

    if (gameOver) {
        alert(`Você perdeu`)
    }
    window.requestAnimationFrame(looping);
    const segundosRenderizados = (tempoAtual - ultimaRenderizacao) / 1000;

    //Enquanto não acumular o tempo {1/Vel.Snake} não anda.
    if (segundosRenderizados < 1 / velocidadeSnake) { return }

    //Liberar {timer acumulado}
    ultimaRenderizacao = tempoAtual;

    atualizaTela();
    desenhaTela();
    checkGameOver();
};
requestAnimationFrame(looping);


