const tabuleiro = document.getElementById('tabuleiro')
const tamanhoTabuleiro = 22;
const expansaoCobra = 1;
let velocidadeSnake = 5;
let corpoSnake = [{ x: 14, y: 14 }];
let gameOver = false;
let posicaoComida = geradorDePosicoesAleatoriasTabuleiro();
let novoCumprimento = 0;

function mudarCorCobra() {
    document.getElementById('changeSnake').classList.toggle('corpoColorido');
}

function nascerComCorpo() {
    const nascerCorpoCobra = document.getElementById('nascerComCorpo').value;

    let corpoNovo = 0;
    while (corpoNovo < nascerCorpoCobra) {
        corpoSnake.push({
            ...corpoSnake[corpoSnake.length - 1]
        });
        corpoNovo++

    }
}

function aumentaVelocidade() {
    if (colisao(posicaoComida)) {
        velocidadeSnake += 0.85;
    }
}

function mudarParede() {

    if (foraDoTabuleiro(cabecaSnake())) {
        if (corpoSnake[0].x > tamanhoTabuleiro) {
            corpoSnake[0].x = 1
        } if (corpoSnake[0].x < 1) {
            corpoSnake[0].x = tamanhoTabuleiro
        }
        if (corpoSnake[0].y > tamanhoTabuleiro) {
            corpoSnake[0].y = 1
        } if (corpoSnake[0].y < 1) {
            corpoSnake[0].y = tamanhoTabuleiro
        }
        gameOver = false;
    }
    if (autoColisao()) {
        gameOver = true;
    } else if (foraDoTabuleiro(cabecaSnake())) {
        gameOver = true;

    }
}

let direcaoSnake = { x: 0, y: 0 };
let ultimaDirecaoSnake = { x: 0, y: 0 }

function direcaoKeyDown() {
    ultimaDirecaoSnake = direcaoSnake;
    return direcaoSnake;
}

window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
            if (ultimaDirecaoSnake.y != 0) break;
            direcaoSnake.x = 0;
            direcaoSnake.y = -1;
            break;
        case 'ArrowDown':
            if (ultimaDirecaoSnake.y != 0) break;
            direcaoSnake.x = 0;
            direcaoSnake.y = 1;
            break;
        case 'ArrowRight':
            if (ultimaDirecaoSnake.x != 0) break;
            direcaoSnake.x = 1;
            direcaoSnake.y = 0;
            break;
        case 'ArrowLeft':
            if (ultimaDirecaoSnake.x != 0) break;
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
}

function expandirCobra(valor) {
    novoCumprimento += valor;
}

function adcCumprimento() {
    if (novoCumprimento > 0) {
        corpoSnake.push({
            ...corpoSnake[corpoSnake.length - 1]
        });
        mudarCorCobra();

        novoCumprimento -= 1;
    }
}

function autoColisao() {
    let snakeHead = corpoSnake[0];
    return corpoSnake.some((cumprimento, seguimento) => {
        if (seguimento === 0) {
            return false;
        }

        return snakeHead.x === cumprimento.x && snakeHead.y === cumprimento.y;
    });
}

function checarGameOver() {
    if (foraDoTabuleiro(cabecaSnake()) || autoColisao()) {
        gameOver = true;
    }
}

function foraDoTabuleiro(position) {
    return position.x > tamanhoTabuleiro || position.x < 1 ||
        position.y > tamanhoTabuleiro || position.y < 1;
}

function cabecaSnake() {
    return corpoSnake[0]
}

function colisao(posicao) {
    return corpoSnake.some(cumprimento => {
        return posicao.x === cumprimento.x && posicao.y === cumprimento.y;
    });
}

function atualizarTela() {
    direcaoSnake = direcaoKeyDown();
    adcCumprimento();
    tabuleiro.innerHTML = '';

    if (colisao(posicaoComida)) {
        posicaoComida = geradorDePosicoesAleatoriasTabuleiro();
        expandirCobra(expansaoCobra);
    }

    //Corpo
    //{Andar os seguimentos ganhos}
    //Sempre na posição do anterior
    for (let i = corpoSnake.length - 2; i >= 0; i--) {
        corpoSnake[i + 1] = { ...corpoSnake[i] }
    }

    //Cabeça 
    corpoSnake[0].y += direcaoSnake.y;
    corpoSnake[0].x += direcaoSnake.x;
}

function desenharTela() {

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

}

let ultimaRenderizacao = 0;
let score = 0;

function contagemScore() {
    if (colisao(posicaoComida)) {
        score += 10;
    }
}

function looping(tempoAtual) {

    scoreT.innerHTML = `SCORE: ${score}`;

    window.requestAnimationFrame(looping);
    const segundosRenderizados = (tempoAtual - ultimaRenderizacao) / 1000;

    //Enquanto não acumular o tempo {1/Vel.Snake} não anda.
    if (segundosRenderizados < 1 / velocidadeSnake) { return }

    //Liberar {timer acumulado}
    ultimaRenderizacao = tempoAtual;



    if (gameOver) {
        alert(`VOCÊ PERDEU 
        SCORE : ${score}`)
    }

    atualizarTela();
    desenharTela();
    contagemScore();
    aumentaVelocidade();
    checarGameOver();

    const checkColor = document.getElementById('checarCorInput');
    if (checkColor.checked) {
        mudarCorCobra();
    }

    const checkWalls = document.getElementById('mudarParede');
    if (checkWalls.checked) {
        mudarParede();
        let trocaP = document.getElementById('checkParedes');
        trocaP.classList.remove('aparecerDiv');
        trocaP.classList.add('esconderDiv');
    } else {
        let trocaP = document.getElementById('checkParedes');
        trocaP.classList.remove('esconderDiv');
        trocaP.classList.add('aparecerDiv');
    }

    const checkCorpoCobra = document.getElementById('mudarCorpoCobra');
    if (checkCorpoCobra.checked) {
        if (autoColisao()) { gameOver = false; }
        let trocaC = document.getElementById('checkNascerComCorpo');
        trocaC.classList.remove('aparecerDiv');
        trocaC.classList.add('esconderDiv');
    } else {
        let trocaC = document.getElementById('checkNascerComCorpo');
        trocaC.classList.remove('esconderDiv');
        trocaC.classList.add('aparecerDiv');
    }
}
requestAnimationFrame(looping);


