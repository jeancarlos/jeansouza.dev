# jeansouza.dev — Agent Guidelines

## Commits

Nunca adicionar "Co-Authored-By" em commits. Não incluir nenhuma assinatura de co-autoria.

## Maintainability Principles

- **Validação real, não custom.** p/ problemas conhecidos (XSS, focus trap, schemas, dates), usar libs consagradas. Exemplos aplicados: `focus-trap-react` p/ modal a11y, `react-markdown` + `rehype-sanitize` p/ MD→React seguro, `useSyncExternalStore` p/ fontes externas de estado, `MutationObserver` p/ mudanças de atributo.
- **s/ disables de lint como atalho.** Quando regra dispara, refatorar código até regra ser satisfeita. Nenhuma exceção legítima remanescente.
- **fns/componentes pequenos.** Helpers puros mesmo arquivo; componentes c/ responsabilidades distintas em arquivos separados. Target: < 200 linhas por arquivo, complexidade < 10.
- **Tipos estritos.** s/ `any`. s/ casts desnecessários. Custo: tipar de forma que compilador ajude.
- **Efeitos síncronos antes paint usam `useLayoutEffect`.** Estado externo (localStorage, media queries, observers) usa `useSyncExternalStore`. Refs não são mutados em render.
- **SSR-safe.** Estado inicial via lazy initializer p/ evitar `return null` server. C/ `useSyncExternalStore`garantir q cliente e server batem (ou usar CSS puro p/ show/hide baseado em viewport, evitando flash de hydration).
- **Show/hide por viewport:** usar Tailwind `hidden md:flex` em vez de `if (isMobile) return null` — CSS puro não tem hydration mismatch.
- **Design tokens, não hex literais.** Cores `@theme` `globals.css`referenciadas como classes Tailwind (`bg-brand-from` `text-brand-text`). Tailwind v4 gera utilities automaticamente partir CSS variables.
- **MD→React via react-markdown, não HTML cru.** Sanitização boundary via `rehype-sanitize`. Nenhum `dangerouslySetInnerHTML` deve aparecer código.

### Quality gate

```bash
npm run lint              # eslint
npm run format:check      # prettier
npm test                  # vitest
npm run build             # next build
```

Loop: rodar tudo, mapear falhas, corrigir, re-rodar. Iterar até zero errors em todos gates.

<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:ca08a54f -->

## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

### Rules

- Use `bd` for ALL task tracking — NOT use TodoWrite, TaskCreate, or markdown TODO lists
- Run `bd prime` for detailed command reference and session close protocol
- Use `bd remember` for persistent knowledge — NOT use MEMORY.md files

## Session Completion

**When ending work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd dolt push
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**

- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
<!-- END BEADS INTEGRATION -->
