---
title: 'Reconstruindo o jeansouza.dev: Um Simulador de OS e Stack Moderna'
date: 2026-06-03
description: Como migrei de uma configuração jurássica do Create React App para um simulador de sistema operacional com Next.js 15, Framer Motion e interações ultra-refinadas.
---

## O Chamado de Alerta

Meu site pessoal estava congelado no tempo. Por baixo dos panos, ele era movido pelo Create React App — uma ferramenta oficialmente arquivada e descontinuada pela equipe do React em 2023. Usava React 16, Stylus para estilos e era publicado manualmente através do CLI `gh-pages`. Embora funcionasse, não era algo que eu pudesse apontar com orgulho como reflexo das minhas habilidades e padrões atuais de engenharia.

Para nós, desenvolvedores de software, nosso portfólio pessoal é nosso cartão de visitas digital. Olhar para aquela stack antiga dava a sensação de visitar um museu, não um portfólio de tecnologia. Era hora de uma reconstrução completa do zero.

## O Objetivo: Um Desktop no Navegador

Eu não queria fazer apenas mais um portfólio comum de "scroll infinito". Queria algo que parecesse vivo, interativo, com um toque de nostalgia, mas tecnicamente robusto. Decidi simular um ambiente de Desktop baseado em janelas direto no navegador.

Os requisitos centrais eram rígidos:

1. **Sem excessos (No Bloat)**: Nada de bibliotecas pesadas de terceiros da era do jQuery para gerenciar janelas. Tinha que ser construído do zero usando React moderno e Framer Motion.
2. **Interação de Alta Fidelidade**: As janelas precisavam ser arrastáveis, redimensionáveis (em todas as 8 direções), minimizáveis, expansíveis e cientes de foco.
3. **Estático e Rápido**: O site precisava exportar como HTML 100% estático (`output: 'export'`) para rodar diretamente de uma CDN (GitHub Pages), mantendo tempos de carregamento na casa dos milissegundos.
4. **Deeplinking (Links Diretos)**: Acessar `/blog/algum-post` não deveria carregar apenas uma página em branco; deveria inicializar o simulador de desktop e abrir a janela específica daquele post automaticamente, preservando URLs limpas via `history.pushState`.

## A Mudança de Stack

Aqui está um comparativo direto de como a stack antiga se posiciona frente à nova arquitetura reconstruída:

| Preocupação     | Antes                          | Depois                                    |
| :-------------- | :----------------------------- | :---------------------------------------- |
| **Framework**   | Create React App 3 (Arquivado) | Next.js 15 (App Router)                   |
| **Linguagem**   | JavaScript                     | TypeScript                                |
| **Estilização** | Stylus CSS                     | Tailwind CSS + CSS Modules                |
| **Animações**   | Transições CSS básicas         | Framer Motion (AnimatePresence)           |
| **Ícones**      | FontAwesome 5                  | FontAwesome 6                             |
| **Deployments** | CLI `gh-pages` manual          | GitHub Actions (Runner Local Self-hosted) |

---

## Mergulho Técnico: A Engenharia por Trás das Janelas

Construir um gerenciador de janelas em React parece fácil até você começar a lidar com problemas de escape de cursor (drift), gargalos de layout (layout thrashing) e limites da tela (viewport clamping).

### 1. Pointer Capture & Redimensionamento em 8 Direções

Um bug clássico em componentes de arrastar/redimensionar no navegador acontece quando o usuário move o mouse muito rápido, fazendo com que o ponteiro saia da caixa de colisão do handle e quebre a interação.

Para contornar isso, usei a **Pointer Capture API** (`setPointerCapture`). Quando um evento de clique (`pointerdown`) é detectado em qualquer uma das 8 bordas de redimensionamento (`n`, `s`, `e`, `w`, `ne`, `nw`, `se`, `sw`), nós vinculamos o ID do ponteiro àquele handle específico:

```typescript
const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
  e.stopPropagation()
  focusWindow(windowId)
  e.currentTarget.setPointerCapture(e.pointerId)
  // ... inicializa coordenadas do estado de arraste
}
```

Isso garante que todos os movimentos subsequentes do cursor sejam direcionados ao handle, mesmo que o mouse passe rapidamente para fora dos limites físicos da janela.

