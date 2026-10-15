---
title: 'Acessibilidade nota 100 se não usar o teclado 🤡'
date: 2026-10-15
description: Como esse site é feito, o que o CI cobra antes de cada deploy e por que nota máxima de acessibilidade não garantia que dava pra usar o site sem mouse.
image: ./2026-06-03-por-que-eu-construi-esse-site-do-jeito-que-construi.jpg
imageAlt: 'Ilustração no estilo do tarô Rider-Waite: o Louco, com uma trouxa no ombro e uma rosa na mão, caminha olhando o sol na beira de um penhasco, com um cão branco aos pés, montanhas nevadas ao fundo e um rio no vale.'
---

Até 15 de outubro de 2026, esse site tirava 100 de acessibilidade no Lighthouse, passava no axe sem nenhuma violação e não deixava ninguém mover uma janela sem mouse. O CI exigia nota máxima antes de cada deploy. E cada janela se anunciava pro leitor de tela como modal, avisando que o resto da página tava bloqueado, enquanto o resto da página funcionava normal.

Não foi a primeira vez que a nota e o site discordaram. Na versão anterior, em Next.js, o Lighthouse dava entre 91 e 100 enquanto o axe achava 30 defeitos, entre eles quatro áreas com rolagem que teclado nenhum alcançava. Corrigi os 30 e a nota mudou no máximo 1 ponto em cada página. Os dois problemas das janelas eu achei do jeito antigo, apertando Tab e lendo o código. O conserto tá no commit [`72de90b`](https://github.com/jeancarlos/jeansouza.dev/commit/72de90b), com testes que quebram se eles voltarem.

![Dois gráficos de barras. À esquerda, a nota média de acessibilidade do Lighthouse no mobile, nas 11 páginas: 96,7 com Next 16 e 97,1 com Astro 7. À direita, as violações de landmark e de rolagem inacessível no axe: 30 antes e 0 depois.](/img/blog/acessibilidade-nota-vs-axe.svg)

## Por que mais um site

Eu queria um lugar pra guardar minhas ideias e mostrar com código o que o currículo diz em texto. Hoje qualquer um gera código com IA, e o que separa um projeto do outro é o julgamento de quem decide o que entra, o que sai e por quê. Um repositório aberto mostra essas decisões melhor que uma lista de tecnologias. Boa parte do código desse site foi escrita por agentes de IA, e quem decide o que entra sou eu.

É a terceira tentativa. A primeira foi HTML e CSS soltos no GitHub Pages, publicados uma vez e nunca mais revisados. A segunda trouxe Next.js com exportação estática e CI, e também parou no meio. Dessa vez eu escolhi de propósito uma interface difícil: um desktop com janelas que abrem, arrastam, redimensionam e se empilham dentro do navegador. Um blog comum dava menos trabalho. Um desktop me obriga a resolver foco, teclado, histórico do navegador e idioma, e cada um desses problemas vira assunto pra um post.

## Astro em volta, React só onde algo se mexe

O site é gerado pelo Astro 7: 12 páginas de HTML estático, construídas em menos de 5 segundos e publicadas no GitHub Pages. Cada página já chega completa do servidor, inclusive a janela que a URL representa. Se você abre `/pt/resume/`, o currículo tá no HTML, visível sem JavaScript e indexável. A posição dessas janelas é calculada em CSS com `calc()`, batendo com a conta em pixels que o React faz depois, então quando a página hidrata nada pula de lugar.

React 19 aparece numa ilha só, o desktop de janelas. O fundo de estrelas e a barra de cima também eram ilhas e viraram HTML com um script pequeno. E a ilha que sobrou espera a vez dela: uma diretiva de hidratação própria só carrega o JavaScript do desktop depois que o navegador registra a primeira pintura com conteúdo (`first-contentful-paint`), com um limite de 3 segundos caso esse evento nunca chegue. Até lá os links das janelas já funcionam, porque são links de verdade.

A migração do Next pro Astro foi medida com o mesmo script, o mesmo Chrome e a mesma máquina, mediana de três execuções por página. O JavaScript transferido nas 11 páginas caiu de 10.966 KB pra 5.464 KB, metade ([a comparação completa](https://github.com/jeancarlos/jeansouza.dev/blob/4981616/docs/migration/comparison.md)). Depois disso, com uma ilha só e a hidratação adiada, o mesmo script mede 246 KB de JavaScript em cada página, sem compressão: são os pontos verdes do gráfico. Comprimida, do jeito que o navegador recebe, a home em português transfere 95 KB. O CI hoje exige 100 de desempenho no Lighthouse em sete páginas, pegando a melhor de três execuções.

![Dois gráficos de halteres com três pontos, uma linha por página, com as 11 páginas do site. À esquerda, o JavaScript transferido no mobile, sem compressão, caiu de cerca de 1.025 KB com Next 16 para cerca de 492 KB na migração pro Astro 7 e pra 246 KB hoje, em todas as páginas; a home foi de 662 pra 492 e depois pra 246 KB. À direita, o desempenho mobile no Lighthouse subiu de valores entre 61 e 77 para valores entre 79 e 81 na migração, e hoje fica entre 93 e 100.](/img/blog/next-vs-astro-por-pagina.svg)

As dependências que deviam ter saído na migração saíram enquanto eu escrevia esse texto. Primeiro o `react-markdown`: com o post maior, reprocessar o Markdown no navegador durante a hidratação deixou a nota de desempenho dessa página em 99 na melhor execução, e o CI exige 100. Agora o HTML do post vem pronto do build, e o tempo de bloqueio caiu de até 260 ms pra 20. Depois o `framer-motion` e o `focus-trap-react`: arrastar janela virou pointer events nativos, as animações viraram CSS, e o JavaScript do desktop caiu de 205 KB pra 53 KB antes da compressão.

O idioma de cada post fica no nome do arquivo, tipo `slug.pt.md`. O carregador de conteúdo padrão do Astro transforma o nome em slug e cola o sufixo, gerando `...construipt`, que não dá pra separar de volta. Uma `generateId` de uma linha preserva o nome original.

## A URL decide o idioma

Antes do corte pro Astro, todas as páginas do site em produção diziam `lang="pt"`, inclusive as em inglês. O sitemap listava só a home e um post. E tinha um componente que lembrava o idioma que você escolheu e redirecionava qualquer página pra ele: se você preferia português e alguém te mandava um link pra `/en/`, você caía em `/pt/`.

Agora quem manda é a URL. `/en/` é inglês e `/pt/` é português, pra qualquer pessoa. A raiz `/` serve a home em inglês e só redireciona pra `/pt/` quem tem português salvo como preferência ou configurado no navegador. A troca de idioma virou um link de verdade com `hreflang`, cada página declara as versões `pt-BR`, `en-US` e `x-default`, e o sitemap traz essas alternativas com a data real da última mudança de cada página, em vez da hora do build repetida em todas.

Os botões Currículo, Blog e + da home também viraram links. Antes eram `<button>`, e a página inicial não tinha um único link interno: nada de abrir em nova aba, nada pra um buscador seguir. O texto de apresentação da home passou a ser o `h1` da página.

O último bug dessa leva era do botão Voltar. Cada janela aberta empurrava duas entradas no histórico do navegador, e o Voltar não fechava a janela que você esperava ([#20](https://github.com/jeancarlos/jeansouza.dev/issues/20)). Hoje o gerenciador de janelas é dono da URL: abrir uma janela empurra uma entrada só, fechar a janela que criou a entrada atual volta uma posição, e Voltar e Avançar abrem e fecham janelas pra combinar com a URL.

## O que nenhuma nota mede

Boa parte das decisões de acessibilidade do site não aparece em relatório automático nenhum. Elas aparecem quando alguém usa o site de um jeito diferente do meu.

O fundo de estrelas se mexe, a frase da home é digitada letra por letra e as janelas abrem com um pulinho. Quem configurou o sistema pra reduzir movimento recebe a mesma página parada: as estrelas são desenhadas uma vez e ficam, a frase aparece inteira e as janelas surgem sem animação. O site escuta essa preferência ao vivo, então se você muda a configuração com a página aberta, o fundo para ou volta a andar na hora. Quase abri um bug por causa disso: o fundo parou de se mexer na minha máquina, e o motivo era o GNOME com as animações desligadas, avisando o navegador que eu prefiro menos movimento.

Esconder também tem regra. O link "Pular para o conteúdo" fica fora da tela até receber foco, em vez de usar `display: none`, porque um elemento removido do layout sai também da ordem do Tab e vira enfeite. A região que anuncia mudanças pro leitor de tela usa a mesma técnica: invisível na tela, presente na árvore de acessibilidade.

Contraste e tamanho de alvo têm número. Todo texto passa de 4,5:1 nos dois temas, e o cinza dos subtítulos no tema claro, que tava em 4,06, subiu pra 5,1. As janelas que ficavam atrás das outras caíam pra 60% de opacidade, o que derrubava o contraste de tudo dentro delas, e agora ficam opacas. Os três botões coloridos do topo de cada janela ganharam área de 24 por 24 pixels, o mínimo do WCAG 2.2. E o lint trata as regras recomendadas do `jsx-a11y` como erro, então um `<img>` sem `alt` não chega no deploy.

As quatro áreas que o teclado não alcançava eram corpos de janela com rolagem. Um elemento que rola mas não recebe foco não tem como ser rolado pelo teclado, então cada corpo de janela virou uma região com nome e `tabindex="0"`.

O resto das decisões tá nas janelas. Elas são `role="dialog"` sem `aria-modal`, porque o desktop continua utilizável com uma janela aberta, e dizer o contrário pro leitor de tela seria mentir. O título de cada janela virou um botão chamado "Mover ~/blog", e o nome falado contém o texto visível pra quem usa comando de voz conseguir acionar. Enter entra no modo de mover: as setas movem, Alt com setas redimensiona, Shift aumenta o passo, Enter confirma e Esc desfaz sem fechar a janela. Pra quem usa ponteiro mas não consegue arrastar, um botão de posições no cabeçalho coloca a janela no canto superior esquerdo, no centro ou no canto superior direito com um clique. O Tab nunca fica preso, porque sair do botão confirma a posição. E a região de status fala só três vezes, ao entrar no modo, ao confirmar e ao cancelar, nunca a cada seta.

Essa parte tem história. Uma versão acessível das janelas existia no repositório desde 23 de agosto, com os papéis certos, modo de mover por teclado e testes, e nunca foi ligada às janelas de verdade. Na limpeza de código morto de 15 de outubro ela foi apagada junto ([`68596ac`](https://github.com/jeancarlos/jeansouza.dev/commit/68596ac)), e a limpeza tava tecnicamente certa: nenhum código de produção usava aquilo. Refiz o comportamento direto nas janelas reais no mesmo dia ([`72de90b`](https://github.com/jeancarlos/jeansouza.dev/commit/72de90b)) e depois o botão de posições ([`489a40f`](https://github.com/jeancarlos/jeansouza.dev/commit/489a40f)), com testes que agora rodam contra o componente que você usa.

## O que o CI cobra

Cada push pra `main` passa por essa fila, e qualquer falha segura o deploy: `npm ci`, `astro sync`, ESLint, Prettier em modo de verificação, `tsc`, `astro check`, Vitest, o build, o axe e o Lighthouse. O `astro sync` vem antes do lint porque o ESLint usa as informações de tipo do TypeScript, e sem os tipos que o Astro gera ele quebra no import de `astro:content`.

Essa garantia é recente. Até o commit [`f007038`](https://github.com/jeancarlos/jeansouza.dev/commit/f007038), o workflow de deploy não dependia do de qualidade, e um build vermelho ia pro ar do mesmo jeito. Agora o deploy chama a verificação e só publica se ela passar. As actions tão fixadas por hash de commit, então uma tag movida não muda o que roda, cada job tem só as permissões que precisa e duas execuções na mesma branch não rodam ao mesmo tempo. Antes disso, durante uns quatro meses, o CI nem rodava: os workflows apontavam pra um runner no meu servidor que não existia mais, cada execução ficava na fila até ser cancelada, e eu publicava no GitHub Pages na mão. Nenhum commit desse período passou por lint, tipos ou testes antes de ir pro ar.

O Lighthouse roda em sete páginas, três vezes cada, e exige 100 nas quatro categorias: desempenho, acessibilidade, boas práticas e SEO. Vale a melhor das três execuções, porque runner compartilhado é barulhento: uma regressão de verdade derruba as três, e uma primeira execução fria não derruba o deploy. Depois do que contei na abertura, sei bem o que esse 100 de acessibilidade garante: que eu não pioro o que o Lighthouse sabe medir. O axe roda nas mesmas sete páginas, em tema claro e escuro, no desktop e no celular, e qualquer violação também segura o deploy.

O ESLint roda com os conjuntos `strictTypeChecked` e `stylisticTypeChecked` do typescript-eslint. Promise sem tratamento é erro, e um `switch` sobre uma união precisa cobrir todos os casos. Duas regras seguram a complexidade: nenhuma função passa de 10 caminhos independentes e nenhum bloco aninha mais de quatro níveis. Quando uma função bate no limite, ela é quebrada em funções menores. São 3.586 linhas de código-fonte fora os testes, e o maior componente tem 204.

O gerenciador de janelas mostra o efeito disso. O estado de todas as janelas passa por um reducer, uma função pura que recebe o estado e uma ação e devolve o estado novo. As ações formam uma união discriminada com sete tipos: abrir, fechar, focar, expandir, minimizar, mover e redimensionar. Como o reducer não toca no DOM, dá pra testar empilhamento e foco sem renderizar nada, e o TypeScript recusa uma ação que o reducer esqueceu de tratar.

## Testes com nome de frase

São 165 testes em 36 arquivos, e a suíte inteira roda em menos de 40 segundos na minha máquina. O nome de cada teste diz o comportamento que ele protege, e lidos em sequência eles viram uma especificação do site.

Alguns protegem coisas que o leitor percebe na hora quando quebram. Um confere que os arquivos de tradução em português e inglês têm exatamente as mesmas chaves. Outro garante que uma chave que não existe lança erro em vez de aparecer `undefined` na tela. Outro checa que a URL antiga desse post, de antes de eu mudar o nome, continua existindo como redirecionamento com `rel="canonical"` apontando pra nova. E tem um que bloqueia o `localStorage` de propósito e confere que o tema cai pro escuro em vez de quebrar a página, porque navegação privada e algumas configurações de privacidade fazem exatamente isso.

Os de acessibilidade seguem a mesma ideia. Um verifica que existe uma regra de `prefers-reduced-motion` que mostra a frase da home inteira, sem animação. Os das janelas cobrem o modo de mover pelo teclado (setas, Shift, Alt, Escape que desfaz sem fechar a janela) e o botão de posições. Um deles se chama "never traps the keyboard" e confere que o Tab continua levando o foco adiante mesmo com o modo ativo. Antes de commitar esses testes, tirei de propósito as linhas que eles protegem e confirmei que eles falhavam.

As duas correções das janelas que contei lá em cima foram escritas por um agente de IA e passaram pela mesma fila de checagens de qualquer commit. É parecido com o que o Uncle Bob descreveu em julho: em vez de revisar linha por linha o que os agentes escrevem, ele cerca o trabalho deles com testes e limites de complexidade, porque código bagunçado deixa os agentes mais lentos ([explainx.ai](https://www.explainx.ai/blog/uncle-bob-ai-coding-gauntlet-tests-not-reviews-july-2026)). As ferramentas que uso pra isso tão abertas no [codex-harness](https://github.com/jeancarlos/codex-harness), e o jeito como eu desenvolvo com IA vai ganhar um post só dele.

## O que eu chamo de confiável

Site estático não tem banco pra cair nem servidor pra reiniciar, e mesmo assim muita coisa pode dar errado. Pra mim, confiável aqui quer dizer cinco coisas, e cada uma tem uma checagem por trás.

O build é reproduzível: `npm ci` instala exatamente o que tá no lockfile, e o CI usa sempre o Node 22. Link publicado continua valendo, e por isso a URL antiga desse post virou redirecionamento em vez de 404, com teste garantindo. O conteúdo existe sem JavaScript: a janela que a URL representa já vem no HTML, e os links das janelas funcionam antes da hidratação. Tudo funciona pelo teclado, e isso também é testado. E as dependências não acumulam alerta: o Astro subiu pra 7.3.8 por causa de uma falha crítica de execução remota de código na otimização de imagens AVIF, mesmo sendo uma falha que um site estático não alcança, e em 15 de outubro o `npm audit` não acusava nenhuma vulnerabilidade.

## O que fica

Nenhuma das correções das janelas mexeu numa nota. O Lighthouse deu 100 antes e depois, o axe deu zero antes e depois, e no meio disso as janelas mentiam pro leitor de tela e só andavam com mouse. A versão certa delas existia, tinha teste, e foi apagada como código morto, porque nenhum desses testes rodava contra a janela que você usa.

Checagem automática só protege o que tá ligado nela. A nota é o piso: impede que eu piore o que a ferramenta sabe medir. O resto aparece quando alguém aperta Tab, liga um leitor de tela ou desliga as animações do sistema, e cada coisa que aparece assim vira teste no componente de verdade, pra não depender de alguém apertar Tab de novo.

Faz isso no seu site: fecha o mouse na gaveta e navega cinco minutos só com o teclado.
