# Giveaway Tool Juan Personal

Aplicacao web para conduzir sorteios com experiencia visual personalizada.

Permite cadastrar participantes e premios, executar o sorteio com contagem regressiva + rolagem de nomes, registrar ganhadores e manter o estado salvo no navegador.

## Funcionalidades

- Cadastro de participantes via texto (1 nome por linha)
- Remocao automatica de nomes duplicados (comparacao case-insensitive em pt-BR)
- Gerenciamento dinamico de premios (adicionar, editar e remover)
- Sorteio animado com contagem regressiva, rolagem e confetti
- Lista de resultados por ordem de sorteio
- Persistencia de dados em localStorage
- Acao de reiniciar sorteio e limpar todos os dados

## Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- Zustand (estado global + persistencia)
- Framer Motion (animacoes)
- Canvas Confetti (efeito de comemoracao)

## Requisitos

- Node.js 20.19+ ou 22.12+
- pnpm (recomendado)

## Instalacao

1. Instale as dependencias:

   pnpm install

2. Rode em desenvolvimento:

   pnpm dev

3. Abra no navegador a URL exibida no terminal (por padrao http://localhost:5173).

## Scripts

- pnpm dev: inicia o servidor de desenvolvimento
- pnpm build: faz type-check e build de producao
- pnpm preview: sobe a versao buildada localmente
- pnpm lint: executa ESLint
- pnpm lint:fix: corrige problemas de lint quando possivel
- pnpm format: formata arquivos com Prettier
- pnpm format:check: valida formatacao sem alterar arquivos

## Fluxo de uso

1. Preencha a lista de participantes (um nome por linha).
2. Configure os premios.
3. Clique em Sortear agora.
4. Acompanhe o resultado e o historico na secao Resultados.

## Regras de sorteio

- Participante nao pode ganhar duas vezes no mesmo ciclo.
- O primeiro sorteio define o ultimo premio da lista.
- O ultimo sorteio conclui o Premio #1 (premio principal).
- Alterar a lista de premios limpa os resultados para manter consistencia.

## Persistencia

O estado do sorteio e salvo em localStorage na chave:

pt-premium-raffle

Isso inclui:

- texto de participantes
- lista de premios
- resultados ja sorteados

## Estrutura principal

src/

- components/setup: cadastro de participantes e premios
- components/draw: etapa de sorteio e lista de ganhadores
- store: estado global e acoes do sorteio
- lib: regras de negocio e efeitos auxiliares
- types: tipagens do dominio

## Build de producao

1. Gere o build:

   pnpm build

2. Valide localmente:

   pnpm preview

## Solucao de problemas

- Erro de versao do Node no build/preview:
  atualize para Node.js 20.19+ (ou 22.12+).

## Autor

- Aislã Lucio
