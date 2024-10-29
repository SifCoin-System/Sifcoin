// script.js
function updateDashboard(periodo) {
    let salesCount = document.getElementById("sales-count");
    let salesValue = document.getElementById("sales-value");
    let salesTitle = document.querySelector(".sales-info h3");

    switch (periodo) {
        case 'dia':
            salesTitle.innerText = "Vendas do Dia";
            salesCount.innerText = "50";
            salesValue.innerText = "1.200,00";
            break;
        case 'semana':
            salesTitle.innerText = "Vendas da Semana";
            salesCount.innerText = "300";
            salesValue.innerText = "7.000,00";
            break;
        case 'mes':
            salesTitle.innerText = "Vendas do Mês";
            salesCount.innerText = "1200";
            salesValue.innerText = "25.000,00";
            break;
    }
}

// script.js
function createBudget(event) {
    event.preventDefault();
    const produto = document.getElementById("produto-orcamento").value;
    const quantidade = document.getElementById("quantidade-orcamento").value;
    const valor = document.getElementById("valor-orcamento").value;

    const budgetList = document.getElementById("budget-list");

    const budgetItem = document.createElement("div");
    budgetItem.classList.add("budget-item");
    budgetItem.innerHTML = `
        <p>${produto} - Quantidade: ${quantidade} - Valor Estimado: R$ ${valor}</p>
        <div>
            <button class="approve-btn" onclick="approveBudget(this)">Aprovar</button>
            <button class="delete-btn" onclick="deleteBudget(this)">Excluir</button>
        </div>
    `;

    budgetList.appendChild(budgetItem);
    document.querySelector(".budget-form").reset();
}

function approveBudget(button) {
    const budgetItem = button.parentElement.parentElement;
    budgetItem.style.backgroundColor = "#d0f0c0"; // Cor verde-claro para indicar aprovado
    button.remove(); // Remove o botão de aprovação após aprovado
}

function deleteBudget(button) {
    const budgetItem = button.parentElement.parentElement;
    budgetItem.remove(); // Remove o orçamento da lista
}

// script.js

// Exemplo de dados de entradas e saídas
const transactions = [
    { descricao: "Venda de Cartão de Visita", valor: 100.00, quantidade: 10, data: "2024-10-01", tipo: "entrada" },
    { descricao: "Compra de Papel", valor: 50.00, quantidade: 5, data: "2024-10-02", tipo: "saida" },
    { descricao: "Venda de Flyers", valor: 200.00, quantidade: 20, data: "2024-10-03", tipo: "entrada" },
    { descricao: "Compra de Tinta", valor: 75.00, quantidade: 3, data: "2024-10-04", tipo: "saida" },
];

// Função para exibir os dados de transações no relatório
function populateReportTable() {
    const reportTableBody = document.getElementById("report-table-body");
    let totalEntradas = 0;
    let totalSaidas = 0;

    transactions.forEach(transaction => {
        const row = document.createElement("tr");
        
        row.innerHTML = `
            <td>${transaction.descricao}</td>
            <td>R$ ${transaction.valor.toFixed(2).replace('.', ',')}</td>
            <td>${transaction.quantidade}</td>
            <td>${transaction.data}</td>
        `;

        reportTableBody.appendChild(row);

        // Atualiza os totais de entradas e saídas
        if (transaction.tipo === "entrada") {
            totalEntradas += transaction.valor;
        } else {
            totalSaidas += transaction.valor;
        }
    });

    // Exibe os totais
    document.getElementById("total-entradas").textContent = totalEntradas.toFixed(2).replace('.', ',');
    document.getElementById("total-saidas").textContent = totalSaidas.toFixed(2).replace('.', ',');
}

// Função para gerar PDF
function downloadPDF() {
    const reportContent = document.getElementById("report-content");
    const options = {
        margin:       0.5,
        filename:     'Relatorio_Mensal.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(options).from(reportContent).save();
}

// Chama a função para popular a tabela com os dados de exemplo
populateReportTable();

// script.js

// Função para adicionar uma nova faixa de preço
function addPriceTier() {
    const priceTiersContainer = document.getElementById("price-tiers");
    const newTier = document.createElement("div");
    newTier.classList.add("price-tier");
    newTier.innerHTML = `
        <label for="quantidade-minima">Quantidade Mínima:</label>
        <input type="number" name="quantidade-minima" required min="1">
        
        <label for="quantidade-maxima">Quantidade Máxima:</label>
        <input type="number" name="quantidade-maxima" required min="1">
        
        <label for="preco">Preço (R$):</label>
        <input type="number" name="preco" required min="0" step="0.01">
    `;
    priceTiersContainer.appendChild(newTier);
}

// Função para salvar o produto
document.getElementById("product-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const nomeProduto = document.getElementById("nome-produto").value;
    const descricaoProduto = document.getElementById("descricao-produto").value;
    const priceTiers = Array.from(document.querySelectorAll("#price-tiers .price-tier")).map(tier => {
        return {
            quantidadeMinima: parseInt(tier.querySelector("input[name='quantidade-minima']").value),
            quantidadeMaxima: parseInt(tier.querySelector("input[name='quantidade-maxima']").value),
            preco: parseFloat(tier.querySelector("input[name='preco']").value)
        };
    });

    const produto = {
        nome: nomeProduto,
        descricao: descricaoProduto,
        precos: priceTiers
    };

    // Exibir o produto na lista de produtos
    displayProduct(produto);

    // Limpar o formulário
    document.getElementById("product-form").reset();
    document.getElementById("price-tiers").innerHTML = "";
    addPriceTier();  // Adiciona uma faixa de preço inicial
});

// Função para exibir o produto na lista de produtos cadastrados
function displayProduct(produto) {
    const productList = document.getElementById("product-list");
    const productItem = document.createElement("li");

    let priceDetails = "";
    produto.precos.forEach(preco => {
        priceDetails += `<p>De ${preco.quantidadeMinima} até ${preco.quantidadeMaxima} unidades: R$ ${preco.preco.toFixed(2).replace('.', ',')}</p>`;
    });

    productItem.innerHTML = `
        <strong>${produto.nome}</strong> - ${produto.descricao}
        ${priceDetails}
    `;
    productList.appendChild(productItem);
}

// Inicializar a primeira faixa de preço ao carregar a página
addPriceTier();
