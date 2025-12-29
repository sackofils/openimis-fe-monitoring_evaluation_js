// Disable due to core architecture
/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import React from "react";
import { Assessment, AddCircleOutline } from "@material-ui/icons";
import HistoryIcon from "@material-ui/icons/History";
import { FormattedMessage } from "@openimis/fe-core";
import reducer from "./reducer";
import IndicatorsPage from "./pages/IndicatorsPage";
import ResultFrameworkPage from "./pages/ResultFrameworkPage";
import AddIndicatorPage from "./pages/AddIndicatorPage";
import EditIndicatorPage from "./pages/EditIndicatorPage";
import IndicatorDetailsPage from "./pages/IndicatorDetailsPage";
import HistoryPage from "./pages/HistoryPage";
import ModulePicker from "./pickers/ModulePicker";
import UnitPicker from "./pickers/UnitPicker";
import FrequencyPicker from "./pickers/FrequencyPicker";
import IndicatorTypePicker from "./pickers/IndicatorTypePicker";
import IndicatorStatusPicker from "./pickers/IndicatorStatusPicker";
import CalculationMethodPicker from "./pickers/CalculationMethodPicker";
import Dashboard from "./pages/Dashboard";
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
const ROUTE_RESULTS_FRAMEWORK = "monitoring/result-framework";
const ROUTE_ADD_INDICATOR = "monitoring/indicator/new";
const ROUTE_EDIT_INDICATOR = "monitoring/indicator";
const ROUTE_HISTORY = "monitoring/history";
const ROUTE_DASHBOARD = "monitoring/dashboard";
const ROUTE_DETAILS = "monitoring/detail";

/** === CONFIGURATION DE BASE === */
const DEFAULT_CONFIG = {
  translations: [
    { key: "en", messages: messages_en },
    { key: "fr", messages: messages_fr },
  ],
  reducers: [{ key: "monitoringEvaluation", reducer }],

  /** === Routes === */
  "core.Router": [
    { path: ROUTE_INDICATOR_LIST, component: IndicatorsPage },
    { path: ROUTE_RESULTS_FRAMEWORK, component: ResultFrameworkPage },
    { path: `${ROUTE_ADD_INDICATOR}/:category_code`, component: AddIndicatorPage },
    { path: ROUTE_HISTORY, component: HistoryPage },
    { path: ROUTE_DASHBOARD, component: HistoryPage },
    { path: `${ROUTE_EDIT_INDICATOR}/:indicator_uuid`, component: EditIndicatorPage },
    { path: `${ROUTE_DETAILS}/:indicator_uuid`, component: IndicatorDetailsPage },
  ],

  /** === Menu principal === */
  "core.MainMenu": [{ name: "MonitoringMainMenu", component: MonitoringMainMenu }],

  /** === Entrées du menu Monitoring === */
  "monitoring.MainMenu": [
    {
      text: (
        <FormattedMessage
          module={MODULE_NAME}
          id="menu.monitoring.dashboard"
          defaultMessage="Dashboard"
        />
      ),
      icon: <Assessment />,
      route: `/${ROUTE_DASHBOARD}`,
      //filter: (rights) => rights.includes(RIGHT_MONITORING_VIEW),
      id: "monitoring.dashboard",
    },
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
      //filter: (rights) => rights.includes(RIGHT_MONITORING_VIEW),
      id: "monitoring.indicators",
    },
    {
      text: (
        <FormattedMessage
          module={MODULE_NAME}
          id="menu.monitoring.resultFramework"
          defaultMessage="Results framework"
        />
      ),
      icon: <Assessment />,
      route: `/${ROUTE_RESULTS_FRAMEWORK}`,
      //filter: (rights) => rights.includes(RIGHT_MONITORING_VIEW),
      id: "monitoring.resultFramework",
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
      //filter: (rights) => rights.includes(RIGHT_MONITORING_ADD),
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
      icon: <HistoryIcon />,
      route: `/${ROUTE_HISTORY}`,
      //filter: (rights) => rights.includes(RIGHT_MONITORING_VIEW),
      id: "menu.monitoring.history",
    },
  ],

  /** === Références disponibles pour d'autres modules === */
  refs: [
    { key: "monitoringEvaluation.route.indicators", ref: ROUTE_INDICATOR_LIST },
    { key: "monitoringEvaluation.route.resultFramework", ref: ROUTE_RESULTS_FRAMEWORK },
    { key: "monitoringEvaluation.route.addIndicator", ref: ROUTE_ADD_INDICATOR },
    { key: "monitoringEvaluation.route.editIndicator", ref: ROUTE_EDIT_INDICATOR },
    { key: "monitoringEvaluation.route.history", ref: ROUTE_HISTORY },
    { key: "monitoringEvaluation.route.dashboard", ref: ROUTE_DASHBOARD },
    { key: "monitoringEvaluation.route.detailIndicator", ref: ROUTE_DETAILS },

    { key: "monitoringEvaluation.FrequencyPicker", ref: FrequencyPicker },
    { key: "monitoringEvaluation.ModulePicker", ref: ModulePicker },
    { key: "monitoringEvaluation.UnitPicker", ref: UnitPicker },
    { key: "monitoringEvaluation.CalculationMethodPicker", ref: CalculationMethodPicker },
    { key: "monitoringEvaluation.IndicatorTypePicker", ref: IndicatorTypePicker },
    { key: "monitoringEvaluation.IndicatorStatusPicker", ref: IndicatorStatusPicker },
  ],
};

/** === EXPORT PRINCIPAL === */
export const MonitoringEvaluationModule = (cfg) => ({
  ...DEFAULT_CONFIG,
  ...cfg,
});
