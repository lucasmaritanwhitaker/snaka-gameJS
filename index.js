const tabuleiro = document.getElementById('tabuleiro')
const tamanhoTabuleiro = 22;
const velocidadeSnake = 8;
const corpoSnake = [{ x: 14, y: 14 }];
const corpoColorido = [{ x: 10, y: 10 }];
const expansaoCobra = 1;
let gameOver = false;
let posicaoComida = geradorDePosicoesAleatoriasTabuleiro();
let novoCumprimento = 0;


function changeColorSnake() {
    document.getElementById('changeSnake').classList.toggle('corpoColorido');
};

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

function geradorDePosicoesAleatoriasTabuleiro() {
    return {
        //Random vai de 0 a 0.9 {1 excluso} - Floor arredonda
        x: Math.floor(Math.random() * tamanhoTabuleiro) + 1,
        y: Math.floor(Math.random() * tamanhoTabuleiro) + 1
    }
};
function expandirCobra(valor) {
    novoCumprimento += valor;
};

function adcCumprimento() {
    if (novoCumprimento > 0) {
        corpoSnake.push({
            ...corpoSnake[corpoSnake.length - 1]
        });
        changeColorSnake();

        novoCumprimento -= 1;
    }
};

function foraDoTabuleiro(position) {
    return position.x > tamanhoTabuleiro || position.x < 1 ||
        position.y > tamanhoTabuleiro || position.y < 1;
}
function cabecaSnake() {
    return corpoSnake[0]
};
function checkGameOver() {
    if (foraDoTabuleiro(cabecaSnake())) {
        gameOver = true;
    }
};

function colisao(posicao) {
    return corpoSnake.some(cumprimento => {
        return posicao.x === cumprimento.x && posicao.y === cumprimento.y;
    });
};

function atualizaTela() {
    direcaoSnake = direcaoKeyDown();
    adcCumprimento();

    if (colisao(posicaoComida)) {
        posicaoComida = geradorDePosicoesAleatoriasTabuleiro();
        expandirCobra(expansaoCobra);
    };

    //Corpo
    //{Andar os seguimentos ganhos}
    //Sempre na posição do anterior
    for (let i = corpoSnake.length - 2; i >= 0; i--) {
        corpoSnake[i + 1] = { ...corpoSnake[i] }
    }

    //Cabeça 
    corpoSnake[0].y += direcaoSnake.y;
    corpoSnake[0].x += direcaoSnake.x;
    tabuleiro.innerHTML = '';
};

function desenhaTela() {

    //Criando os elementos {Pegando os atributos do CSS (Class List)}
    //Snake
    corpoSnake.forEach(cumprimento => {
        const elementoSnake = document.createElement('div');
        elementoSnake.setAttribute('id', 'changeSnake');
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

let ultimaRenderizacao = 0;

function looping(tempoAtual) {

    window.requestAnimationFrame(looping);
    const segundosRenderizados = (tempoAtual - ultimaRenderizacao) / 1000;

    //Enquanto não acumular o tempo {1/Vel.Snake} não anda.
    if (segundosRenderizados < 1 / velocidadeSnake) { return }

    //Liberar {timer acumulado}
    ultimaRenderizacao = tempoAtual;

    if (gameOver) {
        alert(`VOCÊ PERDEU`)
    }

    atualizaTela();
    desenhaTela();
    checkGameOver();
    const check = document.getElementById('changeColorInput');
    if (check.checked) {
        changeColorSnake();
    }

};
requestAnimationFrame(looping);


