/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */

import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Fab, Tooltip } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import {
  withModulesManager,
  withHistory,
  decodeId,
  historyPush,
  formatMessage,
} from "@openimis/fe-core";

import IndicatorSearcher from "../components/IndicatorSearcher";
import { MODULE_NAME, RIGHT_MONITORING_ADD } from "../constants";

const styles = (theme) => ({
  page: {
    ...theme.page,
    padding: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(1),
    },
  },
  fab: {
    position: "fixed",
    bottom: theme.spacing(3),
    right: theme.spacing(10),
    [theme.breakpoints.down("sm")]: {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  },
});

class ResultFrameworkPage extends Component {
  onDoubleClick = (indicator, newTab = false) => {
    const routeParams = ["monitoringEvaluation.route.detailIndicator", [decodeId(indicator.id)]];
    historyPush(this.props.modulesManager, this.props.history, ...routeParams, newTab);
  };

  handleAddIndicator = () => {
    const routeParams = ["monitoringEvaluation.route.addIndicator", ["rf"]];
    historyPush(this.props.modulesManager, this.props.history, ...routeParams);
  };

  render() {
    const { classes, rights, intl } = this.props;

    return (
      <div className={classes.page}>
        <IndicatorSearcher
          cacheFiltersKey="indicatorPageFiltersCache"
          category="RESULT_FRAMEWORK"
          onDoubleClick={this.onDoubleClick}
        />

        {!rights.includes(RIGHT_MONITORING_ADD) && (
          <Tooltip title={formatMessage(intl, MODULE_NAME, "indicator.addTooltip")}>
            <Fab color="primary" className={classes.fab} onClick={this.handleAddIndicator}>
              <AddIcon />
            </Fab>
          </Tooltip>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  rights: state.core?.user?.i_user?.rights || [],
});

export default injectIntl(
  withModulesManager(
    withHistory(
      connect(mapStateToProps)(withTheme(withStyles(styles)(ResultFrameworkPage)))
    )
  )
);
