function aplicarProduto_(sheet, row, produto) {
  const ss = getSS();
  const cfg = ss.getSheetByName('Config');

  sheet.getRange(row, 1).setValue(cfg.getRange('B2').getValue()); // Data
  sheet.getRange(row, 2).setValue(produto.ean);                  // EAN
  sheet.getRange(row, 3).setValue(produto.nome);                 // Produto
  sheet.getRange(row, 5).setValue(cfg.getRange('B3').getValue()); // Usuário
  sheet.getRange(row, 6).setValue(new Date());                   // Timestamp

  sheet.getRange(row, 4).activate(); // Quantidade
}

