// ============================
//  GRÁFICO BTC
// ============================

const ctx = document.getElementById('priceChart').getContext('2d');

let priceData = [];
let timeLabels = [];

const priceChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: timeLabels,
        datasets: [{
            label: 'BTC/USDT',
            data: priceData,
            borderWidth: 2
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: { beginAtZero: false }
        }
    }
});

// ============================
//  BUSCAR PREÇO
// ============================

async function fetchBTC() {
    try {
        const req = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT");
        const data = await req.json();

        const price = parseFloat(data.price);
        const time = new Date().toLocaleTimeString("pt-BR");

        // atualiza gráfico
        priceData.push(price);
        timeLabels.push(time);

        // mantém no máximo 20 pontos para não pesar
        if (priceData.length > 20) {
            priceData.shift();
            timeLabels.shift();
        }

        priceChart.update();

        // atualiza texto do sinal
        updateSignal(price);

    } catch (e) {
        console.log("Erro ao buscar preço:", e);
    }
}

// chama fetch a cada 6s
setInterval(fetchBTC, 6000);
fetchBTC();

// ============================
//  SINAL SIMPLES
// ============================

let lastPrice = null;

function updateSignal(price) {
    const signal = document.getElementById("signal");

    if (!lastPrice) {
        lastPrice = price;
        signal.innerHTML = "Aguardando dados...";
        return;
    }

    if (price < lastPrice) {
        signal.innerHTML = "🔔 BUY SIGNAL — Preço caiu, oportunidade de compra";
        signal.style.color = "lime";
    } else {
        signal.innerHTML = "Aguardando novo sinal...";
        signal.style.color = "white";
    }

    lastPrice = price;
}
