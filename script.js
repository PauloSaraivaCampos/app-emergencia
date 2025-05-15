document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('emergenciaForm');

  // REGISTRO DO FORMULÁRIO
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nome = document.getElementById('nome').value;
      const cidade = document.getElementById('cidade').value;
      const bairro = document.getElementById('bairro').value;
      const telefone = document.getElementById('telefone').value;
      const observacoes = document.getElementById('observacoes').value;

      const situacoes = [];
      document.querySelectorAll('input[name="situacao"]:checked').forEach(cb => {
        situacoes.push(cb.value);
      });

      const status = "em-atendimento";

      const novoCaso = {
        id: Date.now(),
        nome,
        cidade,
        bairro,
        telefone,
        situacoes,
        observacoes,
        status,
        data: new Date().toLocaleString()
      };

      let casos = JSON.parse(localStorage.getItem('casos')) || [];
      casos.push(novoCaso);
      localStorage.setItem('casos', JSON.stringify(casos));

      document.getElementById('mensagem').innerText = "Emergência registrada com sucesso!";
      form.reset();
    });
  }

  // LISTAGEM DOS CASOS (painel.html)
  const listaDiv = document.getElementById('listaCasos');

  function atualizarLista() {
    if (!listaDiv) return;

    const casos = JSON.parse(localStorage.getItem('casos')) || [];
    listaDiv.innerHTML = "";

    if (casos.length === 0) {
      listaDiv.innerHTML = "<p>Nenhum caso registrado.</p>";
    } else {
      casos.forEach(caso => {
        const card = document.createElement('div');
        card.className = "caso";

        let statusTexto = "Em Atendimento";
        if (caso.status === "atendido") statusTexto = "Atendido";
        if (caso.status === "cancelado") statusTexto = "Cancelado";

        card.innerHTML = `
          <strong>${caso.nome}</strong><br>
          <em>Cidade:</em> ${caso.cidade} - <em>Bairro:</em> ${caso.bairro}<br>
          <em>Telefone:</em> ${caso.telefone}<br>
          <em>Situações:</em> ${caso.situacoes.join(', ')}<br>
          <em>Observações:</em> ${caso.observacoes || "Nenhuma"}<br>
          <span class="status ${caso.status}"><strong>Status:</strong> ${statusTexto}</span><br>
          <small>${caso.data}</small>
          <div class="acoes">
            <button onclick="alterarStatus(${caso.id}, 'atendido')">Atendido</button>
            <button onclick="alterarStatus(${caso.id}, 'em-atendimento')">Em Atendimento</button>
            <button onclick="alterarStatus(${caso.id}, 'cancelado')">Cancelar</button>
            <button onclick="excluirCaso(${caso.id})" class="btn-excluir">Excluir</button>
          </div>
        `;
        listaDiv.appendChild(card);
      });
    }
  }

  atualizarLista();

  // ALTERAR STATUS
  window.alterarStatus = function (id, novoStatus) {
    let casos = JSON.parse(localStorage.getItem('casos')) || [];
    const index = casos.findIndex(c => c.id === id);
    if (index !== -1) {
      casos[index].status = novoStatus;
      localStorage.setItem('casos', JSON.stringify(casos));
      atualizarLista();
    }
  };

  // EXCLUIR CASO
  window.excluirCaso = function (id) {
    let casos = JSON.parse(localStorage.getItem('casos')) || [];
    casos = casos.filter(c => c.id !== id);
    localStorage.setItem('casos', JSON.stringify(casos));
    atualizarLista();
  };
});
