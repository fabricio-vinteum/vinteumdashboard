# Vinteum SaaS Intelligence · Live Executive Dashboard 📊⚡

Dashboard executivo moderno, responsivo e sincronizado em **tempo real** com a planilha oficial do Google Sheets da **Vinteum (Neigbrs)**. Construído para ser hospedado gratuitamente no **GitHub Pages** com zero custos de infraestrutura e sem necessidade de servidor backend.

Identidade visual 100% alinhada à marca oficial da [Vinteum](https://vinteum.io/): Midnight Navy (`#150D43`), Vinteum Orange (`#F07010`), Vinteum Green (`#61CE70`) e tipografia Montserrat.

---

## 🔒 Segurança e Controle de Acesso (Sem Exposição no GitHub)

O repositório pode ser **100% público** sem que a sua senha fique visível para ninguém:

1. **Criptografia Unidirecional SHA-256 com Salt:** A senha em texto puro NUNCA é enviada para o GitHub e NUNCA fica no código-fonte.
2. **GitHub Repository Secrets:** Os valores de acesso são injetados durante a compilação do GitHub Actions através de variáveis de ambiente secretas:
   - `VITE_AUTH_USER`: Nome do usuário (ex: `admin`)
   - `VITE_AUTH_SALT`: Chave de salgamento criptográfico (ex: `vinteum_dashboard_secure_salt_2026`)
   - `VITE_AUTH_HASH`: Hash SHA-256 gerado para a combinação `usuario:senha:salt`
3. **Ambiente Local Seguro:** No desenvolvimento local, as credenciais residem exclusivamente no arquivo `.env.local`, protegido e listado no `.gitignore`.

### Como gerar um novo usuário e senha:
Basta rodar no seu terminal:
```bash
node generate-hash.js "seu_usuario" "sua_senha_secreta"
```
O script exibirá exatamente o hash e os valores para você colar nas Secrets do GitHub ou no `.env.local`.

---

## 🌟 Principais Funcionalidades

1. **Sincronização em Tempo Real (Aba Oficial `Dashboard`):**
   - Conexão direta com a aba `Dashboard` (GID: `2067051393`) via Google Visualization API com *cache-busting* (`_t=${timestamp}`).
   - Intervalos de auto-refresh configuráveis no topo da tela (**30s**, **1 min**, **5 min** ou **Manual**).
   - Botão **"Sincronizar"** para forçar a atualização imediata ao editar qualquer valor na planilha.
   - Cache resiliente no `localStorage` para carregamento instantâneo.

2. **Filtro Inteligente de Períodos:**
   - **🌟 Ano Todo (Até a data vigente):** Consolida os dados acumulados de janeiro até o último mês com dados preenchidos.
   - **Trimestres (Q1 a Q4):** Agrupamento automático de metas e realizado por trimestre.
   - **Meses Vigentes:** Deteção dinâmica de quais meses possuem dados preenchidos na planilha, com indicação visual (`●` com dados, `○` sem dados).

3. **Painel de Comparativo Interativo:**
   - **Trimestre a Trimestre (QoQ):** Compare o desempenho de qualquer trimestre contra outro lado a lado (ex: Q1 vs Q2).
   - **Mês a Mês (MoM):** Selecione livremente dois meses (ex: Janeiro vs Fevereiro) e veja o delta nominal e percentual (Δ e %).
   - Métricas de MRR, Vendas, Churn, NPS, Tráfego e Funil comparadas instantaneamente.

4. **Visão Executiva (Cockpit):**
   - KPIs de **Novo MRR**, **Vendas**, **Churn de Clientes** e **Crescimento Líquido**.
   - **Funil Comercial Interativo:** Acompanhamento de Visitantes ➔ Leads ➔ MQL ➔ SQL ➔ Demonstrações ➔ Vendas, com taxas de conversão e perda.
   - Gráfico de **Evolução do MRR (12 Meses)** com barras de realizado e linha de meta.

---

## 🚀 Como Publicar no GitHub Pages (Passo a Passo)

### 1. Configurar as Secrets no GitHub
No seu repositório no GitHub (`https://github.com/fabricio-vinteum/vinteumdashboard`):
1. Acesse **Settings** > **Secrets and variables** > **Actions**.
2. Clique em **New repository secret** e adicione as 3 variáveis:
   - **Name:** `VITE_AUTH_USER` | **Value:** `admin` (ou seu usuário)
   - **Name:** `VITE_AUTH_SALT` | **Value:** `vinteum_dashboard_secure_salt_2026`
   - **Name:** `VITE_AUTH_HASH` | **Value:** `94eacec7f4c0ea5dd4092a9acd664969c6ee735c675dbe95bdd6bf65813e011d` (ou o hash gerado pelo `node generate-hash.js`)

### 2. Ativar o GitHub Pages via Actions
1. No repositório, clique em **Settings** > **Pages**.
2. Em **Build and deployment** > **Source**, selecione:
   👉 **GitHub Actions**

### 3. Enviar o Código para o Repositório
No terminal desta pasta, execute:
```bash
git init
git add .
git commit -m "feat: Vinteum Live Executive Dashboard com autenticacao segura"
git branch -M main
git remote add origin https://github.com/fabricio-vinteum/vinteumdashboard.git
git push -u origin main
```

Após o push, o GitHub Actions fará o build seguro e o deploy automático.
Acesse o seu dashboard em:
👉 **`https://fabricio-vinteum.github.io/vinteumdashboard/`**

---

## 💻 Desenvolvimento Local

```bash
# Iniciar o servidor de desenvolvimento
npm run dev
```

Abra `http://localhost:5173` no seu navegador.
As credenciais padrão locais são:
- **Usuário:** `admin`
- **Senha:** `vinteum2026`
