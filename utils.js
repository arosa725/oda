function incluirProduto() {
  const ss = getSS();
  const sheet = ss.getSheetByName('Contagem');
  const cfgSh = ss.getSheetByName('Config');

  const ean = sheet.getRange('B2').getValue();
  const nome = sheet.getRange('B3').getValue();
  const qtd = sheet.getRange('B4').getValue();

  if (!ean || !qtd) {
    ss.toast("Dados incompletos!", "⚠️");
    sheet.getRange('C4').setValue(false);
    return;
  }

  // Pega dados da aba Config
  const data = cfgSh.getRange('B2').getValue();
  const usuario = cfgSh.getRange('B3').getValue();
  const hora = cfgSh.getRange('B4').getValue();

  // Salva (Histórico abaixo da linha 6)
  const destRow = Math.max(sheet.getLastRow() + 1, 7);
  sheet.getRange(destRow, 1, 1, 6).setValues([[data, ean, nome, qtd, usuario, hora]]);

  // RESET TOTAL
  sheet.getRange('B1:B4').clearContent();
  sheet.getRange('C4').setValue(false);
  
  SpreadsheetApp.flush();
  sheet.getRange('B1').activate();
  ss.toast("Salvo com sucesso!", "✅");
}