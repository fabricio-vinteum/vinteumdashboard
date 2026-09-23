# Graph Report - .  (2026-09-23)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 102 nodes · 151 edges · 15 communities (13 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- dataContext.jsx
- App.jsx
- dependencies
- devDependencies
- package.json
- react
- .oxlintrc.json
- generate-hash.js

## God Nodes (most connected - your core abstractions)
1. `react` - 15 edges
2. `useData()` - 9 edges
3. `formatNumber()` - 8 edges
4. `scripts` - 5 edges
5. `formatCurrency()` - 5 edges
6. `parseDashboardSheet()` - 5 edges
7. `fetchDashboardCsv()` - 4 edges
8. `RetentionView()` - 4 edges
9. `App()` - 4 edges
10. `authenticateUser()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `FunnelChart()` --calls--> `formatNumber()`  [EXTRACTED]
  src/components/FunnelChart.jsx → src/services/sheetsParser.js
- `MatrixView()` --calls--> `useData()`  [EXTRACTED]
  src/views/MatrixView.jsx → src/services/dataContext.jsx
- `DataProvider()` --calls--> `fetchDashboardCsv()`  [EXTRACTED]
  src/services/dataContext.jsx → src/services/sheetsClient.js
- `DataProvider()` --calls--> `parseDashboardSheet()`  [EXTRACTED]
  src/services/dataContext.jsx → src/services/sheetsParser.js
- `FunnelView()` --calls--> `useData()`  [EXTRACTED]
  src/views/FunnelView.jsx → src/services/dataContext.jsx

## Import Cycles
- None detected.

## Communities (15 total, 2 thin omitted)

### Community 0 - "dataContext.jsx"
Cohesion: 0.19
Nodes (17): FunnelChart(), DataContext, DataProvider(), useData(), fetchDashboardCsv(), parseCsvText(), cleanNumber(), cleanPercent() (+9 more)

### Community 1 - "App.jsx"
Cohesion: 0.23
Nodes (11): App(), Header(), LoginModal(), authenticateUser(), computeSHA256(), EXPECTED_HASH, EXPECTED_USER, fallbackHash() (+3 more)

### Community 2 - "dependencies"
Cohesion: 0.15
Nodes (13): chart.js, lucide-react, dependencies, chart.js, lucide-react, papaparse, react, react-chartjs-2 (+5 more)

### Community 3 - "devDependencies"
Cohesion: 0.18
Nodes (11): oxlint, devDependencies, oxlint, @types/react, @types/react-dom, vite, @vitejs/plugin-react, @types/react (+3 more)

### Community 4 - "package.json"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

### Community 6 - ".oxlintrc.json"
Cohesion: 0.25
Nodes (7): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema, oxc, warn

## Knowledge Gaps
- **27 isolated node(s):** `$schema`, `oxc`, `react/rules-of-hooks`, `warn`, `name` (+22 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `dataContext.jsx`, `App.jsx`, `.oxlintrc.json`?**
  _High betweenness centrality (0.236) - this node is a cross-community bridge._
- **Why does `plugins` connect `.oxlintrc.json` to `react`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **What connects `$schema`, `oxc`, `react/rules-of-hooks` to the rest of the system?**
  _27 weakly-connected nodes found - possible documentation gaps or missing edges._