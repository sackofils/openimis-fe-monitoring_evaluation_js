/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useState } from "react";
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
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
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
  chartContainer: {
    height: 300,
  },
  summaryCard: {
    textAlign: "center",
    padding: theme.spacing(2),
    backgroundColor: "#f9fafb",
    borderRadius: 12,
  },
});

const COLORS = ["#1976d2", "#0288d1", "#26a69a", "#7cb342", "#f9a825", "#ef5350"];

const DashboardPage = ({ intl, classes, fetchIndicators, indicators, fetchingIndicators }) => {
  const [dataByModule, setDataByModule] = useState([]);
  const [dataByMethod, setDataByMethod] = useState([]);
  const [summary, setSummary] = useState({ total: 0, auto: 0, manual: 0 });

  useEffect(() => {
    fetchIndicators();
  }, [fetchIndicators]);

  useEffect(() => {
    if (!indicators) return;

    // Regroupement par module
    const moduleCounts = {};
    indicators.forEach((ind) => {
      const mod = ind.module || "Autre";
      moduleCounts[mod] = (moduleCounts[mod] || 0) + 1;
    });

    // Regroupement par méthode
    const methodCounts = { AUTOMATIC: 0, MANUAL: 0 };
    indicators.forEach((ind) => {
      const method = ind.method?.toUpperCase() || "AUTOMATIC";
      if (methodCounts[method] !== undefined) {
        methodCounts[method] += 1;
      }
    });

    setDataByModule(
      Object.entries(moduleCounts).map(([module, count]) => ({ module, count })),
    );

    setDataByMethod(
      Object.entries(methodCounts).map(([method, count]) => ({
        name: method === "AUTOMATIC" ? "Automatique" : "Manuel",
        value: count,
      })),
    );

    setSummary({
      total: indicators.length,
      auto: methodCounts.AUTOMATIC,
      manual: methodCounts.MANUAL,
    });
  }, [indicators]);

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
          {/* Résumé global */}
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
                <FormattedMessage id="dashboard.autoIndicators" defaultMessage="Automatiques" />
              </Typography>
              <Typography variant="h3" style={{ color: "#0288d1" }}>
                {summary.auto}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card className={classes.summaryCard}>
              <Typography variant="h6">
                <FormattedMessage id="dashboard.manualIndicators" defaultMessage="Manuels" />
              </Typography>
              <Typography variant="h3" style={{ color: "#7cb342" }}>
                {summary.manual}
              </Typography>
            </Card>
          </Grid>

          {/* Graphique par module */}
          <Grid item xs={12} md={8}>
            <Card className={classes.card}>
              <CardHeader
                title={
                  <FormattedMessage
                    id="dashboard.indicatorsByModule"
                    defaultMessage="Indicateurs par module"
                  />
                }
              />
              <Divider />
              <CardContent>
                <div className={classes.chartContainer}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dataByModule}>
                      <XAxis dataKey="module" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#1976d2" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </Grid>

          {/* Graphique par méthode */}
          <Grid item xs={12} md={4}>
            <Card className={classes.card}>
              <CardHeader
                title={
                  <FormattedMessage
                    id="dashboard.indicatorsByMethod"
                    defaultMessage="Répartition par méthode de calcul"
                  />
                }
              />
              <Divider />
              <CardContent>
                <div className={classes.chartContainer}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dataByMethod}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {dataByMethod.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  fetchingIndicators: state.monitoringEvaluation.fetchingIndicators,
  indicators: state.monitoringEvaluation.indicators || [],
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      fetchIndicators,
    },
    dispatch,
  );

export default injectIntl(
  withTheme(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(DashboardPage))),
);
