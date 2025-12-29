import React, { useEffect, useState, useMemo } from "react";
import {
  Grid,
  Button,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  TableBody,
  TablePagination,
  TextField,
} from "@material-ui/core";
import { Block, FormattedMessage } from "@openimis/fe-core";
import { useHistoryQuery } from "../hooks/useHistoryQuery";
import { recalculateIndicators } from "../actions";
import { useDispatch } from "react-redux";
import { MODULE_NAME } from "../constants";

export default function HistoryPage() {
  const dispatch = useDispatch();
  const { isLoading, error, data, refetch } = useHistoryQuery();

  const [running, setRunning] = useState(false);
  const [dryRun, setDryRun] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("startedAt");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRPP] = useState(10);

  const [search, setSearch] = useState("");

  const runs = data?.indicatorRuns || [];

  const hasRunningJob = runs.some((r) => r.status === "RUNNING");

  /** Auto-refresh intelligent */
  useEffect(() => {
    if (hasRunningJob || autoRefresh) {
      const interval = setInterval(() => {
        refetch();
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [hasRunningJob, autoRefresh, refetch]);

  /** Tri */
  const handleSort = (column) => {
    const isAsc = orderBy === column && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };

  const sortedRuns = useMemo(() => {
    return [...runs].sort((a, b) => {
      const A = a[orderBy] || "";
      const B = b[orderBy] || "";
      return order === "asc"
        ? A.toString().localeCompare(B.toString())
        : B.toString().localeCompare(A.toString());
    });
  }, [runs, order, orderBy]);

  /** Filtrage */
  const filteredRuns = useMemo(() => {
    if (!search) return sortedRuns;
    return sortedRuns.filter((r) =>
      JSON.stringify(r).toLowerCase().includes(search.toLowerCase())
    );
  }, [sortedRuns, search]);

  /** Pagination */
  const paginatedRuns = filteredRuns.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  /** Export CSV */
  const exportCSV = () => {
    const header = [
      "id",
      "startedAt",
      "finishedAt",
      "periodStart",
      "periodEnd",
      "modules",
      "status",
      "error",
    ];

    const csvRows = [
      header.join(","),
      ...runs.map((r) =>
        [
          r.id,
          r.startedAt,
          r.finishedAt || "",
          r.periodStart,
          r.periodEnd,
          (r.modules || []).join(" | "),
          r.status,
          r.error || "",
        ].join(","),
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `indicator_runs_${Date.now()}.csv`;
    link.click();
  };

  /** Lancer un recalcul */
  const handleRecalculate = async () => {
    setRunning(true);
    try {
      await dispatch(
        recalculateIndicators(
          {
            periodStart: "2025-01-01",
            periodEnd: "2025-12-31",
            modules: [],
            dryRun,
          },
          "Recalculate indicators",
        ),
      );
      setAutoRefresh(true);
      setTimeout(refetch, 1000);
    } finally {
      setRunning(false);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Block
          title={
            <FormattedMessage
              module={MODULE_NAME}
              id="monitoring.historyTitle"
              defaultMessage="Recalculation history"
            />
          }
          onLoading={isLoading}
          error={error}
        >
          {/* ===== Barre d’action ===== */}
          <div
            style={{
              marginBottom: "1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={dryRun}
                  onChange={(e) => setDryRun(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <FormattedMessage
                  module={MODULE_NAME}
                  id="monitoring.recalc.dryRun"
                  defaultMessage="Simulation only (no save)"
                />
              }
            />

            <div>
              <Button
                variant="outlined"
                color="primary"
                style={{ marginRight: 10 }}
                onClick={exportCSV}
              >
                Export CSV
              </Button>

              <Button
                color="primary"
                variant="contained"
                onClick={handleRecalculate}
                disabled={running}
                startIcon={
                  running ? <CircularProgress size={20} color="inherit" /> : null
                }
              >
                {running ? "Recalculating..." : "Recalculate"}
              </Button>
            </div>
          </div>

          {/* ===== Search ===== */}
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            size="small"
            style={{ marginBottom: "1rem" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* ===== Tableau ===== */}
          <TableContainer>
            <Table size="small">
              <TableHead style={{ background: "#f5f5f5" }}>
                <TableRow>
                  {[
                    { id: "id", label: "ID" },
                    { id: "startedAt", label: "Started" },
                    { id: "finishedAt", label: "Finished" },
                    { id: "periodStart", label: "Period" },
                    { id: "modules", label: "Modules" },
                    { id: "status", label: "Status" },
                    { id: "error", label: "Error" },
                  ].map((col) => (
                    <TableCell key={col.id}>
                      <TableSortLabel
                        active={orderBy === col.id}
                        direction={orderBy === col.id ? order : "asc"}
                        onClick={() => handleSort(col.id)}
                      >
                        {col.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedRuns.length ? (
                  paginatedRuns.map((r) => {
                    let color = "#444";
                    if (r.status === "RUNNING") color = "#f57c00";
                    else if (r.status === "SUCCESS") color = "#388e3c";
                    else if (r.status === "FAILED") color = "#d32f2f";

                    return (
                      <TableRow key={r.id}>
                        <TableCell>{r.id}</TableCell>
                        <TableCell>
                          {new Date(r.startedAt).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {r.finishedAt
                            ? new Date(r.finishedAt).toLocaleString()
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {r.periodStart} → {r.periodEnd}
                        </TableCell>
                        <TableCell>
                          {(r.modules || []).join(", ") || "-"}
                        </TableCell>
                        <TableCell style={{ fontWeight: "bold", color }}>
                          {r.status}
                        </TableCell>
                        <TableCell style={{ color: "red" }}>
                          {r.error || ""}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      style={{ textAlign: "center", padding: "1rem" }}
                    >
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* ===== Pagination ===== */}
          <TablePagination
            component="div"
            count={filteredRuns.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRPP(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[10, 20, 50, 100]}
          />
        </Block>
      </Grid>
    </Grid>
  );
}
