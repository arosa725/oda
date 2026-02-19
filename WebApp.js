//function doGet() {
//  // Se o link tiver ?v=2 abre o index2, se não, abre o index original
//  const pagina = (e.parameter.v == '2') ? 'index2' : 'index';
//  return HtmlService.createTemplateFromFile('index')
//    .evaluate()
//    .setTitle('Inventário Mobile')
//    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
//}




function doGet(e) {
  try {
    // 1. PRIORIDADE: Pedidos de dados para o Agente Python (Impressão ou IA)
    if (e && e.parameter && e.parameter.acao) {
      if (e.parameter.acao === 'buscar_impressao') {
        var pendentes = buscarFilaImpressao();
        return ContentService.createTextOutput(JSON.stringify(pendentes))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      if (e.parameter.acao === 'confirmar') {
        confirmarImpressao(e.parameter.id);
        return ContentService.createTextOutput("OK");
      }
    }

    // 2. INTERFACE VISUAL: Seleção entre index, index2 e index_gabarito
    let versao = 'index_gabarito'; // Padrão agora é o Coletor de Gabarito
    
    if (e && e.parameter && e.parameter.v) {
      if (e.parameter.v == '1') versao = 'index';
      if (e.parameter.v == '2') versao = 'index2';
    }
    
    return HtmlService.createTemplateFromFile(versao)
      .evaluate()
      .setTitle('ODA - ' + (versao === 'index_gabarito' ? 'Coletor de Gabarito' : 'Inventário'))
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
      
  } catch (err) {
    return HtmlService.createHtmlOutput("<b>Erro no Servidor:</b> " + err.message);
  }
}
// Busca o produto na aba 'Produtos' (Coluna B=EAN, C=Nome)
function buscarProduto(ean) {
  const ss = getSS();
  const sh = ss.getSheetByName('Produtos');
  const dados = sh.getRange(2, 2, sh.getLastRow() - 1, 2).getValues();
  
  const produto = dados.find(p => p[0].toString() === ean.toString());
  return produto ? { ean: produto[0], nome: produto[1] } : null;
}

// Salva a contagem final
function salvarContagem(obj) {
  const ss = getSS();
  const shContagem = ss.getSheetByName('Contagem');
  const shConfig = ss.getSheetByName('Config');
  
  const cfg = {
    data: shConfig.getRange('B2').getValue(),
    usuario: shConfig.getRange('B3').getValue(),
    hora: shConfig.getRange('B4').getValue()
  };

  shContagem.appendRow([
    cfg.data,
    obj.ean,
    obj.nome,
    obj.qtd,
    cfg.usuario,
    cfg.hora,
    obj.localizacao  // Coluna F (Substituindo a hora pela localização vinda do usuário)
  ]);
  
  return "✅ Salvo com sucesso!";
}

function solicitarEtiqueta(dados) {
  const ss = getSS();
  let sh = ss.getSheetByName('Impressao');
  
  // Se a aba não existir, cria
  if (!sh) { sh = ss.insertSheet('Impressao'); }
  
  // Adiciona na fila: Data, EAN, SKU, Nome, Preço, Status
  sh.appendRow([
    new Date(), 
    dados.ean, 
    "SKU-" + dados.ean.substring(0,5), // Exemplo de SKU vindo do EAN
    dados.nome, 
    dados.preco, 
    "PENDENTE"
  ]);
  
  return "🏷️ Etiqueta enviada para a fila!";
}

// Chamada pelo celular ao clicar em "IMPRIMIR"
function solicitarEtiqueta(dados) {
  const sh = getSS().getSheetByName('Impressao');
  sh.appendRow([new Date(), dados.ean, dados.sku, dados.nome, dados.preco, "PENDENTE"]);
  return "🏷️ Enviado para a Tanca!";
}

// Chamada pelo Script do PC para buscar o que imprimir
function buscarFilaImpressao() {
  const ss = getSS();
  const sh = ss.getSheetByName('Impressao'); // Verifique se o nome da aba tem espaço ou acento
  if (!sh) return [];
  
  const dados = sh.getDataRange().getValues();
  let etiquetas = [];
  
  // Começa em 1 para pular o cabeçalho
  for (let i = 1; i < dados.length; i++) {
    // Se a coluna F (índice 5) for PENDENTE
    if (dados[i][5] === "PENDENTE") { 
      etiquetas.push({
        id: i + 1, // Número da linha na planilha
        ean: String(dados[i][1]),
        sku: String(dados[i][2]),
        nome: String(dados[i][3]),
        preco: String(dados[i][4])
      });
    }
  }
  return etiquetas;
}

// O PC avisa que imprimiu
function confirmarImpressao(linha) {
  const sh = getSS().getSheetByName('Impressao');
  sh.getRange(linha, 6).setValue("IMPRESSO");
}