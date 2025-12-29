/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-nested-ternary */

import React, { Component, Fragment } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  withTheme,
  withStyles,
  Checkbox,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@material-ui/core";
import ConfirmDialog from "./ConfirmDialog";
import NotificationSnackbar from "./NotificationSnackbar";
import DuplicateDialog from "./DuplicateDialog";

import { Add, GetApp, Autorenew, Edit } from "@material-ui/icons";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import MiniDonut from "../components/MiniDonut";


import {
  Searcher,
  historyPush,
  withModulesManager,
  withHistory,
  journalize,
  formatMessage,
  baseApiUrl,
  decodeId
} from "@openimis/fe-core";

import {
  fetchIndicators,
  exportIndicators,
  recalculateIndicators,
  deleteIndicator,
  duplicateIndicator
} from "../actions";

import {
  MODULE_NAME,
  RIGHT_MONITORING_ADD,
  RIGHT_MONITORING_EDIT,
  RIGHT_MONITORING_RECALCULATE,
} from "../constants";

import IndicatorFilter from "./IndicatorFilter";

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
      confirmDelete: null,
      confirmDuplicate: null,
      snackbar: { open: false, message: "", severity: "success" },
    };

    this.rowsPerPageOptions = props.modulesManager.getConf(
      MODULE_NAME,
      "indicator.rowsPerPageOptions",
      [10, 20, 50]
    );

    this.defaultPageSize = props.modulesManager.getConf(
      MODULE_NAME,
      "indicator.defaultPageSize",
      10
    );
  }

  componentDidUpdate(prevProps) {
    const { submittingMutation, mutation, journalize } = this.props;
    if (prevProps.submittingMutation && !submittingMutation) {
      journalize(mutation);
    }
 }

  showSnackbar = (message, severity = "success") => {
    this.setState({ snackbar: { open: true, message, severity } });
  };

  /** CORRECTION : fetch prend les paramètres GraphQL corrects */
  fetch = (params) => {
      const { category } = this.props;

      const finalParams = [...params];

      if (category) {
        finalParams.push(`category: "${category}"`);
      }

      this.props.fetchIndicators(this.props.modulesManager, finalParams);
    };

  refetch = () => {
    this.fetch();
  };

  /** EXACTEMENT comme TicketSearcher */
  filtersToQueryParams = (state) => {
    const prms = Object.keys(state.filters)
      .filter((f) => !!state.filters[f].filter)
      .map((f) => state.filters[f].filter);

    prms.push(`first: ${state.pageSize}`);

    if (state.afterCursor) prms.push(`after: "${state.afterCursor}"`);
    if (state.beforeCursor) prms.push(`before: "${state.beforeCursor}"`);
    if (state.orderBy) prms.push(`orderBy: ["${state.orderBy}"]`);

    return prms;
  };

  rowIdentifier = (i) => i.id;

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
    this.setState({ exporting: true });
    try {
      const data = await exportIndicators();
      if (data?.file_url) {
        window.open(`${window.location.origin}${baseApiUrl}${data.file_url}`, "_blank");
      } else {
        alert("No file generated");
      }
    } catch {
      alert("Export failed");
    } finally {
      this.setState({ exporting: false });
    }
  };

  handleDelete = (item) => {
    this.setState({ confirmDelete: item });
  };

  handleDuplicate = (item) => {
    this.setState({ confirmDuplicate: item });
  };

  confirmDelete = () => {
      const item = this.state.confirmDelete;
      const id = decodeId(item.id);

      // IMPORTANT : return la Promise
      return this.props
        .deleteIndicator(id, `Deleted indicator ${item.code}`)
        .then(() => {
          // this.showSnackbar("Indicateur supprimé avec succès");
          this.setState({ confirmDelete: null });
          // Ici, on rafraîchit la liste des indicateurs
          this.props.fetchIndicators(this.props.modulesManager, {});
        })
        .catch(() => {
          this.showSnackbar("Erreur lors de la suppression", "error");
        });
    };


  confirmDuplicate = (newCode) => {
      const item = this.state.confirmDuplicate;
      const id = decodeId(item.id);

      // Le RETURN ici est ESSENTIEL pour que le Dialog sache que c'est async.
      return this.props
        .duplicateIndicator(id, `Duplicated indicator as ${newCode}`)
        .then(() => {
          // this.showSnackbar(`Indicateur dupliqué sous le code ${newCode}`);
          this.setState({ confirmDuplicate: null });
          this.props.fetchIndicators(this.props.modulesManager, {});
        })
        .catch((e) => {
          console.error("Duplication error", e);
          this.showSnackbar("Erreur lors de la duplication", "error");
        });
    };


  handleRecalculate = async () => {
    this.setState({ recalculating: true });
    try {
      await this.props.recalculateIndicators({ dryRun: false }, "Recalculate indicators");
      alert("Indicators recalculated");
    } catch {
      alert("Recalculation failed");
    } finally {
      this.setState({ recalculating: false });
    }
  };

  headers = () => [
    // "",
    "indicator.code",
    "indicator.label",
    "indicator.tools",
    "indicator.method",
    // "indicator.unit",
    "indicator.target",
    "indicator.value",
    "indicator.progression",
    "indicator.status",
    !this.props.rights.includes(RIGHT_MONITORING_EDIT) ? "" : null,
  ];

  sorts = () => [
    ["code", true],
    ["label", true],
    ["tools", true],
    ["method", true],
    ["status", true],
    ["progression", true],
  ];

  itemFormatters = () => {
    const { selectedIds } = this.state;
    const { intl } = this.props;

    const formatters = [
    /*
      (i) => (
        <Checkbox
          checked={selectedIds.includes(i.id)}
          color="primary"
          onChange={() => this.toggleSelectOne(i.id)}
        />
      ),*/
      (i) => i.code,
      (i) => i.name,
      (i) => i.calculationMethod,
      (i) => (
        <FormattedMessage
          module={MODULE_NAME}
          id={`indicator.${i.method === "MANUEL" ? "manual" : "automatic"}`}
        />
      ),
      // (i) => i.unit,
      (i) => i.target,
      (i) => i.lastValue ?? '-',
      (i) => {
          if (!i.target || !i.lastValue) return "-";
          const progression = Math.round((i.lastValue / i.target) * 100);
          return <MiniDonut value={progression} size={42} stroke={6} />;
      },
      (i) => (
        <FormattedMessage module={MODULE_NAME} id={`indicator.${i.status.toLowerCase()}`} />
      ),

    // === ACTIONS : EDIT + DUPLICATE + DELETE ===
    (i) =>
      // this.props.rights.includes(RIGHT_MONITORING_EDIT) ?
      (
        <div style={{ display: "flex", gap: 8 }}>
          {/* Éditer */}
          <Tooltip title={formatMessage(intl, MODULE_NAME, "indicator.editTooltip")}>
            <IconButton
              onClick={() =>
                historyPush(
                  this.props.modulesManager,
                  this.props.history,
                  "monitoringEvaluation.route.editIndicator",
                  [decodeId(i.id)],
                  false
                )
              }
            >
              <EditIcon />
            </IconButton>
          </Tooltip>

          {/* Dupliquer */}
          <Tooltip title={formatMessage(intl, MODULE_NAME, "indicator.duplicateTooltip")}>
            <IconButton onClick={() => this.handleDuplicate(i)}>
              <FileCopyIcon />
            </IconButton>
          </Tooltip>

          {/* Supprimer */}
          <Tooltip title={formatMessage(intl, MODULE_NAME, "indicator.deleteTooltip")}>
            <IconButton
              onClick={() => this.handleDelete(i)}
              style={{ color: "red" }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </div>
      ),
    ];

    return formatters
  };

  render() {
    const {
      intl,
      indicators,
      indicatorsPageInfo,
      fetchingIndicators,
      fetchedIndicators,
      errorIndicators,
      onDoubleClick,
      rights,
    } = this.props;

    const count = indicatorsPageInfo?.totalCount || 0;

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
              background: "rgba(255,255,255,0.8)",
              zIndex: 2000,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
            <div style={{ marginTop: "1rem" }}>
              {this.state.exporting ? "Exporting..." : "Recalculating..."}
            </div>
          </div>
        )}

        <Searcher
          ref={(ref) => (this.searcher = ref)}
          module={MODULE_NAME}
          cacheFiltersKey="indicator.searcher"
          items={indicators}
          itemsPageInfo={indicatorsPageInfo}
          fetchingItems={fetchingIndicators}
          fetchedItems={fetchedIndicators}
          errorItems={errorIndicators}
          tableTitle={formatMessage(intl, MODULE_NAME, "indicator.listTitle", { count })}
          fetch={this.fetch}
          filtersToQueryParams={this.filtersToQueryParams}
          rowIdentifier={this.rowIdentifier}
          headers={this.headers}
          itemFormatters={this.itemFormatters}
          sorts={this.sorts}
          defaultOrderBy="code"
          FilterPane={({ filters, onChangeFilters }) => (
            <IndicatorFilter filters={filters} onChangeFilters={onChangeFilters} />
          )}
          exportable={true}
          onDoubleClick={(i) => onDoubleClick(i)}
          enableActionButtons={true}
          searcherActions={[
            {
              label: <FormattedMessage module={MODULE_NAME} id="indicator.recalculate" />,
              icon: <Autorenew />,
              authorized: !!this.state.selectedIds.length,
              onClick: this.handleRecalculate,
              variant: "outlined",
            }
          ]}
        />
        {/* Snackbar */}
        <NotificationSnackbar
          open={this.state.snackbar.open}
          severity={this.state.snackbar.severity}
          message={this.state.snackbar.message}
          onClose={() => this.setState({ snackbar: { open: false, message: "" } })}
        />

        {/* Dialog confirmation suppression */}
        <ConfirmDialog
          open={!!this.state.confirmDelete}
          title="Supprimer l’indicateur"
          message={
            this.state.confirmDelete
              ? `Voulez-vous supprimer l’indicateur "${this.state.confirmDelete.code}" ?`
              : ""
          }
          danger
          confirmLabel="Supprimer"
          onClose={() => this.setState({ confirmDelete: null })}
          onConfirm={this.confirmDelete}
        />

        {/* Dialog duplication avec renommage */}
        <DuplicateDialog
          open={!!this.state.confirmDuplicate}
          item={this.state.confirmDuplicate}
          onClose={() => this.setState({ confirmDuplicate: null })}
          onConfirm={this.confirmDuplicate}
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
  mutation: state.monitoringEvaluation.mutation,
  submittingMutation: state.monitoringEvaluation.submittingMutation,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
        fetchIndicators,
        exportIndicators,
        recalculateIndicators,
        deleteIndicator,
        duplicateIndicator,
        journalize
    },
    dispatch
  );

export default withModulesManager(
  withHistory(
    connect(
      mapStateToProps,
      mapDispatchToProps,
    )(injectIntl(withTheme(withStyles(styles)(IndicatorSearcher)))),
  ),
);
