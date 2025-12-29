import React, { Component } from "react";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Button,
} from "@material-ui/core";

import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

import { withStyles } from "@material-ui/core/styles";
import { FormattedMessage } from "react-intl";
import { MODULE_NAME } from "../constants";

const styles = (theme) => ({
  paper: { padding: theme.spacing(2), marginBottom: theme.spacing(3) },
  sectionTitle: {
    marginBottom: theme.spacing(2),
    fontWeight: 600,
    fontSize: "1.2rem",
  },
  exportBtn: {
    marginBottom: theme.spacing(2),
  },
});

class IndicatorHistoryPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      order: "asc",
      orderBy: "period_start",
      page: 0,
      rowsPerPage: 10,
    };
  }

  /** ===================== TRI ===================== **/
  handleSort = (column) => {
    const { order, orderBy } = this.state;
    this.setState({
      order: orderBy === column && order === "asc" ? "desc" : "asc",
      orderBy: column,
    });
  };

  sortValues(values) {
    const { order, orderBy } = this.state;
    return [...values].sort((a, b) => {
      const A = a[orderBy] ?? "";
      const B = b[orderBy] ?? "";
      return order === "asc"
        ? A.toString().localeCompare(B.toString())
        : B.toString().localeCompare(A.toString());
    });
  }

  /** ===================== PAGINATION ===================== **/
  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0,
    });
  };

  /** ===================== EXPORT CSV ===================== **/
  exportCSV = () => {
    const { values } = this.props;
    if (!values?.length) return;

    const header = [
      "period_start",
      "period_end",
      "value",
      "source",
      "validated",
    ];

    const csvRows = [
      header.join(","),
      ...values.map((v) =>
        [
          v.periodStart ?? "",
          v.periodEnd ?? "",
          v.value ?? v.qualitativeValue ?? "",
          v.source ?? "",
          v.validated ? "Oui" : "Non",
        ].join(",")
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "indicator_values.csv";
    link.click();
  };

  render() {
    const { classes, values = [], onEdit, onDelete, onValidate } = this.props;
    const { order, orderBy, rowsPerPage, page } = this.state;

    if (!values.length) {
      return (
        <Paper className={classes.paper}>
          <Typography className={classes.sectionTitle}>
            <FormattedMessage module={MODULE_NAME} id="indicator.history" />
          </Typography>
          <Typography>Aucune donnée disponible</Typography>
        </Paper>
      );
    }

    // Tri
    const sortedValues = this.sortValues(values);

    // Pagination slice
    const paginated = sortedValues.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );

    return (
      <Paper className={classes.paper}>
        <Typography className={classes.sectionTitle}>
          <FormattedMessage module={MODULE_NAME} id="indicator.history" />
        </Typography>

        {/* EXPORT CSV
        <Button
          variant="outlined"
          color="primary"
          onClick={this.exportCSV}
          className={classes.exportBtn}
        >
          Export CSV
        </Button>
        */}

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {[
                  { id: "period_start", label: "Début période" },
                  { id: "period_end", label: "Fin période" },
                  { id: "value", label: "Valeur" },
                  { id: "source", label: "Source" },
                  { id: "validated", label: "Validé" },
                  { id: "actions", label: "Actions" },
                ].map((col) => (
                  <TableCell key={col.id} align={col.id === "actions" ? "right" : ""}>
                    {col.id !== "actions" ? (
                      <TableSortLabel
                        active={orderBy === col.id}
                        direction={orderBy === col.id ? order : "asc"}
                        onClick={() => this.handleSort(col.id)}
                      >
                        {col.label}
                      </TableSortLabel>
                    ) : (
                      col.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {paginated.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>{v.periodStart}</TableCell>
                  <TableCell>{v.periodEnd}</TableCell>
                  <TableCell>
                    <b>{v.value ?? v.qualitativeValue ?? "-"}</b>
                  </TableCell>
                  <TableCell>{v.source || "-"}</TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      color: v.validated ? "green" : "red",
                    }}
                  >
                    {v.validated ? "Oui" : "Non"}
                  </TableCell>
                  <TableCell align="right">
                    {!v.validated ? (
                      <>
                        {/* Modifier */}
                        <Button
                          size="small"
                          onClick={() => onEdit && onEdit(v)}
                        >
                          <EditIcon fontSize="small" />
                        </Button>

                        {/* Supprimer */}
                        <Button
                          size="small"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Voulez-vous vraiment supprimer cette valeur ?"
                              )
                            ) {
                              onDelete && onDelete(v.id);
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </Button>

                        {/* Valider */}
                        <Button
                          size="small"
                          style={{ color: "green" }}
                          onClick={() => onValidate && onValidate(v.id)}
                        >
                          <CheckCircleIcon fontSize="small" />
                        </Button>
                      </>
                    ) : (
                      <Typography style={{ color: "green", fontWeight: 600 }}>
                        ✔
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* PAGINATION */}
        <TablePagination
          component="div"
          rowsPerPageOptions={[10, 20, 50, 100]}
          count={sortedValues.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={this.handleChangePage}
          onRowsPerPageChange={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

export default withStyles(styles)(IndicatorHistoryPanel);
