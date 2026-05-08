## Plan: MVP E-commerce para Deploy na Vercel

O projeto base e a estrutura de pastas estão prontos. Para chegarmos a um nível de deploy funcional (MVP com compras reais), precisamos integrar o banco de dados, autenticação, front-end da loja, integrações externas (frete/pagamento) e a área de admin.

**Steps**

**Fase 1: Infraestrutura Básica (Banco e Autenticação)**
1. Configurar Drizzle ORM e Neon DB: implementar conexão do banco e setup do Drizzle Kit (`drizzle.config.ts`) para migrações.
2. Setup Auth.js (NextAuth v5): configurar provedores de login e, se necessário, o `@auth/drizzle-adapter` para manter sessões no banco (*parallel with step 1*).

**Fase 2: Vitrine e Carrinho (Storefront)**
3. Loja Pública: implementar listagem de produtos e página de detalhes do produto em Server Components.
4. Carrinho de Compras: criar Zustand store ou Contexto global e os componentes UI do carrinho (*depends on step 3*).
5. Cálculo de Frete: finalizar a Server Action do Melhor Envio conectando o frontend para simular cotação.

**Fase 3: Checkout, Pagamento e Estoque**
6. Intenção de Pagamento: integrar Stripe Checkout via Server Action para gerar a sessão de pagamento.
7. Webhook de Confirmação: criar listener do Stripe para registrar o pedido no banco, realizar baixa do estoque via SQL transacional e disparar e-mail (*depends on step 6*).
8. E-mail Transacional: integrar React Email + Resend no Webhook para notificar a loja e o cliente que o pagamento foi confirmado. 

**Fase 4: Cache e Área Administrativa**
9. Dashboard Admin: tela protegida com Auth.js para listar pedidos recentes e status de envios.
10. Estratégia de Cache: implementar `revalidatePath` em mutações (como baixa de estoque ou adição de produto) garantindo ISR veloz.
11. Checklist Deploy Vercel: levantar todas as variáveis de ambiente necessárias e realizar o push do código.

**Relevant files**
- `drizzle.config.ts` — Nova configuração para rodar push do schema.
- `src/db/index.ts` — Setup do pool serverless do Neon.
- `src/auth.ts` e `src/app/api/auth/[...nextauth]/route.ts` — Inicialização do NextAuth.
- `src/app/(shop)/page.tsx` — Busca de produtos no banco e listagem (Server Component).
- `src/app/api/webhooks/route.ts` — Webhook Stripe e baixa transacional de inventário.
- `src/actions/checkout.ts` — Inicialização da Stripe Session e criação "Pendente" da Order no BD.

**Verification**
1. Testar migração do banco com `npx drizzle-kit push`.
2. Mockar 2 a 3 produtos diretamente no banco.
3. Testar cálculo do Melhor Envio no ambiente Sandbox informando CEP válido.
4. Simular fluxo de compra com cartão de teste no Checkout do Stripe e verificar redução de `-1` no estoque.
5. Fazer build de produção local `npm run build` para checar falhas de tipagem ou conflitos de SSR.

**Decisions**
- Focar no Stripe como provedor inicial pela facilidade máxima de integração do Checkout via redirecionamento e webhooks blindados.
- Tratar carrinho no client-side (`localStorage`) para desonerar o DB de sessões abandonadas, persistindo apenas Checkout e Orders.