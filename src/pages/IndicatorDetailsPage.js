import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  Grid,
  Typography,
  Divider,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";

import { ArrowBack, Edit } from "@material-ui/icons";
import { withTheme, withStyles } from "@material-ui/core/styles";
import {
  withHistory,
  historyPush,
  withModulesManager,
  decodeId,
  useHistory,
  journalize
} from "@openimis/fe-core";
import { injectIntl } from "react-intl";

import Skeleton from "@material-ui/lab/Skeleton";
import PrintIcon from "@material-ui/icons/Print";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import ManualValueModal from "../components/ManualValueModal";

import {
    fetchIndicator,
    createManualIndicatorValue,
    updateManualIndicatorValue,
    deleteManualIndicatorValue,
    validateManualIndicatorValue,
} from "../actions";
import IndicatorChartPanel from "../panels/IndicatorChartPanel";
import IndicatorHistoryPanel from "../panels/IndicatorHistoryPanel";

const styles = (theme) => ({
  page: { padding: theme.spacing(2) },
  card: {
    borderRadius: 0,
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
    marginBottom: theme.spacing(3),
  },
  chip: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  infoItem: {
    marginBottom: theme.spacing(1.2),
    fontSize: "0.95rem",
  },
  band: {
    padding: theme.spacing(2),
    background: theme.palette.primary.light,
    color: "white",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    fontWeight: 600,
    letterSpacing: 0.5,
  },
  progressBox: {
      textAlign: "center",
      marginTop: 20,
      marginBottom: 10,
    },

    progressValue: {
      fontSize: "4rem",
      fontWeight: 700,
      lineHeight: "4rem",
      color: "#1976d2",
    },

    progressLabel: {
      marginTop: 5,
      fontSize: "1rem",
      color: "#555",
    },
    donutContainer: {
      height: 180,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },

    donutCanvas: {
      width: "140px",
      height: "140px",
    },

});
const history = useHistory();
class IndicatorDetailsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      manualModalOpen: false,
      editingValue: null,

      confirmOpen: false,
      confirmAction: null,
      confirmPayload: null,
      confirmMessage: "",
    };
  }
  printRef = React.createRef();
  donutRef = React.createRef();
  donutChart = null;

  componentDidMount() {
    const indicatorId = this.props.match.params.indicator_uuid;
    this.props.fetchIndicator(indicatorId);
  }

  componentDidUpdate(prevProps) {
    const { submittingMutation, mutation, journalize } = this.props;
    if (prevProps.submittingMutation && !submittingMutation) {
      journalize(mutation);
    }
    if (prevProps.indicator !== this.props.indicator) {
        this.renderDonut(this.props.indicator);
    }
 }

  goBack = () => {
    const { history } = this.props;
    history.goBack();
  };

  goToEdit = () => {
    const id = this.props.indicator?.id;
    if (id) {
      historyPush(
        this.props.modulesManager,
        this.props.history,
        "monitoringEvaluation.route.editIndicator",
        [decodeId(id)],
        false
      );
    }
  };

  handlePrint = () => {
    window.print();
  };

  handleExportPdf = async () => {
    // À implémenter si besoin
  };

  openConfirm = (msg, action, payload) => {
      this.setState({
        confirmOpen: true,
        confirmMessage: msg,
        confirmAction: action,
        confirmPayload: payload,
      });
    };

    handleEditValue = (value) => {
      this.setState({
        manualModalOpen: true,
        editingValue: value,
      });
    };

    handleDeleteValue = (id) => {
      this.openConfirm(
        "Voulez-vous vraiment supprimer cette valeur ?",
        (payload) => {
          const { deleteManualIndicatorValue, fetchIndicator } = this.props;

          deleteManualIndicatorValue({ id: payload })
            .then(() => {
              const indicatorId = this.props.match.params.indicator_uuid;
              fetchIndicator(indicatorId);
            })
            .catch((err) => console.error("Delete error:", err));
        },
        id
      );
    };

    handleValidateValue = (id) => {
      this.openConfirm(
        "Confirmez-vous la validation de cette valeur ?",
        (payload) => {
          const { validateManualIndicatorValue, fetchIndicator } = this.props;

          validateManualIndicatorValue({ id: payload })
            .then(() => {
              const indicatorId = this.props.match.params.indicator_uuid;
              fetchIndicator(indicatorId);
            })
            .catch((err) => console.error("Validate error:", err));
        },
        id
      );
    };

    handleSaveValue = (payload) => {
      const { createManualIndicatorValue, updateManualIndicatorValue, indicator, fetchIndicator } =
        this.props;

      if (payload.id) {
        // Mise à jour
        updateManualIndicatorValue &&
          updateManualIndicatorValue({
            id: payload.id,
            value: payload.value,
            periodStart: payload.periodStart,
            periodEnd: payload.periodEnd,
            source: payload.source,
          })
          .then(() => {
            const indicatorId = this.props.match.params.indicator_uuid;
            fetchIndicator(indicatorId);
          })
          .catch((err) => console.error("Error:", err));
      } else {
        // Création
        createManualIndicatorValue &&
          createManualIndicatorValue({
            indicatorId: indicator.id,
            value: payload.value,
            periodStart: payload.periodStart,
            periodEnd: payload.periodEnd,
            source: payload.source,
          })
          .then(() => {
            const indicatorId = this.props.match.params.indicator_uuid;
            fetchIndicator(indicatorId);
          })
          .catch((err) => console.error("Error:", err));;
      }

      this.setState({ manualModalOpen: false, editingValue: null });
    };

  renderDonut(indicator) {
      if (!indicator || !indicator.target) return;
      if (!this.donutRef.current) return;

      const value = indicator.lastValue ?? 0;
      const target = indicator.target ?? 0;
      const remaining = Math.max(target - value, 0);

      const ctx = this.donutRef.current.getContext("2d");

      if (this.donutChart) this.donutChart.destroy();

      this.donutChart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Atteint", "Restant"],
          datasets: [
            {
              data: [value, remaining],
              backgroundColor: ["#1976d2", "#e0e0e0"],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "70%",
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.label;
                  const val = context.raw;
                  return `${label} : ${val}`;
                },
              },
            },
          },
        },
      });
    }

  renderStatusChip(status) {
    const colors = {
      ACTIVE: "#2e7d32",
      INACTIVE: "#616161",
      ERROR: "#d32f2f",
    };
    return (
      <Chip
        label={status}
        style={{ background: colors[status] ?? "#ddd", color: "#fff" }}
        className={this.props.classes.chip}
      />
    );
  }

  renderMethodChip(method) {
    const label = method === "MANUEL" ? "Manuelle" : "Automatique";
    const colors = {
      MANUEL: "#1565c0",
      AUTOMATIQUE: "#00838f",
    };
    return (
      <Chip
        label={label}
        style={{ background: colors[method] ?? "#777", color: "#fff" }}
        className={this.props.classes.chip}
      />
    );
  }

  render() {
    const { classes, indicator } = this.props;

    // Skeleton pendant le chargement
    if (!indicator || !indicator.id) {
      return (
        <div className={classes.page}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Skeleton variant="rect" height={220} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Skeleton variant="rect" height={220} />
            </Grid>
            <Grid item xs={12}>
              <Skeleton variant="rect" height={350} />
            </Grid>
          </Grid>
        </div>
      );
    }

    const values = indicator.values || [];
    const hasUnvalidated = values.some(v => !v.validated);

    return (
      <div className={classes.page}>
        {/* HEADER */}
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <IconButton onClick={this.goBack}>
              <ArrowBack />
            </IconButton>
          </Grid>

          <Grid item xs>
            <Typography variant="h5" style={{ fontWeight: 600 }}>
              {indicator.label} ({indicator.code})
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Indicateur du cadre de résultats
            </Typography>
          </Grid>

          <Grid item>
            <Tooltip title="Modifier">
              <IconButton color="primary" onClick={this.goToEdit}>
                <Edit />
              </IconButton>
            </Tooltip>
          </Grid>

          <Grid item>
            <Tooltip title="Imprimer">
              <IconButton onClick={this.handlePrint}>
                <PrintIcon />
              </IconButton>
            </Tooltip>
          </Grid>

          <Grid item>
            <Tooltip title="Exporter en PDF">
              <IconButton onClick={this.handleExportPdf}>
                <PictureAsPdfIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>

        <Divider style={{ margin: "1rem 0" }} />

        {/* CONTENU IMPRIMABLE */}
        <div ref={this.printRef}>
          <Grid container spacing={3}>
            {/* CARD 1 : Informations générales */}
            <Grid item xs={12} md={6}>
              <Card className={classes.card}>
                <div className={classes.band}>Informations générales</div>
                <CardContent>
                  <Grid container spacing={1}>
                    <Grid item>{this.renderStatusChip(indicator.status)}</Grid>
                    <Grid item>{this.renderMethodChip(indicator.method)}</Grid>
                  </Grid>

                  <Typography className={classes.infoItem}>
                    <b>Module :</b> {indicator.module ?? "-"}
                  </Typography>

                  <Typography className={classes.infoItem}>
                    <b>Description :</b> {indicator.description || "-"}
                  </Typography>

                  <Typography className={classes.infoItem}>
                    <b>Méthode de calcul :</b> {indicator.calculationMethod || "-"}
                  </Typography>

                  <Typography className={classes.infoItem}>
                    <b>Fréquence :</b> {indicator.frequency || "-"}
                  </Typography>

                  <Typography className={classes.infoItem}>
                    <b>Formule :</b> {indicator.formula || "-"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* CARD 2 : Valeurs & Statut */}
            <Grid item xs={12} md={6}>
              <Card className={classes.card}>
                <div className={classes.band}>
                  Valeurs & Statut
                  {indicator.method === "MANUEL" && (
                    <Tooltip title={hasUnvalidated ? "Veuillez valider la valeur en attente avant d’ajouter une nouvelle valeur" : "Ajouter une valeur manuelle"}>
                      <span style={{ float: "right" }}>
                        <IconButton
                          color="inherit"
                          disabled={hasUnvalidated}
                          onClick={() => this.setState({ manualModalOpen: true })}
                        >
                          <AddCircleIcon style={{ color: hasUnvalidated ? "#ccc" : "white" }} />
                        </IconButton>
                      </span>
                    </Tooltip>
                  )}
                </div>
                <CardContent>
                  <Typography className={classes.infoItem}>
                    <b>Cible :</b> {indicator.target ?? "-"}
                  </Typography>

                  <Typography className={classes.infoItem}>
                    <b>Valeur actuelle :</b> {indicator.lastValue ?? "-"}
                  </Typography>

                  <Typography className={classes.infoItem}>
                    <b>Dernière mise à jour :</b>{" "}
                    {indicator.lastUpdatedDate
                      ? new Date(indicator.lastUpdatedDate).toLocaleString()
                      : (indicator.dateUpdated ? new Date(indicator.dateUpdated).toLocaleString() : "-")}
                  </Typography>

                  {/* ============================
                       PROGRESSION EN GROS
                     ============================ */}
                  <div className={classes.progressBox}>
                    {indicator.target > 0 && indicator.lastValue >= 0 ? (
                      <React.Fragment>
                        <div className={classes.progressValue}>
                          {Math.round((indicator.lastValue / indicator.target) * 100)}%
                        </div>
                        <div className={classes.progressLabel}>Progression</div>
                      </React.Fragment>
                    ) : (
                      <Typography color="textSecondary" style={{ marginTop: 10 }}>
                        Progression non disponible
                      </Typography>
                    )}
                  </div>
                  {/**
                  <div className={classes.donutContainer}>
                      <canvas ref={this.donutRef} className={classes.donutCanvas}></canvas>
                    </div>
                    **/}
                </CardContent>

              </Card>
            </Grid>
          </Grid>

          {/* CARD 3 : Historique */}
          <Card className={classes.card}>
            <div className={classes.band}>Historique des valeurs</div>
            <CardContent>
              <IndicatorHistoryPanel
                  values={values}
                  onEdit={this.handleEditValue}
                  onDelete={this.handleDeleteValue}
                  onValidate={this.handleValidateValue}
                />
            </CardContent>
          </Card>

          {/* CARD 4 : Graphique */}
          <Card className={classes.card}>
            <div className={classes.band}>Évolution graphique</div>
            <CardContent style={{ paddingBottom: 90 }}>
              <IndicatorChartPanel values={values} indicator={indicator} />
            </CardContent>
          </Card>
        </div>
        <ManualValueModal
          open={this.state.manualModalOpen}
          onClose={() =>
            this.setState({ manualModalOpen: false, editingValue: null })
          }
          indicator={indicator}
          editingValue={this.state.editingValue}
          onSave={this.handleSaveValue}
        />
        <Dialog
          open={this.state.confirmOpen}
          onClose={() => this.setState({ confirmOpen: false })}
        >
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>
            <Typography>{this.state.confirmMessage}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({ confirmOpen: false })}>
              Annuler
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                const action = this.state.confirmAction;
                const payload = this.state.confirmPayload;
                this.setState({ confirmOpen: false }, () => action(payload));
              }}
            >
              Confirmer
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  indicator: state.monitoringEvaluation.indicator || {},
  mutation: state.monitoringEvaluation.mutation,
  submittingMutation: state.monitoringEvaluation.submittingMutation,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
  {
    fetchIndicator,
    createManualIndicatorValue,
    updateManualIndicatorValue,
    deleteManualIndicatorValue,
    validateManualIndicatorValue,
    journalize
  },
  dispatch
);

export default withModulesManager(
  withHistory(
    connect(mapStateToProps, mapDispatchToProps)(
      injectIntl(withTheme(withStyles(styles)(IndicatorDetailsPage)))
    )
  )
);
