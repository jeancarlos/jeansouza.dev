# jeansouza.dev — Agent Guidelines

## Commits

Nunca adicionar "Co-Authored-By" em commits. Não incluir nenhuma assinatura de co-autoria.

## Maintainability Loop

A check de manteinabilidade é parte do gate de qualidade. Roda via:

```bash
npm run maintainability   # scan estático próprio
npm run check             # full gate: lint + format + maintainability + test + build
```

### Princípios

- **Validação real, não custom.** Para problemas conhecidos (XSS, focus trap, schemas, dates), usar libs consagradas. Exemplos já aplicados: `focus-trap-react` para modal a11y, `rehype-sanitize` para MD→HTML seguro, `useSyncExternalStore` para fontes externas de estado, `MutationObserver` para mudanças de atributo.
- **Sem disables de lint como atalho.** Quando uma regra dispara, refatorar o código até a regra ser satisfeita. Exceções legítimas (ex.: `dangerouslySetInnerHTML` em MD sanitizado) recebem comentário inline explicando a decisão.
- **Funções/componentes pequenos.** Helpers puros no mesmo arquivo; componentes com responsabilidades distintas em arquivos separados. Target: < 200 linhas por arquivo, complexidade < 10.
- **Tipos estritos.** Sem `any`. Sem casts desnecessários. Custo: tipar de forma que o compilador ajude.
- **Efeitos síncronos antes do paint usam `useLayoutEffect`.** Estado externo (localStorage, media queries, observers) usa `useSyncExternalStore`. Refs não são mutados em render.
- **SSR-safe.** Estado inicial via lazy initializer para evitar `return null` no server. Cuidado com hydration mismatch em hooks client-only.

### Workflow de loop

1. Rodar `npm run check` para mapear falhas.
2. Para cada finding, classificar:
   - **Real bug/perf** → corrigir agora.
   - **Anti-pattern** → extrair helper, mover p/ hook canônico, ou trocar por lib.
   - **Decisão consciente** → comentário inline justificando + suprimir (raro).
3. Re-rodar `npm run check`. Iterar até zero errors e findings apenas nas decisões conscientes documentadas.
4. Build 100% + tests 100% + lint 0 + prettier 0 + maintainability só com exceções justificadas.

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
