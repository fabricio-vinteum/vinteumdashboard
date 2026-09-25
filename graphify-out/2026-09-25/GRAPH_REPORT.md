# Graph Report - Projeto de Dashboard  (2026-09-25)

## Corpus Check
- 23 files · ~16,320 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 112 nodes · 220 edges · 10 communities (8 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f9236984`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dependencies
- react
- sheetsParser.js
- dataContext.jsx
- devDependencies
- App.jsx
- authService.js
- .oxlintrc.json
- generate-hash.js

## God Nodes (most connected - your core abstractions)
1. `useData()` - 19 edges
2. `react` - 15 edges
3. `formatNumber()` - 12 edges
4. `formatCurrency()` - 9 edges
5. `scripts` - 5 edges
6. `ErrorBoundary` - 5 edges
7. `ComparisonSection()` - 5 edges
8. `MetricCard()` - 5 edges
9. `fetchDashboardCsv()` - 5 edges
10. `formatPercent()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `DashboardContent()` --calls--> `useData()`  [EXTRACTED]
  src/App.jsx → src/services/dataContext.jsx
- `ComparisonSection()` --calls--> `useData()`  [EXTRACTED]
  src/components/ComparisonSection.jsx → src/services/dataContext.jsx
- `OverviewView()` --calls--> `useData()`  [EXTRACTED]
  src/views/OverviewView.jsx → src/services/dataContext.jsx
- `RetentionView()` --calls--> `useData()`  [EXTRACTED]
  src/views/RetentionView.jsx → src/services/dataContext.jsx
- `RevenueView()` --calls--> `useData()`  [EXTRACTED]
  src/views/RevenueView.jsx → src/services/dataContext.jsx

## Import Cycles
- None detected.

## Communities (10 total, 2 thin omitted)

### Community 0 - "dependencies"
Cohesion: 0.15
Nodes (13): chart.js, lucide-react, dependencies, chart.js, lucide-react, papaparse, react, react-chartjs-2 (+5 more)

### Community 1 - "react"
Cohesion: 0.20
Nodes (9): 1. Configurar as Secrets no GitHub, 2. Ativar o GitHub Pages via Actions, 3. Enviar o Código para o Repositório, Como gerar um novo usuário e senha:, 🚀 Como Publicar no GitHub Pages (Passo a Passo), 💻 Desenvolvimento Local, 🌟 Principais Funcionalidades, 🔒 Segurança e Controle de Acesso (Sem Exposição no GitHub) (+1 more)

### Community 2 - "sheetsParser.js"
Cohesion: 0.38
Nodes (10): react, ComparisonSection(), FunnelChart(), MetricCard(), formatCurrency(), formatNumber(), formatPercent(), OverviewView() (+2 more)

### Community 3 - "dataContext.jsx"
Cohesion: 0.29
Nodes (9): DataContext, DataProvider(), fetchDashboardCsv(), parseCsvText(), saveToCache(), cleanNumber(), cleanPercent(), MONTH_NAMES_MAP (+1 more)

### Community 4 - "devDependencies"
Cohesion: 0.10
Nodes (20): oxlint, devDependencies, oxlint, @types/react, @types/react-dom, vite, @vitejs/plugin-react, name (+12 more)

### Community 7 - "authService.js"
Cohesion: 0.19
Nodes (16): App(), DashboardContent(), Header(), LoginModal(), Sidebar(), authenticateUser(), computeSHA256(), EXPECTED_HASH (+8 more)

### Community 8 - ".oxlintrc.json"
Cohesion: 0.25
Nodes (7): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema, oxc, warn

## Knowledge Gaps
- **33 isolated node(s):** `$schema`, `oxc`, `react/rules-of-hooks`, `warn`, `hash` (+28 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `sheetsParser.js` to `.oxlintrc.json`, `dataContext.jsx`, `authService.js`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._
- **Why does `plugins` connect `.oxlintrc.json` to `sheetsParser.js`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `devDependencies`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **What connects `$schema`, `oxc`, `react/rules-of-hooks` to the rest of the system?**
  _33 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._