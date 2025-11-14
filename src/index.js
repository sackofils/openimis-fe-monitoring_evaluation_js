// Disable due to core architecture
/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import React from "react";
import { Assessment, AddCircleOutline } from "@material-ui/icons";
import { FormattedMessage } from "@openimis/fe-core";
import reducer from "./reducers/monitoringReducer";
import IndicatorSearcher from "./components/IndicatorSearcher";
import AddIndicatorPage from "./pages/AddIndicatorPage";
import EditIndicatorPage from "./pages/EditIndicatorPage";
import MonitoringMainMenu from "./menu/MonitoringMainMenu";
import messages_en from "./translations/en.json";
import messages_fr from "./translations/fr.json";
import {
  MODULE_NAME,
  RIGHT_MONITORING_ADD,
  RIGHT_MONITORING_VIEW,
  MONITORING_MAIN_MENU_CONTRIBUTION_KEY,
} from "./constants";

/** === ROUTES === */
const ROUTE_INDICATOR_LIST = "monitoring/indicators";
const ROUTE_ADD_INDICATOR = "monitoring/indicator/new";
const ROUTE_EDIT_INDICATOR = "monitoring/indicator";

/** === CONFIGURATION DE BASE === */
const DEFAULT_CONFIG = {
  translations: [
    { key: "en", messages: messages_en },
    { key: "fr", messages: messages_fr },
  ],
  reducers: [{ key: "monitoringEvaluation", reducer }],

  /** === Routes === */
  "core.Router": [
    { path: ROUTE_INDICATOR_LIST, component: IndicatorSearcher },
    { path: ROUTE_ADD_INDICATOR, component: AddIndicatorPage },
    { path: `${ROUTE_EDIT_INDICATOR}/:indicator_uuid`, component: EditIndicatorPage },
  ],

  /** === Menu principal === */
  "core.MainMenu": [{ name: "MonitoringMainMenu", component: MonitoringMainMenu }],

  /** === Entrées du menu Monitoring === */
  "monitoring.MainMenu": [
    {
      text: (
        <FormattedMessage
          module={MODULE_NAME}
          id="menu.monitoring.indicators"
          defaultMessage="Indicators"
        />
      ),
      icon: <Assessment />,
      route: `/${ROUTE_INDICATOR_LIST}`,
      filter: (rights) => rights.includes(RIGHT_MONITORING_VIEW),
      id: "monitoring.indicators",
    },
    {
      text: (
        <FormattedMessage
          module={MODULE_NAME}
          id="menu.monitoring.add"
          defaultMessage="Add indicator"
        />
      ),
      icon: <AddCircleOutline />,
      route: `/${ROUTE_ADD_INDICATOR}`,
      filter: (rights) => rights.includes(RIGHT_MONITORING_ADD),
      id: "monitoring.add",
    },
    {
      text: (
        <FormattedMessage
          module={MODULE_NAME}
          id="menu.monitoring.history"
          defaultMessage="Recalculation history"
        />
      ),
      icon: <History size={18} />,
      route: `/${ROUTE_HISTORY}`,
      filter: (rights) => rights.includes(RIGHT_MONITORING_VIEW),
      id: "menu.monitoring.history",
    },
  ],

  /** === Références disponibles pour d'autres modules === */
  refs: [
    { key: "monitoringEvaluation.route.indicators", ref: ROUTE_INDICATOR_LIST },
    { key: "monitoringEvaluation.route.addIndicator", ref: ROUTE_ADD_INDICATOR },
    { key: "monitoringEvaluation.route.editIndicator", ref: ROUTE_EDIT_INDICATOR },
  ],
};

/** === EXPORT PRINCIPAL === */
export const MonitoringEvaluationModule = (cfg) => ({
  ...DEFAULT_CONFIG,
  ...cfg,
});
