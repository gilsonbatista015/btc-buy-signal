// ============================
// CONFIGURAÇÕES DO SISTEMA
// ============================
const API_URL = "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT";
const UPDATE_INTERVAL = 5000; // Atualiza a cada 5 segundos

let priceHistory = []; // Armazena últimos preços para cálculos

// ============================
// FUNÇÃO PARA BUSCAR O PREÇO
// ============================
async function fetchBTCPrice() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const price = parseFloat(data.price);

        // Atualiza histórico
        priceHistory.push(price);
        if (priceHistory.length > 50) priceHistory.shift();

        updateDisplay(price);
        analyze(price);

    } catch (error) {
        console.error("Erro ao buscar preço:", error);
        document.getElementById("status").innerHTML = "Erro ao atualizar dados.";
    }
}

// ============================
// FUNÇÃO DE ANÁLISE DO SISTEMA
// ============================
function analyze(currentPrice) {
    if (priceHistory.length < 20) return;

    // Média móvel simples
    const sma20 = priceHistory.slice(-20).reduce((a, b) => a + b, 0) / 20;

    // ============================
    // LÓGICA DO SINAL
    // ============================
    let signal = "";
    let color = "";

    if (currentPrice < sma20 * 0.985) {
        signal = "FORTE SINAL DE COMPRA";
        color = "#0f0"; // verde
    } else if (currentPrice > sma20 * 1.015) {
        signal = "SINAL DE VENDA";
        color = "#f00"; // vermelho
    } else {
        signal = "AGUARDAR • Mercado neutro";
        color = "#fff"; // branco
    }

    // Exibe resultado
    document.getElementById("signal").innerHTML = signal;
    document.getElementById("signal").style.color = color;

    document.getElementById("sma").innerHTML =
        "Média móvel (20 períodos): " + sma20.toFixed(2);
}

// ============================
// EXIBE O PREÇO NA TELA
// ============================
function updateDisplay(price) {
    document.getElementById("btc-price").innerHTML = price.toFixed(2) + " USDT";

    const date = new Date();
    document.getElementById("status").innerHTML =
        "Última atualização: " +
        date.toLocaleTimeString("pt-BR", { hour12: false });
}

// ============================
// LOOP AUTOMÁTICO
// ============================
fetchBTCPrice();
setInterval(fetchBTCPrice, UPDATE_INTERVAL);
