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
import { injectIntl, FormattedMessage } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";

import {
  MODULE_NAME,
} from "../constants";
import {
    normalizeEnumValue
} from "../utils/utils";

const styles = (theme) => ({
  form: { padding: 0 },
  item: { padding: theme.spacing(1) },
});

class IndicatorFilter extends Component {
  debouncedOnChangeFilter = _debounce(
    this.props.onChangeFilters,
    this.props.modulesManager.getConf(MODULE_NAME, "debounceTime", 500)
  );



  _filterValue = (key) => {
    const { filters } = this.props;
    return filters && filters[key] ? filters[key].value : null;
  };

  _textFilter = (id, v) => ({
    id,
    value: v,
    filter: `${id}_Icontains: "${v}"`,
  });

  _enumFilter = (id, v) => ({
    id,
    value: v,
    filter: v ? `${id}: ${normalizeEnumValue(v)}` : null,
  });

  _dateFilter = (id, op, v) => ({
    id,
    value: v,
    filter: v ? `${id}_${op}: "${v}"` : null,
  });

  render() {
    const { classes, intl } = this.props;

    return (
      <Grid container className={classes.form}>

        {/* Code */}
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
                  this.debouncedOnChangeFilter([this._textFilter("code", v)])
                }
              />
            </Grid>
          }
        />

        {/* Label */}
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
                  this.debouncedOnChangeFilter([this._textFilter("label", v)])
                }
              />
            </Grid>
          }
        />

        {/* Type */}
        <ControlledField
          module={MODULE_NAME}
          id="indicatorFilter.type"
          field={
            <Grid item xs={3} className={classes.item}>
              <PublishedComponent
                pubRef="monitoringEvaluation.IndicatorTypePicker"
                withNull
                label="indicator.type"
                value={this._filterValue("type")}
                onChange={(v) =>
                  this.debouncedOnChangeFilter([this._enumFilter("type", v)])
                }
              />
            </Grid>
          }
        />

        {/* Frequency */}
        <ControlledField
          module={MODULE_NAME}
          id="indicatorFilter.frequency"
          field={
            <Grid item xs={3} className={classes.item}>
              <PublishedComponent
                pubRef="monitoringEvaluation.FrequencyPicker"
                withNull
                label="indicator.frequency"
                value={this._filterValue("frequency")}
                onChange={(v) =>
                  this.debouncedOnChangeFilter([this._enumFilter("frequency", v)])
                }
              />
            </Grid>
          }
        />

        {/* Module */}
        <ControlledField
          module={MODULE_NAME}
          id="indicatorFilter.module"
          field={
            <Grid item xs={3} className={classes.item}>
              <PublishedComponent
                pubRef="monitoringEvaluation.ModulePicker"
                withNull
                label="indicator.module"
                value={this._filterValue("module")}
                onChange={(v) =>
                  this.debouncedOnChangeFilter([this._enumFilter("module", v)])
                }
              />
            </Grid>
          }
        />

        {/* Unit */}
        <ControlledField
          module={MODULE_NAME}
          id="indicatorFilter.unit"
          field={
            <Grid item xs={3} className={classes.item}>
              <PublishedComponent
                pubRef="monitoringEvaluation.UnitPicker"
                withNull
                label="indicator.unit"
                value={this._filterValue("unit")}
                onChange={(v) =>
                  this.debouncedOnChangeFilter([this._enumFilter("unit", v)])
                }
              />
            </Grid>
          }
        />

        {/* Calculation method */}
        <ControlledField
          module={MODULE_NAME}
          id="indicatorFilter.method"
          field={
            <Grid item xs={3} className={classes.item}>
              <PublishedComponent
                pubRef="monitoringEvaluation.CalculationMethodPicker"
                withNull
                label="indicator.method"
                value={this._filterValue("method")}
                onChange={(v) =>
                  this.debouncedOnChangeFilter([this._enumFilter("method", v)])
                }
              />
            </Grid>
          }
        />

        {/* Status */}
        <ControlledField
          module={MODULE_NAME}
          id="indicatorFilter.status"
          field={
            <Grid item xs={3} className={classes.item}>
              <PublishedComponent
                pubRef="monitoringEvaluation.IndicatorStatusPicker"
                withNull
                label="indicator.status"
                value={this._filterValue("status")}
                onChange={(v) =>
                  this.debouncedOnChangeFilter([this._enumFilter("status", v)])
                }
              />
            </Grid>
          }
        />



        {/* Période début
        <ControlledField
          module={MODULE_NAME}
          id="indicatorFilter.periodStart"
          field={
            <Grid item xs={3} className={classes.item}>
              <PublishedComponent
                pubRef="core.DatePicker"
                module={MODULE_NAME}
                label={formatMessage(intl, MODULE_NAME, "indicator.periodStart")}
                value={this._filterValue("periodStart")}
                onChange={(v) =>
                  this.debouncedOnChangeFilter([
                    this._dateFilter("periodStart", "Gte", v),
                  ])
                }
              />
            </Grid>
          }
        />

        <ControlledField
          module={MODULE_NAME}
          id="indicatorFilter.periodEnd"
          field={
            <Grid item xs={3} className={classes.item}>
              <PublishedComponent
                pubRef="core.DatePicker"
                module={MODULE_NAME}
                label={formatMessage(intl, MODULE_NAME, "indicator.periodEnd")}
                value={this._filterValue("periodEnd")}
                onChange={(v) =>
                  this.debouncedOnChangeFilter([
                    this._dateFilter("periodEnd", "Lte", v),
                  ])
                }
              />
            </Grid>
          }
        />
        */}
      </Grid>
    );
  }
}

export default withModulesManager(
  injectIntl(withTheme(withStyles(styles)(IndicatorFilter)))
);
