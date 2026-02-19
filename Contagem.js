function handleContagem(e) {
  const ss = e.source;
  const sheet = ss.getSheetByName('Contagem');
  const termo = sheet.getRange('B1').getValue().toString().trim();
  
  if (!termo) return;

  const shProd = ss.getSheetByName('Produtos');
  const dados = shProd.getRange(2, 2, shProd.getLastRow() - 1, 2).getValues();
  
  // 1. Busca exata (EAN ou Nome exato)
  let encontrado = dados.find(p => p[0].toString() === termo || p[1].toString().toLowerCase() === termo.toLowerCase());

  if (encontrado) {
    preencherProduto_(sheet, encontrado[0], encontrado[1]);
    return;
  }

  // 2. Busca parcial (se não achou exato)
  let parciais = dados.filter(p => p[1].toString().toLowerCase().includes(termo.toLowerCase()));

  if (parciais.length === 1) {
    preencherProduto_(sheet, parciais[0][0], parciais[0][1]);
  } else if (parciais.length > 1) {
    // No mobile, em vez de dropdown que trava, vamos usar o Toast e limpar para nova tentativa
    ss.toast("Vários produtos encontrados. Seja mais específico ou digite o EAN.", "⚠️ Atenção");
    // Opcional: Você pode listar os nomes no Toast se forem poucos
  } else {
    ss.toast("Produto não encontrado.", "❌ Erro");
    sheet.getRange('B1').clearContent();
  }
}

function preencherProduto_(sheet, ean, nome) {
  // Limpa B1 primeiro para evitar loops
  sheet.getRange('B1').clearContent().clearDataValidation();
  
  // Preenche B2 e B3
  sheet.getRange('B2').setValue(ean);
  sheet.getRange('B3').setValue(nome);
  
  SpreadsheetApp.flush();
  
  // Foco na Quantidade B4
  sheet.getRange('B4').activate();
}