# Novo fluxo e backlog — Faturamento Inteligente Grupo Raízes

## Objetivo

Reconstruir a POC mantendo a identidade visual do Grupo Raízes, mas separando completamente os ambientes **Cucinari** e **Quitanda Escolas**. A demonstração deve seguir cada valor desde a regra contratual e o consumo até a memória de cálculo e o boleto simulado.

> Todo dado, preço, documento e integração desta POC é fictício. Nenhum boleto possui valor fiscal ou bancário e nenhuma ação escreve no Teknisa.

## Jornada principal

1. O usuário acessa o login demonstrativo.
2. Após entrar, escolhe Cucinari ou Quitanda Escolas.
3. Cada operação abre um ambiente independente.
4. O usuário escolhe um cliente e consulta contrato, consumo e adicionais.
5. A memória de cálculo explica quantidades, preço unitário e subtotais.
6. Após conferência, a cobrança segue para um boleto Teknisa simulado.
7. O usuário pode trocar de operação ou encerrar a sessão.

## História principal

**Como** analista financeiro,  
**quero** acessar um ambiente demonstrativo, selecionar uma operação e acompanhar a composição da cobrança por cliente e competência,  
**para** validar quantidades contratadas, consumos e adicionais antes da emissão simulada do boleto.

## Novas telas

### Login

- E-mail e senha obrigatórios.
- Credenciais preenchidas apenas para facilitar a demonstração.
- Aviso de que não se trata de autenticação de produção.

### Seleção de operação

- Cucinari: contratos corporativos, refeições e adicionais.
- Quitanda Escolas: alunos, RA/crachá, pré-pago e pós-pago.
- Dados e estados das operações permanecem segregados.

### Cucinari

- Visão geral da competência.
- Cenários e contratos.
- Memória de cálculo por cliente.
- Boletos simulados.

### Quitanda Escolas

- Três colégios e cinco alunos por colégio.
- Identificação por RA ou crachá.
- Modalidades pré-pago, pós-pago e mista.
- Extrato e cobrança por aluno serão aprofundados no próximo incremento.

## Cenários Cucinari

### Indústrias Aurora

Regra corrigida: existem **300 funcionários** e cada funcionário recebe uma unidade de cada serviço por dia. Portanto, são 300 cafés da manhã, 300 almoços, 300 jantares e 300 lanches noturnos diariamente. O número sete representa os dias da semana: em uma semana completa são 2.100 unidades de cada serviço.

| Serviço | Por dia | Dias | No mês | Preço fictício | Subtotal |
|---|---:|---:|---:|---:|---:|
| Café da manhã | 300 | 31 | 9.300 | R$ 8,50 | R$ 79.050,00 |
| Almoço | 300 | 31 | 9.300 | R$ 18,00 | R$ 167.400,00 |
| Jantar | 300 | 31 | 9.300 | R$ 17,00 | R$ 158.100,00 |
| Lanche da noite | 300 | 31 | 9.300 | R$ 9,50 | R$ 88.350,00 |
| **Total** | **1.200** |  | **37.200** |  | **R$ 492.900,00** |

Premissa mantida: a operação funciona todos os dias de julho, inclusive fins de semana. O tratamento de feriados ainda deve ser confirmado.

### Hospital Santa Clara

- Contrato-base fictício: 200 refeições por dia.
- Separação por **Diretoria**, **Funcionários** e **Pacientes**.
- Distribuição demonstrativa: 24 da Diretoria, 86 de funcionários e 90 de pacientes por dia.
- Convidados aparecem como adicional separado.
- Exemplo: 84 convidados × R$ 22,00 = R$ 1.848,00.
- Base fictícia: R$ 93.000,00; total simulado: R$ 94.848,00.

Pendente: definir se convidados são sempre adicionais ou se consomem a franquia diária.

### Grupo Horizonte

- Segunda a sexta, somente almoço, 20 funcionários por dia.
- Julho/2026 possui 23 dias de segunda a sexta, sem tratamento de feriados nesta versão.
- 23 × 20 = 460 almoços.
- Preço fictício: R$ 19,50; total simulado: R$ 8.970,00.

## Quitanda Escolas

| Colégio | Modalidade | Alunos | Identificação |
|---|---|---:|---|
| Colégio Horizonte | Pré-pago | 5 | RA e crachá |
| Escola Nova Geração | Pós-pago | 5 | RA e crachá |
| Colégio Caminhos | Pré e pós-pago | 5 | RA e crachá |

No pré-pago, uma recarga gera saldo e cada consumo identificado gera débito. No pós-pago, os consumos aprovados da competência são consolidados em uma cobrança individual por aluno, vinculada ao responsável financeiro. Ainda faltam validar cardápio, preços, pagadores reais e a política de saldo insuficiente.

