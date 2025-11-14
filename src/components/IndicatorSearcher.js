/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-nested-ternary */
import React, { Component, Fragment } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  withTheme,
  withStyles,
  Grid,
  Checkbox,
  IconButton,
  Tooltip,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { Add, GetApp, Autorenew, Edit } from "@material-ui/icons";
import {
  Searcher,
  historyPush,
  withModulesManager,
  journalize,
  formatMessage,
  baseApiUrl,
} from "@openimis/fe-core";
import {
  fetchIndicators,
  exportIndicators,
  recalculateIndicators,
} from "../actions";
import {
  MODULE_NAME,
  RIGHT_MONITORING_ADD,
  RIGHT_MONITORING_EDIT,
  RIGHT_MONITORING_RECALCULATE,
} from "../constants";

const styles = (theme) => ({
  groupButtons: {
    marginBottom: theme.spacing(1),
    "& > *": { marginRight: theme.spacing(1) },
  },
});

class IndicatorSearcher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIds: [],
      exporting: false,
      recalculating: false,
    };
    this.rowsPerPageOptions = props.modulesManager.getConf(
      MODULE_NAME,
      "indicator.rowsPerPageOptions",
      [10, 20, 50],
    );
    this.defaultPageSize = props.modulesManager.getConf(
      MODULE_NAME,
      "indicator.defaultPageSize",
      10,
    );
  }

  fetch = (params) => {
    this.props.fetchIndicators();
  };

  rowIdentifier = (r) => r.id;

  toggleSelectOne = (id) => {
    this.setState((prev) => ({
      selectedIds: prev.selectedIds.includes(id)
        ? prev.selectedIds.filter((x) => x !== id)
        : [...prev.selectedIds, id],
    }));
  };

  toggleSelectAll = () => {
    const { indicators = [] } = this.props;
    const { selectedIds } = this.state;
    if (selectedIds.length < indicators.length) {
      this.setState({ selectedIds: indicators.map((i) => i.id) });
    } else {
      this.setState({ selectedIds: [] });
    }
  };

  handleExport = async () => {
    const { intl } = this.props;
    this.setState({ exporting: true });
    try {
      const data = await exportIndicators();
      if (data?.file_url) {
        const url = `${window.location.origin}${baseApiUrl}${data.file_url}`;
        window.open(url, "_blank");
      } else {
        alert(formatMessage(intl, MODULE_NAME, "export.noFile", "No file generated"));
      }
    } catch (err) {
      alert(formatMessage(intl, MODULE_NAME, "export.error", "Export failed"));
    } finally {
      this.setState({ exporting: false });
    }
  };

  handleRecalculate = async () => {
    const { intl } = this.props;
    this.setState({ recalculating: true });
    try {
      await this.props.recalculateIndicators(
        { dryRun: false },
        formatMessage(intl, MODULE_NAME, "recalculateIndicators.mutation.label"),
      );
      alert(formatMessage(intl, MODULE_NAME, "recalculate.success", "Indicators recalculated successfully"));
    } catch (err) {
      alert(formatMessage(intl, MODULE_NAME, "recalculate.error", "Recalculation failed"));
    } finally {
      this.setState({ recalculating: false });
    }
  };

  headers = () => [
    "",
    "indicator.code",
    "indicator.label",
    "indicator.module",
    "indicator.method",
    "indicator.unit",
    "indicator.value",
    "indicator.target",
    "indicator.status",
    this.props.rights.includes(RIGHT_MONITORING_EDIT) ? "" : null,
  ];

  sorts = () => [
    ["code", true],
    ["label", true],
    ["module", true],
    ["method", true],
    ["status", true],
    ["target", true],
  ];

  itemFormatters = () => {
    const { selectedIds } = this.state;
    const { intl } = this.props;

    return [
      (i) => (
        <Checkbox
          checked={selectedIds.includes(i.id)}
          onChange={() => this.toggleSelectOne(i.id)}
          color="primary"
        />
      ),
      (i) => i.code,
      (i) => i.label,
      (i) => i.module,
      (i) => (
        <FormattedMessage
          module={MODULE_NAME}
          id={`indicator.${i.method === "MANUAL" ? "manual" : "automatic"}`}
        />
      ),
      (i) => i.unit,
      (i) => i.value ?? "-",
      (i) => i.target ?? "-",
      (i) => (
        <FormattedMessage
          module={MODULE_NAME}
          id={`indicator.${i.status.toLowerCase()}`}
        />
      ),
      (i) => (
        <Tooltip title={formatMessage(intl, MODULE_NAME, "indicator.editTooltip", "Edit indicator")}>
          <IconButton
            onClick={() =>
              historyPush(
                this.props.modulesManager,
                this.props.history,
                "monitoringEvaluation.route.editIndicator",
                [i.id],
              )
            }
          >
            <Edit />
          </IconButton>
        </Tooltip>
      ),
    ];
  };

  render() {
    const {
      intl,
      indicators,
      indicatorsPageInfo,
      fetchingIndicators,
      fetchedIndicators,
      errorIndicators,
      rights,
    } = this.props;
    const count = indicatorsPageInfo?.totalCount || indicators.length || 0;

    return (
      <Fragment>
        {(this.state.exporting || this.state.recalculating) && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(255,255,255,0.8)",
              zIndex: 2000,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
              color: "#1976d2",
            }}
          >
            <CircularProgress color="primary" />
            <div style={{ marginTop: "1rem" }}>
              {this.state.exporting ? (
                <FormattedMessage module={MODULE_NAME} id="indicator.exporting" defaultMessage="Exporting..." />
              ) : (
                <FormattedMessage module={MODULE_NAME} id="indicator.recalculating" defaultMessage="Recalculating..." />
              )}
            </div>
          </div>
        )}

        <Searcher
          module={MODULE_NAME}
          cacheFiltersKey="indicator.searcher"
          items={indicators || []}
          itemsPageInfo={indicatorsPageInfo}
          fetchingItems={fetchingIndicators}
          fetchedItems={fetchedIndicators}
          errorItems={errorIndicators}
          tableTitle={formatMessage(intl, MODULE_NAME, "indicator.listTitle", "Indicators list")}
          fetch={this.fetch}
          rowIdentifier={this.rowIdentifier}
          headers={this.headers}
          itemFormatters={this.itemFormatters}
          sorts={this.sorts}
          defaultOrderBy="code"
          rowsPerPageOptions={this.rowsPerPageOptions}
          defaultPageSize={this.defaultPageSize}
          searcherActions={[
            {
              label: <FormattedMessage module={MODULE_NAME} id="indicator.add" defaultMessage="Add indicator" />,
              icon: <Add />,
              authorized: rights.includes(RIGHT_MONITORING_ADD),
              onClick: () =>
                historyPush(
                  this.props.modulesManager,
                  this.props.history,
                  "monitoringEvaluation.route.addIndicator",
                ),
              color: "primary",
              variant: "contained",
            },
            {
              label: <FormattedMessage module={MODULE_NAME} id="indicator.recalculate" defaultMessage="Recalculate" />,
              icon: <Autorenew />,
              authorized: rights.includes(RIGHT_MONITORING_RECALCULATE),
              onClick: this.handleRecalculate,
              color: "secondary",
              variant: "outlined",
            },
            {
              label: <FormattedMessage module={MODULE_NAME} id="indicator.export" defaultMessage="Export (.xlsx)" />,
              icon: <GetApp />,
              authorized: rights.includes(RIGHT_MONITORING_RECALCULATE),
              onClick: this.handleExport,
              color: "default",
              variant: "outlined",
            },
          ]}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  rights: state.core?.user?.i_user?.rights || [],
  indicators: state.monitoringEvaluation.indicators || [],
  indicatorsPageInfo: state.monitoringEvaluation.indicatorsPageInfo || { totalCount: 0 },
  fetchingIndicators: state.monitoringEvaluation.fetchingIndicators,
  fetchedIndicators: state.monitoringEvaluation.fetchedIndicators,
  errorIndicators: state.monitoringEvaluation.errorIndicators,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    { fetchIndicators, exportIndicators, recalculateIndicators, journalize },
    dispatch,
  );

export default withModulesManager(
  connect(mapStateToProps, mapDispatchToProps)(injectIntl(withTheme(withStyles(styles)(IndicatorSearcher)))),
);
