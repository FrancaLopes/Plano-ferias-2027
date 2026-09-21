const URL_PLANILHA = "https://script.google.com/macros/s/AKfycbzjLXY8a3aiwDp3kq2AjTNPplqGkCHWZncaiV8rRm0LdhqFoeMtVju-SFZM-PaprsQq/exec";
const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril",
    "Maio", "Junho", "Julho", "Agosto",
    "Setembro", "Outubro", "Novembro", "Dezembro"
];

let mesesSelecionados = [];

const area30 = document.getElementById("area30");
const areaFracionada = document.getElementById("areaFracionada");
const gradeMeses = document.getElementById("meses");
const resumoMeses = document.getElementById("resumoMeses");

// Criar os botões dos meses
meses.forEach((mes) => {
    const botao = document.createElement("button");

    botao.type = "button";
    botao.className = "mes";
    botao.dataset.mes = mes;

    botao.innerHTML = `
        <span>${mes}</span>
        <span class="numero-preferencia"></span>
    `;

    botao.addEventListener("click", () => {
        const posicao = mesesSelecionados.indexOf(mes);

        if (posicao !== -1) {
            mesesSelecionados.splice(posicao, 1);
        } else {
            if (mesesSelecionados.length >= 3) {
                alert("Você pode selecionar somente 3 meses.");
                return;
            }

            mesesSelecionados.push(mes);
        }

        atualizarMeses();
    });

    gradeMeses.appendChild(botao);
});

// Atualizar os números das preferências
function atualizarMeses() {
    document.querySelectorAll(".mes").forEach((botao) => {
        const mes = botao.dataset.mes;
        const numero = botao.querySelector(".numero-preferencia");
        const posicao = mesesSelecionados.indexOf(mes);

        if (posicao !== -1) {
            botao.classList.add("selecionado");
            numero.textContent = posicao + 1;
        } else {
            botao.classList.remove("selecionado");
            numero.textContent = "";
        }
    });

    if (mesesSelecionados.length === 0) {
        resumoMeses.textContent = "Nenhum mês selecionado.";
    } else {
        resumoMeses.innerHTML = mesesSelecionados
            .map((mes, indice) =>
                `${indice + 1}ª preferência: <strong>${mes}</strong>`
            )
            .join("<br>");
    }
}

// Limpar escolhas
document.getElementById("limparMeses").addEventListener("click", () => {
    mesesSelecionados = [];
    atualizarMeses();
});

// Alternar modalidade
document.querySelectorAll('input[name="modalidade"]').forEach((radio) => {
    radio.addEventListener("change", () => {
        if (radio.value === "30") {
            area30.classList.remove("escondido");
            areaFracionada.classList.add("escondido");
        } else {
            area30.classList.add("escondido");
            areaFracionada.classList.remove("escondido");
        }
    });
});

// Criar as 3 preferências de férias fracionadas
const containerFracionado = document.getElementById(
    "preferenciasFracionadas"
);

for (let i = 1; i <= 3; i++) {
    const bloco = document.createElement("div");

    bloco.className = "preferencia-fracionada";

    bloco.innerHTML = `
        <h3>${i}ª preferência</h3>

        <div class="periodo">
            <strong>Primeiro período de 15 dias</strong>

            <div class="linha-campos">
                <select class="mes-fracionado">
                    <option value="">Selecione o mês</option>
                    ${criarOpcoesMeses()}
                </select>

                <select class="inicio-fracionado">
                    <option value="">Início</option>
                    <option value="1">Dia 1º</option>
                    <option value="15">Dia 15</option>
                </select>
            </div>

            <span class="previsao"></span>
        </div>

        <div class="periodo">
            <strong>Segundo período de 15 dias</strong>

            <div class="linha-campos">
                <select class="mes-fracionado">
                    <option value="">Selecione o mês</option>
                    ${criarOpcoesMeses()}
                </select>

                <select class="inicio-fracionado">
                    <option value="">Início</option>
                    <option value="1">Dia 1º</option>
                    <option value="15">Dia 15</option>
                </select>
            </div>

            <span class="previsao"></span>
        </div>
    `;

    containerFracionado.appendChild(bloco);
}

// Criar opções dos meses
function criarOpcoesMeses() {
    return meses
        .map((mes, indice) =>
            `<option value="${indice + 1}">${mes}</option>`
        )
        .join("");
}

// Calcular e mostrar as datas
document.addEventListener("change", (evento) => {
    if (
        evento.target.classList.contains("mes-fracionado") ||
        evento.target.classList.contains("inicio-fracionado")
    ) {
        const periodo = evento.target.closest(".periodo");

        const mes = periodo.querySelector(".mes-fracionado").value;
        const inicio = periodo.querySelector(".inicio-fracionado").value;
        const previsao = periodo.querySelector(".previsao");

        if (mes && inicio) {
            const dataInicial = new Date(
                2027,
                Number(mes) - 1,
                Number(inicio)
            );

            const dataFinal = new Date(dataInicial);
            dataFinal.setDate(dataFinal.getDate() + 14);

            previsao.textContent =
                `Período: ${dataInicial.toLocaleDateString("pt-BR")} até ` +
                `${dataFinal.toLocaleDateString("pt-BR")}`;
        } else {
            previsao.textContent = "";
        }
    }
});

// Botão finalizar
document.getElementById("btnEnviar").addEventListener("click", async () => {
    const policial = document.getElementById("policial").value;
    const modalidade = document.querySelector(
        'input[name="modalidade"]:checked'
    );
    const observacoes = document.getElementById("observacoes").value;
    const mensagem = document.getElementById("mensagem");

    if (!policial) {
        mensagem.textContent = "Selecione o nome do policial.";
        mensagem.style.color = "red";
        return;
    }

    if (!modalidade) {
        mensagem.textContent = "Selecione a modalidade das férias.";
        mensagem.style.color = "red";
        return;
    }

    if (modalidade.value === "30" && mesesSelecionados.length !== 3) {
        mensagem.textContent = "Selecione exatamente 3 meses.";
        mensagem.style.color = "red";
        return;
    }

    const preferenciasFracionadas = [];

    document.querySelectorAll(".preferencia-fracionada").forEach((bloco) => {
        const periodos = [];

        bloco.querySelectorAll(".periodo").forEach((periodo) => {
            const mes = periodo.querySelector(".mes-fracionado").value;
            const inicio = periodo.querySelector(".inicio-fracionado").value;

            if (mes && inicio) {
                const nomeMes = meses[Number(mes) - 1];
                periodos.push(`Dia ${inicio} de ${nomeMes}`);
            }
        });

        preferenciasFracionadas.push(periodos.join(" + "));
    });

    const dados = {
        policial: policial,
        modalidade: modalidade.value,
        preferencia1: mesesSelecionados[0] || "",
        preferencia2: mesesSelecionados[1] || "",
        preferencia3: mesesSelecionados[2] || "",
        fracionada1: preferenciasFracionadas[0] || "",
        fracionada2: preferenciasFracionadas[1] || "",
        fracionada3: preferenciasFracionadas[2] || "",
        observacoes: observacoes
    };

    mensagem.textContent = "Enviando resposta...";
    mensagem.style.color = "blue";

    try {
        await fetch(URL_PLANILHA, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify(dados)
        });

        mensagem.textContent = "Escolha enviada com sucesso!";
        mensagem.style.color = "green";

    } catch (erro) {
        mensagem.textContent = "Erro ao enviar. Tente novamente.";
        mensagem.style.color = "red";
        console.error(erro);
    }
});