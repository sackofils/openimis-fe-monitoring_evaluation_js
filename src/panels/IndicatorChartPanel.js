import React, { Component } from "react";
import {
  Paper,
  Typography,
  Grid,
  MenuItem,
  Select,
  TextField,
  FormControl,
  InputLabel,
  Button,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Chart from "chart.js/dist/Chart.js";
import { FormattedMessage } from "react-intl";
import { MODULE_NAME } from "../constants";

const styles = (theme) => ({
  paper: { padding: theme.spacing(2), marginBottom: theme.spacing(3) },
  sectionTitle: {
    marginBottom: theme.spacing(2),
    fontWeight: 600,
    fontSize: "1.2rem",
  },
});

class IndicatorChartPanel extends Component {
  chartRef = React.createRef();
  chart = null;

  constructor(props) {
    super(props);
    this.state = {
      gender: "ALL",
      region: "ALL",
      periodStart: "",
      periodEnd: "",
    };
  }

  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.values !== this.props.values ||
      prevState !== this.state
    ) {
      this.renderChart();
    }
  }

  componentWillUnmount() {
    if (this.chart) this.chart.destroy();
  }

  /** ============ FILTER LOGIC ============ */
  applyFilters = () => {
    let rows = this.props.values || [];

    const { gender, region, periodStart, periodEnd } = this.state;

    // Filter by gender
    if (gender !== "ALL") {
      rows = rows.filter((v) => v.gender === gender);
    }

    // Filter by region
    if (region !== "ALL") {
      rows = rows.filter((v) => v.region_code === region);
    }

    // Filter by period
    if (periodStart) {
      rows = rows.filter((v) => v.period_start >= periodStart);
    }
    if (periodEnd) {
      rows = rows.filter((v) => v.period_end <= periodEnd);
    }

    return rows;
  };

  /** ============ RENDER CHART ============ */
  renderChart() {
  const values = this.applyFilters();
  if (!values || !values.length) return;
  if (!this.chartRef.current) return;

  // ordre chronologique
  const orderedValues = [...values].reverse();

  // labels sécurisés
  const labels = orderedValues.map(v =>
    v.period_start
      ? new Date(v.period_start).toLocaleDateString("fr-FR", {
          month: "short",
          year: "numeric",
        })
      : "—"
  );

  const dataValues = orderedValues.map(v => Number(v.value) || 0);

  // cible
  const target = this.props.indicator?.target;
  const targetLine =
    typeof target === "number"
      ? new Array(orderedValues.length).fill(target)
      : null;

  // styles validation
  const pointColors = orderedValues.map(v =>
    v.validated ? "#1976d2" : "#ed6c02"
  );

  const pointStyles = orderedValues.map(v =>
    v.validated ? "circle" : "rectRot"
  );

  const pointRadii = orderedValues.map(v =>
    v.validated ? 4 : 7
  );

  const hasUnvalidated = orderedValues.some(v => !v.validated);

  const ctx = this.chartRef.current.getContext("2d");
  if (this.chart) this.chart.destroy();

  this.chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Valeur de l’indicateur",
          data: dataValues,
          borderColor: "#1976d2",
          backgroundColor: "rgba(25,118,210,0.12)",
          borderWidth: 3,
          fill: false,
          pointBackgroundColor: pointColors,
          pointBorderColor: pointColors,
          pointRadius: pointRadii,
          pointStyle: pointStyles,
          borderDash: hasUnvalidated ? [6, 4] : [],
        },
        targetLine && {
          label: "Cible",
          data: targetLine,
          borderColor: "#d32f2f",
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
          pointRadius: 0,
        },
      ].filter(Boolean),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [
          {
              type: "category",
              display: true,
              ticks: {
                display: true,
                autoSkip: false,
                maxRotation: 45,
                minRotation: 45,
                padding: 10,
              },
              gridLines: {
                display: true,
              },
              scaleLabel: {
                display: true,
                labelString: "Période",
              },
            },
        ],
        yAxes: [
          {
            ticks: { beginAtZero: true },
            scaleLabel: {
              display: true,
              labelString: "Valeur",
            },
          },
        ],
      },
      tooltips: {
        callbacks: {
          label: tooltipItem => {
            const v = orderedValues[tooltipItem.index];
            return [
              `Valeur : ${v.value}`,
              `Source : ${v.source || "—"}`,
              `Statut : ${v.validated ? "Validée" : "Non validée"}`,
              v.validated_by ? `Validé par : ${v.validated_by}` : null,
              v.validated_at
                ? `Date validation : ${new Date(v.validated_at).toLocaleDateString()}`
                : null,
            ].filter(Boolean);
          },
        },
      },
    },
  });
}


  resetFilters = () => {
    this.setState({
      gender: "ALL",
      region: "ALL",
      periodStart: "",
      periodEnd: "",
    });
  };

  render() {
    const { classes, values } = this.props;
    if (!values || !values.length) return null;

    const allRegions = [
      ...new Set(values.map((v) => v.region_code).filter(Boolean)),
    ];

    return (
      <Paper className={classes.paper} style={{ height: 620 }}>
        <Typography className={classes.sectionTitle}>
          <FormattedMessage module={MODULE_NAME} id="indicator.chart" defaultMessage="Évolution" />
        </Typography>

        {/* === FILTERS ===
        <Grid container spacing={2} style={{ marginBottom: 10 }}>

          <Grid item xs={3}>
            <TextField
              label="Début période"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={this.state.periodStart}
              onChange={(e) => this.setState({ periodStart: e.target.value })}
            />
          </Grid>

          <Grid item xs={3}>
            <TextField
              label="Fin période"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={this.state.periodEnd}
              onChange={(e) => this.setState({ periodEnd: e.target.value })}
            />
          </Grid>

          <Grid item xs={2} style={{ display: "flex", alignItems: "center" }}>
            <Button onClick={this.resetFilters} variant="outlined">
              Réinitialiser
            </Button>
          </Grid>
        </Grid>
        */}

        {/* === CHART === */}
        <canvas ref={this.chartRef} style={{ width: "100%", height: "320px" }} />
      </Paper>
    );
  }
}

export default withStyles(styles)(IndicatorChartPanel);
