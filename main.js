function onEdit(e) {
  if (!e) return;
  const ss = getSS();
  const range = e.range;
  const sheet = range.getSheet();
  if (sheet.getName() !== 'Contagem') return;

  const row = range.getRow();
  const col = range.getColumn();
  const valor = range.getValue();

  // B1 - Entrada de Busca ou Seleção
  if (row === 1 && col === 2) {
    if (valor === "" || valor === null) return;
    handleContagem(e);
  }

  // C4 - Checkbox para Salvar
  if (row === 4 && col === 3 && (valor === true || valor === "TRUE")) {
    incluirProduto();
  }
}