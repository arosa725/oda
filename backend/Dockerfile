# Use uma imagem leve do Python
FROM python:3.9-slim

# Define o diretório de trabalho no container
WORKDIR /app

# Instala as dependências do sistema necessárias para algumas bibliotecas (se houver)
RUN apt-get update && apt-get install -y --no-install-recommends 
    build-essential 
    && rm -rf /var/lib/apt/lists/*

# Copia o arquivo de requisitos e instala as dependências do Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia o código da aplicação
COPY . .

# Expõe a porta que o Flask vai rodar (padrão 5000)
EXPOSE 5000

# Variáveis de ambiente padrão
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

# Comando para iniciar a aplicação
CMD ["flask", "run"]
