/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import {
  Grid,
  Paper,
  Typography,
  Divider,
  IconButton,
  Tooltip,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Button,
} from "@material-ui/core";
import { AddCircleOutline, Edit, Delete } from "@material-ui/icons";
import { FormattedMessage, withHistory } from "@openimis/fe-core";
import { fetchIndicators, deleteIndicator } from "../actions";
import { MODULE_NAME, RIGHT_MONITORING_ADD } from "../constants";

const styles = (theme) => ({
  paper: theme.paper.paper,
  tableTitle: theme.table.title,
  item: theme.paper.item,
  table: {
    minWidth: 650,
  },
  headerAction: {
    textAlign: "right",
  },
});

class IndicatorsPage extends Component {
  state = {
    page: 0,
    rowsPerPage: 10,
  };

  componentDidMount() {
    this.props.fetchIndicators();
  }

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10), page: 0 });
  };

  goToAddIndicator = () => {
    this.props.history.push("/monitoring/newIndicator");
  };

  goToEditIndicator = (indicator) => {
    this.props.history.push(`/monitoring/newIndicator/${indicator.uuid}`);
  };

  handleDelete = (indicator) => {
    if (
      window.confirm(
        `Voulez-vous vraiment supprimer l'indicateur « ${indicator.label} » ?`,
      )
    ) {
      this.props.deleteIndicator(
        indicator.id,
        `Deleted indicator ${indicator.label}`,
      );
    }
  };

  render() {
    const { classes, rights, indicators, indicatorsPageInfo, fetchingIndicators } =
      this.props;
    const { page, rowsPerPage } = this.state;

    const canAdd = rights.includes(RIGHT_MONITORING_ADD);
    const data = indicators || [];

    return (
      <div className={classes.page}>
        <Grid container>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Grid container alignItems="center" className={classes.tableTitle}>
                <Grid item xs={8}>
                  <Typography variant="h6">
                    <FormattedMessage
                      module={MODULE_NAME}
                      id="indicator.listTitle"
                    />
                  </Typography>
                </Grid>
                <Grid item xs={4} className={classes.headerAction}>
                  {canAdd && (
                    <Tooltip title="Ajouter un indicateur">
                      <IconButton
                        color="primary"
                        onClick={this.goToAddIndicator}
                      >
                        <AddCircleOutline />
                      </IconButton>
                    </Tooltip>
                  )}
                </Grid>
              </Grid>
              <Divider />

              {fetchingIndicators ? (
                <Typography style={{ padding: 16 }}>
                  <FormattedMessage
                    module={MODULE_NAME}
                    id="indicator.loading"
                  />
                </Typography>
              ) : !data.length ? (
                <Typography style={{ padding: 16 }}>
                  <FormattedMessage
                    module={MODULE_NAME}
                    id="indicator.noData"
                  />
                </Typography>
              ) : (
                <>
                  <Table
                    size="small"
                    className={classes.table}
                    aria-label="indicators table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <FormattedMessage
                            module={MODULE_NAME}
                            id="indicator.code"
                          />
                        </TableCell>
                        <TableCell>
                          <FormattedMessage
                            module={MODULE_NAME}
                            id="indicator.label"
                          />
                        </TableCell>
                        <TableCell>
                          <FormattedMessage
                            module={MODULE_NAME}
                            id="indicator.module"
                          />
                        </TableCell>
                        <TableCell>
                          <FormattedMessage
                            module={MODULE_NAME}
                            id="indicator.method"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <FormattedMessage
                            module={MODULE_NAME}
                            id="indicator.value"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <FormattedMessage
                            module={MODULE_NAME}
                            id="indicator.target"
                          />
                        </TableCell>
                        <TableCell>
                          <FormattedMessage
                            module={MODULE_NAME}
                            id="indicator.status"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <FormattedMessage
                            module={MODULE_NAME}
                            id="indicator.actions"
                          />
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {data
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage,
                        )
                        .map((ind) => (
                          <TableRow key={ind.uuid}>
                            <TableCell>{ind.code}</TableCell>
                            <TableCell>{ind.label}</TableCell>
                            <TableCell>{ind.module}</TableCell>
                            <TableCell>{ind.method}</TableCell>
                            <TableCell align="right">{ind.value}</TableCell>
                            <TableCell align="right">{ind.target}</TableCell>
                            <TableCell>{ind.status}</TableCell>
                            <TableCell align="center">
                              <Tooltip title="Modifier">
                                <IconButton
                                  color="primary"
                                  onClick={() => this.goToEditIndicator(ind)}
                                >
                                  <Edit />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Supprimer">
                                <IconButton
                                  color="secondary"
                                  onClick={() => this.handleDelete(ind)}
                                >
                                  <Delete />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>

                  <TablePagination
                    component="div"
                    count={indicatorsPageInfo.totalCount || data.length}
                    page={page}
                    onPageChange={this.handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={this.handleChangeRowsPerPage}
                    labelRowsPerPage="Lignes par page"
                  />
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  rights:
    state.core?.user?.i_user?.rights || [],
  fetchingIndicators: state.monitoringEvaluation.fetchingIndicators,
  indicators: state.monitoringEvaluation.indicators,
  indicatorsPageInfo: state.monitoringEvaluation.indicatorsPageInfo,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ fetchIndicators, deleteIndicator }, dispatch);

export default withHistory(
  withTheme(
    withStyles(styles)(
      connect(mapStateToProps, mapDispatchToProps)(IndicatorsPage),
    ),
  ),
);
