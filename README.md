# Faturamento Inteligente — Grupo Raízes

POC navegável do novo fluxo de faturamento das operações **Cucinari** e **Quitanda Escolas**.

## Executar

```bash
npm install
npm run dev -- --port 7277
```

Acesse: `http://localhost:7277`

No Windows, o arquivo `iniciar-ambiente.bat` inicia o servidor e abre o navegador automaticamente.

## Fluxo disponível

- Login demonstrativo.
- Seleção do ambiente Cucinari ou Quitanda Escolas.
- Cucinari com Indústrias Aurora, Hospital Santa Clara e Grupo Horizonte.
- Memória de cálculo por cenário.
- Boletos simulados, sem valor fiscal ou bancário.
- Quitanda com três colégios, cinco alunos por colégio, RA/crachá e modalidades pré/pós-pago.

Os valores e documentos são fictícios. Não há integração ativa com bancos, sistemas fiscais ou Teknisa.

## Documentação vigente

O fluxo funcional, as premissas, decisões pendentes e o backlog estão em:

- [`docs/NOVO_FLUXO_E_BACKLOG.md`](docs/NOVO_FLUXO_E_BACKLOG.md)

## Validação

```bash
npm run typecheck
npm test
npm run build
```

O projeto ainda não possui arquivos de teste automatizado; esse item está registrado no backlog.
