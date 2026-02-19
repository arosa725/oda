/**
 * mock-gas.js
 * 
 * Este script simula o objeto 'google.script.run' para permitir o teste do front-end
 * fora do ambiente do Google Apps Script (ex: rodando no Nginx ou localmente).
 * 
 * Para usar, adicione no seu HTML:
 * <script src="mock-gas.js"></script>
 */

if (typeof google === 'undefined') {
  console.warn("Ambiente Google Apps Script não detectado. Carregando MOCK para testes.");
  
  window.google = {
    script: {
      run: {
        withSuccessHandler: function(callback) {
          this._successHandler = callback;
          return this;
        },
        withFailureHandler: function(callback) {
          this._failureHandler = callback;
          return this;
        },
        
        // --- Mock das funções do seu projeto ---
        
        buscarProduto: function(ean) {
          console.log("[MOCK] Chamando buscarProduto para EAN:", ean);
          // Simula um delay de rede
          setTimeout(() => {
            if (ean === "123") {
              this._successHandler({ ean: "123", nome: "Produto de Teste (Mock)" });
            } else {
              this._successHandler(null);
            }
          }, 500);
          return this;
        },
        
        salvarContagem: function(obj) {
          console.log("[MOCK] Chamando salvarContagem com dados:", obj);
          setTimeout(() => {
            this._successHandler("✅ [MOCK] Salvo com sucesso!");
          }, 500);
          return this;
        },
        
        buscarAlunos: function(termo) {
          console.log("[MOCK] Chamando buscarAlunos para termo:", termo);
          setTimeout(() => {
            const alunos = [
              { id: 1, nome: "João Silva", serie: "9º ano" },
              { id: 2, nome: "Maria Oliveira", serie: "1º médio" }
            ].filter(a => a.nome.toLowerCase().includes(termo.toLowerCase()));
            this._successHandler(alunos);
          }, 500);
          return this;
        },
        
        vincularGabaritoIA: function(payload) {
          console.log("[MOCK] Chamando vincularGabaritoIA com payload:", payload);
          // Aqui você poderia redirecionar para o seu backend Python local se quisesse
          setTimeout(() => {
            this._successHandler("✅ [MOCK] Gabarito vinculado!");
          }, 2000);
          return this;
        }
      }
    }
  };
}
