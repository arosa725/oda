import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

# Carrega as variáveis de ambiente do arquivo .env (se existir)
load_dotenv()

app = Flask(__name__)
# Habilita CORS para permitir chamadas do Google Apps Script
CORS(app)

# Configura a chave de API do Gemini (buscando da variável de ambiente GEMINI_API_KEY)
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    model = None

@app.route('/')
def home():
    return jsonify({"status": "Agente Python rodando", "api_key_set": api_key is not None})

@app.route('/chat', methods=['POST'])
def chat():
    if not model:
        return jsonify({"error": "Chave de API do Gemini não configurada"}), 500
    
    try:
        data = request.json
        # Ajustado para 'msg' conforme Gabarito.js do GAS
        mensagem = data.get("msg") or data.get("mensagem", "")
        imagem_b64 = data.get("imagem")
        
        if not mensagem and not imagem_b64:
            return jsonify({"error": "Mensagem ou imagem não fornecida"}), 400
            
        content = []
        if mensagem:
            content.append(mensagem)
        
        if imagem_b64:
            # Processa a imagem base64 se enviada
            import base64
            import io
            from PIL import Image
            
            # Remove o prefixo data:image/jpeg;base64, se houver
            if "," in imagem_b64:
                imagem_b64 = imagem_b64.split(",")[1]
            
            image_data = base64.b64decode(imagem_b64)
            img = Image.open(io.BytesIO(image_data))
            content.append(img)
            
        response = model.generate_content(content)
        return jsonify({"resposta": response.text})
        
    except Exception as e:
        print(f"Erro no processamento: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
