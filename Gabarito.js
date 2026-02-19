/**
 * Busca alunos na aba 'Alunos' por nome ou série.
 */
function buscarAlunos(termo) {
  const ss = getSS();
  const sh = ss.getSheetByName(SHEETS.ALUNOS);
  const dados = sh.getDataRange().getValues();
  
  // Pula o cabeçalho (i=1)
  const termoLower = termo.toLowerCase();
  return dados.slice(1)
    .filter(linha => {
      const nome = String(linha[1]).toLowerCase();
      const serie = String(linha[2]).toLowerCase();
      return nome.includes(termoLower) || serie.includes(termoLower);
    })
    .map(linha => ({ id: linha[0], nome: linha[1], serie: linha[2] }));
}

/**
 * Salva o vínculo e envia a imagem para o Agente IA (Python).
 * @param {Object} dados { alunoId, nome, serie, imagemBase64 }
 */
function vincularGabaritoIA(dados) {
  try {
    const ss = getSS();
    const shRespostas = ss.getSheetByName(SHEETS.RESPOSTAS);
    const timestamp = new Date();

    // 1. REGISTRA O INÍCIO DO PROCESSO NA PLANILHA RESPOSTAS
    shRespostas.appendRow([
      timestamp, 
      dados.nome, 
      dados.serie, 
      "PROCESSANDO IA...", 
      dados.alunoId || "MANUAL"
    ]);

    // 2. ENVIA PARA O AGENTE IA (PYTHON)
    // Aqui assumimos que o Agente IA está rodando e acessível.
    const payload = {
      msg: "Analise esta imagem de gabarito e extraia as respostas em formato JSON: [BASE64_IMAGE]",
      imagem: dados.imagemBase64 // Opcional: Se o seu script Python aceitar a imagem direta
    };

    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(AGENTE_IA_URL, options);
    const resultadoIA = JSON.parse(response.getContentText());

    // 3. SALVA O RESULTADO NA ABA QUESTOES
    // Exemplo de formato esperado da IA: { "q1": "A", "q2": "B", ... }
    const shQuestoes = ss.getSheetByName(SHEETS.QUESTOES);
    shQuestoes.appendRow([
      timestamp, 
      dados.nome, 
      dados.serie, 
      resultadoIA.resposta // Texto bruto ou JSON retornado pela IA
    ]);

    // Atualiza status na aba Respostas
    const ultimaLinha = shRespostas.getLastRow();
    shRespostas.getRange(ultimaLinha, 4).setValue("CONCLUÍDO");

    return "✅ Gabarito vinculado e processado pela IA!";
  } catch (e) {
    console.error("Erro no processamento IA: " + e.message);
    return "❌ Erro ao processar IA: " + e.message;
  }
}
