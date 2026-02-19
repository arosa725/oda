const SPREADSHEET_ID = '1YA5Jv5KP60pTwWK3bmRc2xUw9VAFvs7RZSj9JwYRljw';

// Configurações de Abas
const SHEETS = {
  ALUNOS: 'Alunos',
  QUESTOES: 'questoes',
  RESPOSTAS: 'Respostas',
  CONFIG: 'Config'
};

// URL do seu Agente Python (Ajustada para o domínio de produção no Traefik)
const AGENTE_IA_URL = 'https://api.lab.inetz.com.br/chat'; 

/**
 * Retorna a instância da planilha principal.
 */
function getSS() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getConfigData_(ss) {
  const sh = ss.getSheetByName(SHEETS.CONFIG);
  return {
    data: sh.getRange('B2').getValue(),
    usuario: sh.getRange('B3').getValue(),
    hora: sh.getRange('B4').getValue()
  };
}
