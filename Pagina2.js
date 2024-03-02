const urlParams = new URLSearchParams(window.location.search);
const pedidoId = urlParams.get('id_pedido');

const endpoints = [
  'https://sistemalift1.com/lift_ps/api/Clientes',
  `https://sistemalift1.com/lift_ps/api/Pedidos/${pedidoId}`,
  'https://sistemalift1.com/lift_ps/api/Produtos',
  'https://sistemalift1.com/lift_ps/api/ItensPedido'
];

async function fetchData(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error('Erro ao obter os dados:', error);
    throw error;
  }
}

async function populateTable() {
  try {
    const fetchedData = await Promise.all(endpoints.map((url, i) => fetchData(url)));

    // Obtém os dados do cliente do codigo_pedido selecionado
    const pedido = fetchedData[1];
    const clientes = fetchedData[0].filter(c => c.id === pedido.cliente);
    const cliente = clientes[0];

    // Preenche os dados do cliente na tabela
    document.querySelector('#nome_cliente').textContent += cliente.nome;
    document.querySelector('#cpf_cliente').textContent += cliente.cpf;
    document.querySelector('#data_pedido').textContent += pedido.data;
    document.querySelector('#email_cliente').textContent += cliente.email;

    // Obtém os dados dos itens do pedido
    const itensPedido = fetchedData[3].filter(item => item.pedido === pedidoId);

    // Cria a tabela de itens do pedido
    const tableBody = document.querySelector('#tabela_ItensDoPedido tbody');
    itensPedido.forEach(item => {
      const produto = fetchedData[2].find(p => p.id === item.produto);

      const tr = document.createElement('tr');
      const tdCodigo = document.createElement('td');
      tdCodigo.textContent = item.codigo_pedido;
      tr.appendChild(tdCodigo);
      const tdProduto = document.createElement('td');
      tdProduto.textContent = produto.nome;
      tr.appendChild(tdProduto);
      const tdQuantidade = document.createElement('td');
      tdQuantidade.textContent = item.quantidade_itemPedido;
      tr.appendChild(tdQuantidade);
      const tdValor = document.createElement('td');
      tdValor.textContent = item.valor_total_produto;
      tr.appendChild(tdValor);

      tableBody.appendChild(tr);
    });

    // Obtém o valor total do pedido
    const itensPedidoComValor = itensPedido.map(item => item.quantidade_itemPedido * fetchedData[2].find(p => p.id === item.produto).valor);
    const valorTotalPedido = itensPedidoComValor.reduce((total, currentValue) => total + currentValue, 0);

    // Exibe o valor total do pedido
    const totalElement = document.createElement('p');
    totalElement.textContent = `Valor Total do Pedido: R$${valorTotalPedido.toFixed(2)}`;
    document.querySelector('#valor_total_pedido').appendChild(totalElement);
  } catch (error) {
    console.error('Erro ao popular a tabela:', error);
  }
}

populateTable();