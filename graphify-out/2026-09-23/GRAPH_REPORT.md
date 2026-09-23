# Graph Report - .  (2026-09-23)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 103 nodes · 145 edges · 11 communities (8 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8c90e83c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dataContext.jsx
- dependencies
- react
- sheetsParser.js
- devDependencies
- package.json
- App.jsx
- authService.js
- .oxlintrc.json
- generate-hash.js

## God Nodes (most connected - your core abstractions)
1. `react` - 15 edges
2. `useData()` - 9 edges
3. `formatNumber()` - 8 edges
4. `fetchDashboardCsv()` - 6 edges
5. `scripts` - 5 edges
6. `formatCurrency()` - 5 edges
7. `parseDashboardSheet()` - 5 edges
8. `ErrorBoundary` - 5 edges
9. `RetentionView()` - 4 edges
10. `plugins` - 3 edges

## Surprising Connections (you probably didn't know these)
- `MatrixView()` --calls--> `useData()`  [EXTRACTED]
  src/views/MatrixView.jsx → src/services/dataContext.jsx
- `FunnelChart()` --calls--> `formatNumber()`  [EXTRACTED]
  src/components/FunnelChart.jsx → src/services/sheetsParser.js
- `DataProvider()` --calls--> `fetchDashboardCsv()`  [EXTRACTED]
  src/services/dataContext.jsx → src/services/sheetsClient.js
- `DataProvider()` --calls--> `parseDashboardSheet()`  [EXTRACTED]
  src/services/dataContext.jsx → src/services/sheetsParser.js
- `FunnelView()` --calls--> `useData()`  [EXTRACTED]
  src/views/FunnelView.jsx → src/services/dataContext.jsx

## Import Cycles
- None detected.

## Communities (11 total, 3 thin omitted)

### Community 0 - "dataContext.jsx"
Cohesion: 0.23
Nodes (11): DataContext, DataProvider(), fetchDashboardCsv(), fetchViaJsonp(), parseCsvText(), saveToCache(), cleanNumber(), cleanPercent() (+3 more)

### Community 1 - "dependencies"
Cohesion: 0.15
Nodes (13): chart.js, lucide-react, dependencies, chart.js, lucide-react, papaparse, react, react-chartjs-2 (+5 more)

### Community 3 - "sheetsParser.js"
Cohesion: 0.38
Nodes (8): FunnelChart(), useData(), formatCurrency(), formatNumber(), formatPercent(), FunnelView(), RetentionView(), RevenueView()

### Community 4 - "devDependencies"
Cohesion: 0.18
Nodes (11): oxlint, devDependencies, oxlint, @types/react, @types/react-dom, vite, @vitejs/plugin-react, @types/react (+3 more)

### Community 5 - "package.json"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

### Community 7 - "authService.js"
Cohesion: 0.28
Nodes (5): authenticateUser(), computeSHA256(), EXPECTED_HASH, EXPECTED_USER, fallbackHash()

### Community 8 - ".oxlintrc.json"
Cohesion: 0.25
Nodes (7): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema, oxc, warn

## Knowledge Gaps
- **27 isolated node(s):** `$schema`, `oxc`, `react/rules-of-hooks`, `warn`, `name` (+22 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `.oxlintrc.json`, `dataContext.jsx`, `sheetsParser.js`, `App.jsx`?**
  _High betweenness centrality (0.219) - this node is a cross-community bridge._
- **Why does `plugins` connect `.oxlintrc.json` to `react`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **What connects `$schema`, `oxc`, `react/rules-of-hooks` to the rest of the system?**
  _27 weakly-connected nodes found - possible documentation gaps or missing edges._