Para evitar _layout thrashing_ (que causa travamento ou engasgo de animações em dispositivos mais modestos), nós limitamos as atualizações usando `requestAnimationFrame`:

```typescript
rafRef.current = requestAnimationFrame(() => {
  if (pendingRef.current) {
    resizeWindow(windowId, pendingRef.current.size, pendingRef.current.position)
    pendingRef.current = null
  }
  rafRef.current = null
})
```

### 2. Efeito de Origem Física (O Pop-in Realista)

Quando um usuário clica para abrir uma janela (como ler um post a partir do explorador de arquivos do Blog), abrir o modal centralizado na tela de forma genérica quebra a imersão. No lugar disso, nós capturamos o retângulo exato do botão que disparou o clique usando `getBoundingClientRect()` e passamos essas coordenadas para a nova janela:

```typescript
const rect = e.currentTarget.getBoundingClientRect()
onOpenPost(post, { x: rect.left, y: rect.top, width: rect.width, height: rect.height })
```

O Framer Motion então assume essas coordenadas como os limites `initial` (de partida), fazendo a janela expandir dinamicamente a partir do botão clicado. Ao fechar, ela faz o caminho reverso, encolhendo de volta para o botão antes de sumir.

### 3. Reducer de Foco e zIndex

Para simular um ambiente de desktop real, as janelas ativas precisam se destacar. O estado de todas as janelas é gerenciado por uma única máquina de estados com `useReducer`. Ao focar em uma janela, seu `zIndex` é elevado para o topo da pilha.

As janelas que perdem o foco não ficam apenas atrás; elas recuam visualmente usando um filtro CSS (`blur(2px)`) e têm a opacidade reduzida para `0.6`, direcionando a atenção do usuário para a janela ativa.

---

## Sincronização de URLs: Site Estático, Rotas Dinâmicas

Como o Next.js compila o projeto inteiro em arquivos estáticos (`out/`), não temos um servidor Node ativo para interpretar as rotas dinamicamente no servidor em tempo de execução. Mesmo assim, queríamos a sensação de um aplicativo de página única com URLs amigáveis e compartilháveis.

Para alcançar isso, nós interceptamos a navegação padrão. Sempre que uma janela é aberta ou ganha foco, atualizamos a barra de endereços dinamicamente:

```typescript
history.pushState(null, '', topWindow.url)
```

Se o usuário acessar o site digitando diretamente `/pt/blog/como-modernizei-meu-site`, o servidor de arquivos estáticos do GitHub Pages serve o export estático correspondente. Quando o aplicativo React monta no cliente, o componente `HomeClient` lê a URL atual e engatilha a abertura automática da janela correspondente no gerenciador de janelas. É o melhor dos dois mundos: carregamento instantâneo com SEO otimizado aliado a um simulador de sistema operacional completo.

## Internacionalização (i18n) e Persistência

Manter o site bilíngue (Português e Inglês) exigiu a integração do `next-intl`. Como o build estático impede o uso de middlewares de roteamento dinâmico no servidor, criamos um espelhamento no client-side usando cookies e `localStorage`. Caso ocorra uma divergência entre a rota e a preferência armazenada pelo usuário ao montar a página, forçamos um redirecionamento suave pelo navegador.

## O Pipeline de Deploy Automatizado

Em vez de depender de servidores em nuvem de terceiros, configurei um runner self-hosted do GitHub Actions rodando em um servidor local na minha casa. Toda vez que faço um push:

1. O runner baixa o código atualizado.
2. Executa o build (`npm run build`), acionando o compilador do Next.js.
3. O Node lê todos os posts sob `src/content/posts/` usando o módulo `fs`, interpreta os metadados com `gray-matter`, traduz o Markdown para HTML limpo usando `remark` e os injeta nos componentes.
4. O diretório final (`out/`) é enviado automaticamente para a branch `gh-pages`.

Rápido, local e sem custos extras.

## O Que Vem a Seguir?

Reescrever meu portfólio foi um lembrete do porquê o desenvolvimento front-end é divertido: está tudo nos pequenos detalhes. Sim, eu poderia ter usado um template genérico de portfólio, mas programar pointer captures customizados, tratar limites matemáticos do viewport de arraste e organizar reducers de janelas é onde a engenharia realmente ganha vida.

Fique à vontade para arrastar as janelas, redimensioná-las, mudar o idioma ou abrir o terminal. Sinta-se em casa!
