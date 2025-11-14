# openimis-fe-monitoring_evaluation_js

Frontend module **Monitoring & Evaluation** pour openIMIS/CoreMIS.

## Fonctionnalités
- Tableau de bord des indicateurs avec graphiques (Recharts)
- Lancement manuel du recalcul d'indicateurs (mutation GraphQL)
- Historique des recalculs

## Installation
1. Ajouter le module dans votre monorepo OpenIMIS FE (ou installer depuis une source git) :
   ```bash
   yarn add file:./openimis-fe-monitoring_evaluation_js
   # ou
   npm i file:./openimis-fe-monitoring_evaluation_js
   ```

2. Assurez-vous d'avoir `@openimis/fe-core` disponible (peerDependency).

3. Dans votre configuration de build, ce module sera détecté automatiquement si vous suivez l'architecture openIMIS FE.

## Backend GraphQL attendu
- `query indicators(periodStart: Date!, periodEnd: Date!, modules: [String!])`
- `query indicatorRuns`
- `mutation recalculateIndicators(input: RecalculateIndicatorsInput!)`

Adaptez les noms si votre backend diffère.

## Droit d'accès (à aligner côté backend)
- RIGHT_MONITORING_DASHBOARD
- RIGHT_MONITORING_RECALCULATE
- RIGHT_MONITORING_HISTORY
