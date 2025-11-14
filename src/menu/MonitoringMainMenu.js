/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { Assessment, AddCircleOutline } from "@material-ui/icons";
import {
  formatMessage,
  MainMenuContribution,
  withModulesManager,
} from "@openimis/fe-core";
import {
  MODULE_NAME,
  MONITORING_MAIN_MENU_CONTRIBUTION_KEY,
  RIGHT_MONITORING_ADD,
  RIGHT_MONITORING_VIEW,
} from "../constants";

function MonitoringMainMenu(props) {
  const ROUTE_INDICATOR_LIST = "monitoring/indicators";
  const ROUTE_ADD_INDICATOR = "monitoring/indicator/new";

  const entries = [
    {
      text: formatMessage(props.intl, MODULE_NAME, "menu.monitoring.indicators"),
      icon: <Assessment />,
      route: `/${ROUTE_INDICATOR_LIST}`,
      filter: (rights) => rights.includes(RIGHT_MONITORING_VIEW),
      id: "monitoring.indicators",
    },
    {
      text: formatMessage(props.intl, MODULE_NAME, "menu.monitoring.add"),
      icon: <AddCircleOutline />,
      route: `/${ROUTE_ADD_INDICATOR}`,
      filter: (rights) => rights.includes(RIGHT_MONITORING_ADD),
      id: "monitoring.add",
    },
  ];

  entries.push(
    ...props.modulesManager
      .getContribs(MONITORING_MAIN_MENU_CONTRIBUTION_KEY)
      .filter((c) => !c.filter || c.filter(props.rights)),
  );

  return (
    <MainMenuContribution
      {...props}
      header={formatMessage(props.intl, MODULE_NAME, "mainMenuMonitoring")}
      entries={entries}
      menuId="MonitoringMainMenu"
    />
  );
}

const mapStateToProps = (state) => ({
  rights:
    !!state.core && !!state.core.user && !!state.core.user.i_user
      ? state.core.user.i_user.rights
      : [],
});

export default injectIntl(withModulesManager(connect(mapStateToProps)(MonitoringMainMenu)));