## Cobrança e boleto Teknisa simulado

`Contrato/plano → consumo identificado → regra → adicionais → conferência humana → aprovação → boleto simulado → histórico`

O documento mostra pagador, competência, vencimento, base, adicionais e total, sempre com a marca **SIMULAÇÃO — SEM VALOR FISCAL OU BANCÁRIO**. O código de barras é decorativo e não há linha digitável funcional. “Teknisa” representa apenas a saída futura esperada; não existe integração ativa nem reprodução de layout oficial sem modelo autorizado.

## Critérios de aceite

1. Usuário não autenticado visualiza o login e campos vazios exibem erro.
2. Após entrar, o usuário escolhe Cucinari ou Quitanda Escolas.
3. Uma operação não exibe dados da outra; é possível trocar de operação e sair.
4. Aurora mostra quatro serviços, 300 unidades de cada serviço por dia e 37.200 refeições no mês.
5. Hospital mostra três públicos e convidados como adicional separado.
6. Grupo Horizonte considera apenas segunda a sexta e somente almoço.
7. Quitanda mostra três colégios, cinco alunos por colégio e RA/crachá.
8. Pré-pago e pós-pago são visualmente distintos.
9. A memória de cálculo apresenta base, adicionais e total.
10. O boleto é explicitamente fictício e não contém dados pagáveis.
11. A interface funciona em desktop, tablet e celular.

## Backlog priorizado

### P0 — fundação e Cucinari navegável

- [x] Substituir as telas antigas pelo novo fluxo.
- [x] Criar login e seleção de operação.
- [x] Segregar visualmente os ambientes.
- [x] Criar visão geral e três cenários Cucinari.
- [x] Criar memória de cálculo e boleto fictício.
- [ ] Persistir sessão e operação com expiração segura.
- [ ] Criar rotas navegáveis e proteção de rotas.

### P1 — regras e fechamento Cucinari

- [ ] Centralizar contratos e calendários em fixtures tipadas.
- [ ] Isolar fórmulas em funções puras e testáveis.
- [ ] Criar grade diária da Aurora.
- [ ] Detalhar Hospital por dia, público e serviço.
- [ ] Configurar franquia e convidados do Hospital.
- [ ] Tratar feriados, faltas, convidados e excedentes do Grupo Horizonte.
- [ ] Criar estados de apuração, revisão, aprovação e boleto.
- [ ] Criar histórico e adapter mock do Teknisa.

### P1 — Quitanda Escolas

- [x] Criar três colégios, quinze alunos e mostrar RA/crachá.
- [ ] Criar detalhe do aluno e responsável financeiro.
- [ ] Criar catálogo e preço de refeições.
- [ ] Criar recarga, saldo e extrato pré-pago.
- [ ] Criar captura e fechamento pós-pago.
- [ ] Validar identificadores duplicados.
- [x] Criar cobrança/extrato individual por aluno e vincular o responsável fictício.

### P2 — qualidade

- [ ] Testes unitários das fórmulas e competências.
- [ ] Testes de componentes e E2E da jornada principal.
- [ ] Revisão de acessibilidade e teclado.
- [ ] Pesquisa, filtros, exportação e auditoria.
- [ ] Revisão de segurança e aceite final do PO.

## Arquitetura alvo

O protótipo continua local em React + TypeScript. A evolução deve separar os domínios `auth`, `operations`, `cucinari`, `quitanda`, `billing` e `teknisa`, com fixtures próprias. Funções previstas: `calculateAuroraBilling`, `calculateHospitalDailyAllowance`, `calculateHorizonteBilling`, `calculatePrepaidConsumption`, `calculatePostpaidBilling` e `buildSimulatedBoleto`.

## Definition of Ready

- [x] Objetivo, jornada, cenários e critérios iniciais definidos.
- [ ] Valores e regras contratuais validados pelo negócio.
- [ ] Política de adicionais do Hospital confirmada.
- [ ] Regras financeiras da Quitanda confirmadas.
- [ ] Papel e modelo autorizado do Teknisa confirmados.

## Definition of Done

- [ ] Login, sessão, logout e proteção de rotas funcionando.
- [ ] Separação Cucinari/Quitanda validada.
- [ ] Três cenários Cucinari e três escolas demonstráveis.
- [ ] Fórmulas cobertas por testes e boleto rastreável.
- [ ] Fluxo principal coberto por E2E.
- [ ] Responsividade e acessibilidade revisadas.
- [ ] Typecheck, testes e build aprovados.
- [ ] Regras e valores aprovados pelo negócio.
