# NatiShop - MVP E-commerce

Este é um projeto de e-commerce moderno e minimalista desenvolvido como Produto Mínimo Viável (MVP). O sistema conta com uma vitrine de produtos, gerenciamento de carrinho de compras e um painel de administração protegido para gerenciamento do catálogo e visualização de pedidos.

## 🚀 Tecnologias

- **Framework:** [Next.js](https://nextjs.org/) (App Router & Server Actions)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) (Padrão editorial em tons de *Zinc* e serifas)
- **Banco de Dados:** PostgreSQL (Serveless via [Neon DB](https://neon.tech/))
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Autenticação:** [Auth.js / NextAuth](https://authjs.dev/) (Formato JWT com Credentials)
- **Gerenciamento de Estado:** [Zustand](https://github.com/pmndrs/zustand) (Carrinho persistido via localStorage)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Pagamentos:** Preparado para [Stripe](https://stripe.com/)

## ✨ Funcionalidades

### 🛍️ Área do Cliente (Vitrine)
- **Catálogo de Produtos:** Listagem com design focado na apresentação de itens essenciais.
- **Carrinho de Compras:** Adição de itens, controle de quantidade e verificação automática de estoque restante.
- **Persistência Offline:** O carrinho não é perdido se a pessoa atualizar a página.

### 💼 Painel Administrativo (`/admin`)
- **Acesso Protegido:** Área isolada acessível apenas através da página de `/login`.
- **Dashboard:** Visão geral rápida para os indicadores da loja.
- **Gestão de Produtos:** Formulário integrado direto com o banco de dados Neon DB para adicionar novos itens ao catálogo, fotos, preços (salvos em centavos), estoque, e dados de frete (Melhor Envio).
- **Listagem de Pedidos:** Acompanhamento do status das compras.

## 🛠️ Como executar localmente

### 1. Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18.x ou superior)
- Conta no [Neon DB](https://neon.tech/) para hospedar o banco
- Chave no [Stripe](https://stripe.com/)

### 2. Instalação
Clone o projeto e instale as dependências:
\`\`\`bash
npm install
\`\`\`

### 3. Configuração de Variáveis de Ambiente
Crie ou configure o arquivo \`.env\` na raiz do projeto contendo:

\`\`\`env
# Banco de dados
DATABASE_URL="postgresql://USUARIO:SENHA@SEU-HOST.neon.tech/neondb?sslmode=require&channel_binding=require"

# Pagamentos
STRIPE_SECRET_KEY="sua_chave_do_stripe"

# Chave interna do NextAuth para criptografia da sessão
AUTH_SECRET="chave_gerada_aleatoriamente"

# Credenciais de acesso ao painel de administração
ADMIN_EMAIL="admin@loja.local"
ADMIN_PASSWORD="admin"
\`\`\`
*(Dica: Para gerar uma \`AUTH_SECRET\` forte, utilize o comando \`openssl rand -base64 32\` no terminal).*

### 4. Rodando o servidor
Inicie o ambiente de desenvolvimento:
\`\`\`bash
npm run dev
\`\`\`
- Acesse a loja publicamente: [http://localhost:3000](http://localhost:3000)
- Acesse a área gerencial: [http://localhost:3000/login](http://localhost:3000/login)

## 🗄️ Estrutura do Banco de Dados
A tabela principal utiliza os seguintes schemas via Drizzle:
- **Produtos:** \`id\`, \`name\`, \`slug\`, \`price\` (centavos), \`inventory\`, \`imageUrl\`, \`description\`, peso/dimensões.
- **Pedidos (Orders):** \`id\`, \`totalAmt\`, \`status\` (*pending, paid, shipped*), etc.
- **Usuários (Auth):** Estrutura padrão exigida pelo Auth.js (via *adapter*).

---

> Desenvolvido com foco em alta conversão visual e fluxo direto de compra.
