/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  CircularProgress,
  Divider,
} from "@material-ui/core";
import { injectIntl, FormattedMessage } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";

import Chart from "chart.js/dist/Chart.js";

import { fetchIndicators } from "../actions";
import { MODULE_NAME } from "../constants";

const styles = (theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  card: {
    borderRadius: 16,
    boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
  },
  chartBox: {
    height: 300,
    position: "relative",
  },
  summaryCard: {
    textAlign: "center",
    padding: theme.spacing(2),
    backgroundColor: "#f9fafb",
    borderRadius: 12,
  },
});

const COLORS = ["#1976d2", "#0288d1", "#26a69a", "#7cb342", "#f9a825", "#ef5350"];

function DashboardPage({
  intl,
  classes,
  fetchIndicators,
  indicators,
  fetchingIndicators,
}) {
  const [dataByModule, setDataByModule] = useState([]);
  const [dataByMethod, setDataByMethod] = useState([]);
  const [summary, setSummary] = useState({ total: 0, auto: 0, manual: 0 });

  // Refs Chart.js (important !)
  const barChartRef = useRef();
  const pieChartRef = useRef();
  let barChart = useRef(null);
  let pieChart = useRef(null);

  /** === Fetch initial === */
  useEffect(() => {
    fetchIndicators();
  }, [fetchIndicators]);

  /** === Préparation des données === */
  useEffect(() => {
    if (!indicators) return;

    // Par module
    const moduleCounts = {};
    indicators.forEach((ind) => {
      const mod = ind.module || "Autre";
      moduleCounts[mod] = (moduleCounts[mod] || 0) + 1;
    });

    setDataByModule(
      Object.entries(moduleCounts).map(([module, count]) => ({
        module,
        count,
      }))
    );

    // Par méthode
    const methodCounts = { AUTOMATIC: 0, MANUAL: 0 };
    indicators.forEach((ind) => {
      const method = ind.method?.toUpperCase() || "AUTOMATIC";
      if (methodCounts[method] !== undefined) methodCounts[method] += 1;
    });

    setDataByMethod([
      { name: "Automatique", value: methodCounts.AUTOMATIC },
      { name: "Manuel", value: methodCounts.MANUAL },
    ]);

    setSummary({
      total: indicators.length,
      auto: methodCounts.AUTOMATIC,
      manual: methodCounts.MANUAL,
    });
  }, [indicators]);

  /** === Render Chart.js === */
  useEffect(() => {
    if (!barChartRef.current || !pieChartRef.current) return;

    /** 🔹 BAR CHART : Indicateurs par module */
    if (barChart.current) barChart.current.destroy();
    barChart.current = new Chart(barChartRef.current, {
      type: "bar",
      data: {
        labels: dataByModule.map((d) => d.module),
        datasets: [
          {
            label: "Nombre d'indicateurs",
            data: dataByModule.map((d) => d.count),
            backgroundColor: "#1976d2",
            borderColor: "#0d47a1",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    /** 🔹 PIE CHART : Répartition par méthode */
    if (pieChart.current) pieChart.current.destroy();
    pieChart.current = new Chart(pieChartRef.current, {
      type: "pie",
      data: {
        labels: dataByMethod.map((d) => d.name),
        datasets: [
          {
            data: dataByMethod.map((d) => d.value),
            backgroundColor: COLORS.slice(0, dataByMethod.length),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }, [dataByModule, dataByMethod]);

  return (
    <div className={classes.root}>
      <Typography variant="h5" gutterBottom>
        <FormattedMessage
          module={MODULE_NAME}
          id="dashboard.title"
          defaultMessage="Tableau de bord - Indicateurs"
        />
      </Typography>

      {fetchingIndicators ? (
        <Grid container justifyContent="center" alignItems="center" style={{ height: "50vh" }}>
          <CircularProgress color="primary" />
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {/* === Résumé global === */}
          <Grid item xs={12} md={4}>
            <Card className={classes.summaryCard}>
              <Typography variant="h6">
                <FormattedMessage id="dashboard.totalIndicators" defaultMessage="Total indicateurs" />
              </Typography>
              <Typography variant="h3" color="primary">
                {summary.total}
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card className={classes.summaryCard}>
              <Typography variant="h6">
                Automatiques
              </Typography>
              <Typography variant="h3" style={{ color: "#0288d1" }}>
                {summary.auto}
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card className={classes.summaryCard}>
              <Typography variant="h6">Manuels</Typography>
              <Typography variant="h3" style={{ color: "#7cb342" }}>
                {summary.manual}
              </Typography>
            </Card>
          </Grid>

          {/* === Graphique Bar : Modules === */}
          <Grid item xs={12} md={8}>
            <Card className={classes.card}>
              <CardHeader title="Indicateurs par module" />
              <Divider />
              <CardContent>
                <div className={classes.chartBox}>
                  <canvas ref={barChartRef} />
                </div>
              </CardContent>
            </Card>
          </Grid>

          {/* === Graphique Pie : Méthodes === */}
          <Grid item xs={12} md={4}>
            <Card className={classes.card}>
              <CardHeader title="Répartition par méthode" />
              <Divider />
              <CardContent>
                <div className={classes.chartBox}>
                  <canvas ref={pieChartRef} />
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  fetchingIndicators: state.monitoringEvaluation.fetchingIndicators,
  indicators: state.monitoringEvaluation.indicators || [],
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      fetchIndicators,
    },
    dispatch
  );

export default injectIntl(
  withTheme(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(DashboardPage)))
);
