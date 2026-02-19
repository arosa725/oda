import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

# Configuração de Log
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Carrega as variáveis de ambiente do arquivo .env (se existir)
load_dotenv()

app = Flask(__name__)
# Habilita CORS para permitir chamadas do Google Apps Script e de outros domínios
CORS(app)

# Configura a chave de API do Gemini (buscando da variável de ambiente GEMINI_API_KEY)
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        logger.info("Modelo Gemini configurado com sucesso.")
    except Exception as e:
        logger.error(f"Erro ao configurar modelo Gemini: {str(e)}")
        model = None
else:
    logger.warning("GEMINI_API_KEY não encontrada. O chat não funcionará.")
    model = None

@app.route('/')
def home():
    logger.info("Acesso à rota raiz (/)")
    return jsonify({
        "status": "Agente Python rodando",
        "api_key_set": api_key is not None,
        "model_loaded": model is not None
    })

@app.route('/chat', methods=['POST'])
def chat():
    if not model:
        logger.error("Tentativa de chat sem modelo configurado.")
        return jsonify({"error": "Chave de API do Gemini não configurada"}), 500
    
    try:
        data = request.json
        # Ajustado para 'msg' conforme Gabarito.js do GAS
        mensagem = data.get("msg") or data.get("mensagem", "")
        imagem_b64 = data.get("imagem")
        
        logger.info(f"Recebida requisição de chat. Mensagem: {mensagem[:50]}...")
        
        if not mensagem and not imagem_b64:
            logger.warning("Requisição de chat sem mensagem ou imagem.")
            return jsonify({"error": "Mensagem ou imagem não fornecida"}), 400
            
        content = []
        if mensagem:
            content.append(mensagem)
        
        if imagem_b64:
            logger.info("Processando imagem base64...")
            import base64
            import io
            from PIL import Image
            
            # Remove o prefixo data:image/jpeg;base64, se houver
            if "," in imagem_b64:
                imagem_b64 = imagem_b64.split(",")[1]
            
            image_data = base64.b64decode(imagem_b64)
            img = Image.open(io.BytesIO(image_data))
            content.append(img)
            
        logger.info("Enviando conteúdo para o Gemini...")
        response = model.generate_content(content)
        logger.info("Resposta recebida do Gemini com sucesso.")
        
        return jsonify({"resposta": response.text})
        
    except Exception as e:
        logger.exception(f"Erro no processamento da rota /chat: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Quando rodando localmente (fora do Docker), usa porta 5000
    app.run(host='0.0.0.0', port=5000)
