/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { injectIntl, FormattedMessage } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";
import {
  Grid,
  Paper,
  Typography,
  Divider,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@material-ui/core";
import { Save } from "@material-ui/icons";
import {
    TextInput,
    journalize,
    withHistory,
    withModulesManager,
    formatMessage,
    PublishedComponent,
    ControlledField
} from "@openimis/fe-core";

import { createIndicator, updateIndicator } from "../actions";
import {
  MODULE_NAME,
} from "../constants";

const styles = (theme) => ({
  paper: theme.paper.paper,
  tableTitle: theme.table.title,
  item: theme.paper.item,
});

class IndicatorForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      indicator: props.edited || {
        code: "",
        name: "",
        description: "",
        calculationMethod: "",
        module: "",
        method: "AUTOMATIQUE",
        type: "QUANTITATIVE",
        target: 0,
        value: null,
        unit: "",
        formula: "",
        status: "BROUILLON",
      },
      isSaved: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.edited !== this.props.edited && this.props.edited) {
      this.setState({ indicator: this.props.edited });
    }

    if (prevProps.submittingMutation && !this.props.submittingMutation) {
      this.props.journalize(this.props.mutation);
    }
  }

  updateField = (k, v) => {
    this.setState((state) => ({
      indicator: { ...state.indicator, [k]: v },
      isSaved: false,
    }));
  };

  capitalizeFirstLetter = (str) => {
      if (!str) {
        return "";
      }
      const firstLetter = str.charAt(0).toUpperCase();
      const restOfWord = str.slice(1).toLowerCase();
      return firstLetter + restOfWord;
    }

  save = () => {
    const { indicator } = this.state;
    const payload = { ...indicator };

    if (payload.id) {
      this.props.updateIndicator(payload, `Updated indicator ${payload.code}`);
    } else {
      const category = this.props.category == 'pip' ? 'PIP' : 'RESULT_FRAMEWORK';
      payload.category = category;
      this.props.createIndicator(payload, `Created indicator ${payload.code}`);
    }

    this.setState({ isSaved: true });
  };

  render() {
    const { intl, classes } = this.props;
    const { indicator, isSaved } = this.state;
    const isManual = indicator.method === "MANUEL";

    return (
      <div className={classes.page}>
        <Grid container>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              {/* === Informations de base === */}
              <Grid container className={classes.tableTitle}>
                  <Grid item xs={8} className={classes.tableTitle}>
                    <Typography>
                      <FormattedMessage module={MODULE_NAME} id="indicator.basicInfo" />
                    </Typography>
                  </Grid>
              </Grid>

              <Grid container className={classes.item}>
                {/* Code */}
                <Grid item xs={3} className={classes.item}>
                  <TextInput
                    module={MODULE_NAME}
                    label={formatMessage(intl, MODULE_NAME, "indicator.code")}
                    value={indicator.code}
                    onChange={(v) => this.updateField("code", v)}
                    required
                    readOnly={isSaved}
                  />
                </Grid>

                {/* Nom */}
                <Grid item xs={9} className={classes.item}>
                  <TextInput
                    module={MODULE_NAME}
                    label={formatMessage(intl, MODULE_NAME, "indicator.label")}
                    value={indicator.name}
                    onChange={(v) => this.updateField("name", v)}
                    required
                    readOnly={isSaved}
                  />
                </Grid>

                {/* Description */}
                <Grid item xs={12} className={classes.item}>
                  <TextInput
                    module={MODULE_NAME}
                    label={formatMessage(intl, MODULE_NAME, "indicator.description")}
                    value={indicator.description}
                    onChange={(v) => this.updateField("description", v)}
                    multiline
                    readOnly={isSaved}
                  />
                </Grid>

                {/* Calculation method */}
                <Grid item xs={12} className={classes.item}>
                  <TextInput
                    module={MODULE_NAME}
                    label={formatMessage(intl, MODULE_NAME, "indicator.calculationMethod")}
                    value={indicator.calculationMethod}
                    onChange={(v) => this.updateField("calculationMethod", v)}
                    multiline
                    readOnly={isSaved}
                  />
                </Grid>

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
                        value={indicator.module}
                        onChange={(v) =>this.updateField("module", v)}
                        readOnly={isSaved}
                      />
                    </Grid>
                  }
                />

                {/* Méthode */}
                <ControlledField
                  module={MODULE_NAME}
                  id="indicatorFilter.method"
                  field={
                    <Grid item xs={3} className={classes.item}>
                      <PublishedComponent
                        pubRef="monitoringEvaluation.CalculationMethodPicker"
                        withNull
                        label="indicator.method"
                        value={indicator.method}
                        required
                        onChange={(v) =>this.updateField("method", v)}
                        readOnly={isSaved}
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
                        value={indicator.type}
                        onChange={(v) => this.updateField("type", v)}
                        readOnly={isSaved}
                        required
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
                        value={indicator.status}
                        onChange={(v) => this.updateField("status", v)}
                        readOnly={isSaved}
                        required
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
                        value={indicator.frequency}
                        onChange={(v) => this.updateField("frequency", v)}
                        readOnly={isSaved}
                        required
                      />
                    </Grid>
                  }
                />

              </Grid>

              <Divider />

              {/* === Valeurs & Calcul === */}
              <Grid container className={classes.tableTitle}>
                  <Grid item xs={8} className={classes.tableTitle}>
                    <Typography>
                      <FormattedMessage module={MODULE_NAME} id="indicator.computation" />
                    </Typography>
                  </Grid>
              </Grid>

              <Grid container className={classes.item}>
                {/* Cible */}
                <Grid item xs={3} className={classes.item}>
                  <TextInput
                    module={MODULE_NAME}
                    label={formatMessage(intl, MODULE_NAME, "indicator.target")}
                    value={indicator.target}
                    onChange={(v) => this.updateField("target", parseFloat(v) || 0)}
                    type="number"
                    required
                    readOnly={isSaved}
                  />
                </Grid>


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
                        value={indicator.unit}
                        onChange={(v) => this.updateField("unit", v)}
                        readOnly={isSaved}
                        required
                      />
                    </Grid>
                  }
                />

                {/* Valeur (manuel) */}
                {indicator.method === "MANUEL" && (
                  <Grid item xs={3} className={classes.item}>
                    <TextInput
                      module={MODULE_NAME}
                      label={formatMessage(intl, MODULE_NAME, "indicator.value")}
                      value={indicator.value}
                      onChange={(v) => this.updateField("value", parseFloat(v) || 0)}
                      type="number"
                      readOnly={isSaved}
                    />
                  </Grid>
                )}

                {/* Formule (automatique) */}
                {indicator.method === "AUTOMATIQUE" && (
                  <Grid item xs={6} className={classes.item}>
                    <TextInput
                      module={MODULE_NAME}
                      label={formatMessage(intl, MODULE_NAME, "indicator.formula")}
                      value={indicator.formula}
                      onChange={(v) => this.updateField("formula", v)}
                      multiline
                      readOnly={isSaved}
                    />
                  </Grid>
                )}
              </Grid>

              {/* Bouton de sauvegarde */}
              <Grid container justifyContent="flex-end" className={classes.item}>
                <IconButton
                  color="primary"
                  onClick={this.save}
                  disabled={
                    !indicator.code ||
                    !indicator.name ||
                    !indicator.method ||
                    !indicator.type ||
                    !indicator.status ||
                    !indicator.frequency ||
                    !indicator.description ||
                    isSaved
                  }
                >
                  <Save />
                </IconButton>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  submittingMutation: state.monitoringEvaluation.submittingMutation,
  mutation: state.monitoringEvaluation.mutation,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ createIndicator, updateIndicator, journalize }, dispatch);


export default withModulesManager(
  withHistory(
    connect(mapStateToProps, mapDispatchToProps)(
      injectIntl(withTheme(withStyles(styles)(IndicatorForm)))
    )
  )
);
