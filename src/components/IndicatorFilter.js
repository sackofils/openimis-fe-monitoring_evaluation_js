/* eslint-disable react/destructuring-assignment */
import React, { Component } from "react";
import _debounce from "lodash/debounce";
import { Grid, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import {
  withModulesManager,
  TextInput,
  PublishedComponent,
  ControlledField,
  formatMessage,
} from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import {
  MODULE_NAME,
  CALCULATION_METHOD,
  INDICATOR_STATUS,
} from "../constants";

const styles = (theme) => ({
  form: {
    padding: 0,
  },
  item: {
    padding: theme.spacing(1),
  },
});

class IndicatorFilter extends Component {
  debouncedOnChangeFilter = _debounce(
    this.props.onChangeFilters,
    this.props.modulesManager.getConf(MODULE_NAME, "debounceTime", 800),
  );

  _filterValue = (k) => {
    const { filters } = this.props;
    return filters && filters[k] ? filters[k].value : null;
  };

  render() {
    const { classes, filters, onChangeFilters, intl } = this.props;

    return (
      <Grid container className={classes.form}>
        {/* --- Code --- */}
        <ControlledField
          module={MODULE_NAME}
          id="indicatorFilter.code"
          field={
            <Grid item xs={3} className={classes.item}>
              <TextInput
                module={MODULE_NAME}
                label={formatMessage(intl, MODULE_NAME, "indicator.code")}
                value={this._filterValue("code")}
                onChange={(v) =>
                  this.debouncedOnChangeFilter([
                    { id: "code", value: v, filter: `code_Icontains: "${v}"` },
                  ])
                }
              />
            </Grid>
          }
        />

        {/* --- Label --- */}
        <ControlledField
          module={MODULE_NAME}
          id="indicatorFilter.label"
          field={
            <Grid item xs={3} className={classes.item}>
              <TextInput
                module={MODULE_NAME}
                label={formatMessage(intl, MODULE_NAME, "indicator.label")}
                value={this._filterValue("label")}
                onChange={(v) =>
                  this.debouncedOnChangeFilter([
                    { id: "label", value: v, filter: `label_Icontains: "${v}"` },
                  ])
                }
              />
            </Grid>
          }
        />

        {/* --- Module --- */}
        <ControlledField
          module={MODULE_NAME}
          id="indicatorFilter.module"
          field={
            <Grid item xs={3} className={classes.item}>
              <TextInput
                module={MODULE_NAME}
                label={formatMessage(intl, MODULE_NAME, "indicator.module")}
                value={this._filterValue("module")}
                onChange={(v) =>
                  this.debouncedOnChangeFilter([
                    { id: "module", value: v, filter: `module_Icontains: "${v}"` },
                  ])
                }
              />
            </Grid>
          }
        />

        {/* --- Méthode (Automatique / Manuelle) --- */}
        <ControlledField
          module={MODULE_NAME}
          id="indicatorFilter.method"
          field={
            <Grid item xs={3} className={classes.item}>
              <FormControl fullWidth>
                <InputLabel>
                  {formatMessage(intl, MODULE_NAME, "indicator.method")}
                </InputLabel>
                <Select
                  value={this._filterValue("method") || ""}
                  onChange={(e) =>
                    this.debouncedOnChangeFilter([
                      { id: "method", value: e.target.value, filter: `method: "${e.target.value}"` },
                    ])
                  }
                >
                  <MenuItem value="">
                    <em>
                      {formatMessage(intl, MODULE_NAME, "filter.all", "All")}
                    </em>
                  </MenuItem>
                  {CALCULATION_METHOD.map((m) => (
                    <MenuItem key={m} value={m}>
                      <FormattedMessage module={MODULE_NAME} id={`indicator.${m.toLowerCase()}`} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          }
        />

        {/* --- Statut --- */}
        <ControlledField
          module={MODULE_NAME}
          id="indicatorFilter.status"
          field={
            <Grid item xs={3} className={classes.item}>
              <FormControl fullWidth>
                <InputLabel>
                  {formatMessage(intl, MODULE_NAME, "indicator.status")}
                </InputLabel>
                <Select
                  value={this._filterValue("status") || ""}
                  onChange={(e) =>
                    this.debouncedOnChangeFilter([
                      { id: "status", value: e.target.value, filter: `status: "${e.target.value}"` },
                    ])
                  }
                >
                  <MenuItem value="">
                    <em>
                      {formatMessage(intl, MODULE_NAME, "filter.all", "All")}
                    </em>
                  </MenuItem>
                  {INDICATOR_STATUS.map((s) => (
                    <MenuItem key={s} value={s}>
                      <FormattedMessage module={MODULE_NAME} id={`indicator.${s.toLowerCase()}`} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          }
        />

        {/* --- Période (Date début) --- */}
        <ControlledField
          module={MODULE_NAME}
          id="indicatorFilter.periodStart"
          field={
            <Grid item xs={3} className={classes.item}>
              <PublishedComponent
                pubRef="core.DatePicker"
                module={MODULE_NAME}
                label={formatMessage(intl, MODULE_NAME, "indicator.periodStart", "Period start")}
                value={this._filterValue("periodStart")}
                onChange={(v) =>
                  this.debouncedOnChangeFilter([
                    { id: "periodStart", value: v, filter: `periodStart_Gte: "${v}"` },
                  ])
                }
              />
            </Grid>
          }
        />

        {/* --- Période (Date fin) --- */}
        <ControlledField
          module={MODULE_NAME}
          id="indicatorFilter.periodEnd"
          field={
            <Grid item xs={3} className={classes.item}>
              <PublishedComponent
                pubRef="core.DatePicker"
                module={MODULE_NAME}
                label={formatMessage(intl, MODULE_NAME, "indicator.periodEnd", "Period end")}
                value={this._filterValue("periodEnd")}
                onChange={(v) =>
                  this.debouncedOnChangeFilter([
                    { id: "periodEnd", value: v, filter: `periodEnd_Lte: "${v}"` },
                  ])
                }
              />
            </Grid>
          }
        />
      </Grid>
    );
  }
}

export default withModulesManager(injectIntl(IndicatorFilter));
