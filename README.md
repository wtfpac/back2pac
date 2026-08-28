# Back 2 Pac

Site e blog pessoal. Bilíngue (pt-BR / en-US), tema claro e
escuro, blog em Markdown, contadores de visualização e curtida.

**Produção:** https://back2pac.vercel.app

## Stack

| Camada | Ferramenta |
|---|---|
| Framework | Next.js 16 (App Router) |
| Interface | React 19, CSS com variáveis |
| Fonte | Commit Mono (`@fontsource/commit-mono`) |
| Conteúdo | Markdown (`gray-matter`, `remark`) |
| CMS | Decap CMS em `/admin` |
| Contadores | Upstash Redis |
| Hospedagem | Vercel |

## Estrutura

```
content/
├── posts/pt/          um .md por post
├── posts/en/          mesmo nome de arquivo, traduzido
└── settings.json      siteUrl, flags de recurso

public/admin/          painel do Decap CMS

src/
├── app/[lang]/        páginas, uma versão por idioma
├── app/api/           auth do painel, contadores
├── app/globals.css    estilos e paleta
├── components/
├── dictionaries/      pt.json e en.json (todo o texto do site)
├── lib/               content (fs), redis, slug
└── proxy.js           redireciona / para /pt ou /en
```

Regras: nenhum texto no JSX (vai nos dicionários, com chaves idênticas nos dois
idiomas); `lib/content.js` importa `fs` e é exclusivo do servidor, `lib/slug.js`
é puro e pode ser importado no cliente.

## Comandos

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # roda o mesmo que a Vercel
npm run lint
```

## Variáveis de ambiente

| Variável | Uso |
|---|---|
| `GITHUB_CLIENT_ID` | OAuth do painel |
| `GITHUB_CLIENT_SECRET` | OAuth do painel |
| `KV_REST_API_URL` | Upstash Redis |
| `KV_REST_API_TOKEN` | Upstash Redis |

Injetadas pelas integrações na Vercel. Localmente:

```bash
npx vercel link
npx vercel env pull
```

`BUILD_TIME` é gerado pelo `next.config.mjs` no build.

## Novo post

Pelo painel em `/admin`, ou criando os arquivos à mão em `content/posts/pt/` e
`content/posts/en/` com o mesmo nome — ele vira a URL e liga as duas versões.

```markdown
---
title: "Título"
date: "2026-08-28"
summary: "Uma linha, aparece na listagem."
categories: ["Infraestrutura"]
---

Conteúdo em Markdown.
```

Categorias não são cadastradas: existem porque aparecem em algum post.

## Currículo

O conteúdo de `/about` vem de `src/dictionaries/pt.json` e `en.json`.

## Deploy

Push em `main` publica. Outras branches ganham URL de pré-visualização.
Rode `npm run build` antes de commitar.
