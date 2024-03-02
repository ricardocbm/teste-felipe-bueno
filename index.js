const endpoints = [
  'https://sistemalift1.com/lift_ps/api/Clientes',
  'https://sistemalift1.com/lift_ps/api/Pedidos',
  'https://sistemalift1.com/lift_ps/api/Produtos',
  'https://sistemalift1.com/lift_ps/api/ItensPedido'
];

async function fetchData(url) {
  const response = await fetch(url);
  return response.json();
}

async function populateTable() {
  const tableBody = document.querySelector('#tabela_ListaDePedidos tbody');

  const fetchAllData = async () => {
    const fetchedData = await Promise.all(endpoints.map(fetchData));
    return fetchedData;
  };

  const [clients, orders, products, orderItems] = await fetchAllData();

  const clientMap = new Map(clients.map(client => [client.id, client.nome]));
  const orderItemsMap = new Map();
  for (const orderItem of orderItems) {
    if (!orderItemsMap.has(orderItem.pedido)) {
      orderItemsMap.set(orderItem.pedido, []);
    }
    orderItemsMap.get(orderItem.pedido).push(orderItem);
  }

  const rows = orders.map(order => {
    const clientName = clientMap.get(order.cliente);
    const orderItemsArray = orderItemsMap.get(order.id);
    const row = [order.id, clientName, order.data, orderItemsArray
      .map(orderItem => {
        const product = products.find(p => p.id === orderItem.produto);
        return product.valor;
      })
      .reduce((acc, curr) => acc + curr, 0)
    ];
    return row;
  });

  rows.forEach(row => {
    const tr = document.createElement('tr');
    row.forEach(cell => {
      const td = document.createElement('td');
      td.textContent = cell;
      tr.appendChild(td);
    });
    tableBody.appendChild(tr);
  });

  // Adiciona um manipulador de eventos de clique às células da coluna "Pedido"
  const pedidoCells = document.querySelectorAll('#tabela_ListaDePedidos tbody td:nth-child(1)');
  pedidoCells.forEach(cell => {
    cell.addEventListener('click', () => {
      const idPedido = cell.textContent.trim();
      const url = `Pagina2.html?id_pedido=${idPedido}`;
      window.location.href = url;
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  populateTable();
});