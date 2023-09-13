class Peca {
  constructor(valor) {
    this.valor = valor;
  }
}

class PecaNumerica extends Peca {
  constructor(valor) {
    super(valor);
  }
}

class PecaVazia extends Peca {
  constructor() {
    super(null);
  }
}

class Tabuleiro {
  constructor() {
    this.tabuleiro = [];
    this.inicializarTabuleiro();
    this.inicializarEmbaralhamento();
    this.turnoJogador1 = true;
    this.temporizador = null;
    this.startTime = null;
    this.moveCounter = 0;
    this.elapsedTimeElement = document.getElementById("elapsed-time");
    this.updateElapsedTimeInterval = null;

    this.lastTime = null;
    this.elapsedTime = 0;

    this.updateElapsedTimeInterval = requestAnimationFrame(
      this.updateElapsedTime.bind(this)
    );

    this.tabuleiro.find((peca) => peca.valor === null).selecionada = true;
    this.updateElapsedTimeInterval = setInterval(() => {
      this.updateElapsedTime();
    }, 10);

    document.addEventListener("keydown", this.handleKeyPress.bind(this));
  }

  startTimer() {
    this.startTime = Date.now();
    this.updateElapsedTime();
  }

  stopTimer() {
    if (this.startTime !== null) {
      const endTime = Date.now();
      const elapsedTimeInSeconds = (endTime - this.startTime) / 1000;
      return elapsedTimeInSeconds;
    }
    return 0;
  }

  resetTimer() {
    this.startTime = null;
    this.updateElapsedTime;
  }

  updateElapsedTime() {
    if (this.startTime !== null) {
      const currentTime = Date.now();
      const elapsedTimeInSeconds = (currentTime - this.startTime) / 1000;
      this.elapsedTimeElement.textContent =
        elapsedTimeInSeconds.toFixed(2) + " segundos";
    } else {
      this.elapsedTimeElement.textContent = "0.00 segundos";
    }
    this.updateElapsedTimeInterval = requestAnimationFrame(() => {
      this.updateElapsedTime();
    });
  }

  incrementMoveCounter() {
    this.moveCounter++;
  }

  inicializarTabuleiro() {
    for (let i = 1; i <= 8; i++) {
      this.tabuleiro.push(new PecaNumerica(i));
    }
    this.tabuleiro.push(new PecaVazia());
    this.embaralhar();
  }

  inicializarEmbaralhamento() {
    const botaoEmbaralhar = document.getElementById("embaralhar");
    botaoEmbaralhar.addEventListener("click", () => {
      this.embaralhar();
    });
  }

  embaralhar() {
    for (let i = this.tabuleiro.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.tabuleiro[i], this.tabuleiro[j]] = [this.tabuleiro[j], this.tabuleiro[i]];
    }
    this.resetTimer();
    this.moveCounter = 0;
    this.exibirTabuleiro();
  }

  jogarNovamente() {
    document.getElementById('vitoria').classList.replace('vitoria', 'vitoriaNone')
  }

  moverPeca(peca) {
    const indexPecaVazia = this.tabuleiro.findIndex((p) => p.valor === null);
    const indexPecaClicada = this.tabuleiro.indexOf(peca);
    const direcoes = [-1, 1, -3, 3];

    for (const direcao of direcoes) {
      if (indexPecaClicada + direcao === indexPecaVazia) {
        [this.tabuleiro[indexPecaClicada], this.tabuleiro[indexPecaVazia]] = [
          this.tabuleiro[indexPecaVazia],
          this.tabuleiro[indexPecaClicada],
        ];

        this.exibirTabuleiro();

        if (this.startTime === null) {
          this.startTimer();
        }

        this.incrementMoveCounter();

        if (this.verificarVitoria()) {
          const elapsedTimeInSeconds = this.stopTimer();
          this.updateElapsedTime();
          cancelAnimationFrame(this.updateElapsedTimeInterval);

          document.getElementById('vitoria').classList.replace('vitoriaNone', 'vitoria')
          let textVitoria = "Você concluiu o jogo em \n" +
            elapsedTimeInSeconds.toFixed(2) +
            " segundos com " +
            this.moveCounter +
            " movimentos."
          document.getElementById('textVitoria').innerText = textVitoria

          this.resetTimer();
          this.embaralhar();
          this.moveCounter = 0;
        }
        break;
      }
    }
  }

  verificarVitoria() {
    for (let i = 0; i < this.tabuleiro.length - 1; i++) {
      if (this.tabuleiro[i].valor !== i + 1) {
        return false;
      }
    }
    return true;
  }

  handleKeyPress(event) {
    const indexPecaVazia = this.tabuleiro.findIndex((p) => p.valor === null);
    let indexPecaSelecionada = this.tabuleiro.findIndex((p) => p.selecionada);

    switch (event.key) {
      case "ArrowLeft":
      case "a":
        if (indexPecaSelecionada % 3 !== 0) {
          indexPecaSelecionada--;
        }
        break;
      case "ArrowRight":
      case "d":
        if (indexPecaSelecionada % 3 !== 2) {
          indexPecaSelecionada++;
        }
        break;
      case "ArrowUp":
      case "w":
        if (indexPecaSelecionada >= 3) {
          indexPecaSelecionada -= 3;
        }
        break;
      case "ArrowDown":
      case "s":
        if (indexPecaSelecionada < 6) {
          indexPecaSelecionada += 3;
        }
        break;
      case "Enter":
        if (indexPecaSelecionada !== indexPecaVazia) {
          this.moverPeca(this.tabuleiro[indexPecaSelecionada]);
        }
        break;
      default:
        return;
    }

    this.tabuleiro.forEach((peca) => (peca.selecionada = false));
    this.tabuleiro[indexPecaSelecionada].selecionada = true;
    this.exibirTabuleiro();
  }


  exibirTabuleiro() {

    const tabuleiroElement = document.getElementById("tabuleiro");
    tabuleiroElement.innerHTML = "";

    for (const [index, peca] of this.tabuleiro.entries()) {
      const pecaElement = document.createElement("div");
      pecaElement.classList.add("peca");
      if (peca.selecionada) {
        pecaElement.classList.add("selecionada");
      }
      pecaElement.textContent = peca.valor !== null ? peca.valor : "";
      pecaElement.addEventListener("click", () => this.moverPeca(peca));
      tabuleiroElement.appendChild(pecaElement);
    }
  }
}

const tabuleiro = new Tabuleiro();
tabuleiro.exibirTabuleiro();