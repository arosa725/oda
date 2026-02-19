function getProdutos_(ss) {
  const sh = ss.getSheetByName('Produtos');
  return sh.getRange(2, 2, sh.getLastRow() - 1, 2)
    .getValues()
    .map(l => ({ ean: String(l[0]).trim(), nome: String(l[1]).trim() }))
    .filter(p => p.ean && p.nome);
}
