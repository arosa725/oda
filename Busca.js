function criarDropdownBusca_(ss, sheet, lista) {
  const tmp = ss.getSheetByName('_tmp_busca') || ss.insertSheet('_tmp_busca');
  tmp.clearContents();

  tmp.getRange(1, 1, lista.length, 1)
     .setValues(lista.map(p => [p.nome]));

  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInRange(tmp.getRange(1, 1, lista.length, 1), true)
    .setAllowInvalid(false)
    .build();

  sheet.getRange('B1').setDataValidation(rule).activate();
}
