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
  withModulesManager,
} from "@openimis/fe-core";
import {
  createIndicator,
  updateIndicator,
} from "../actions";
import {
  MODULE_NAME,
  EMPTY_STRING,
  CALCULATION_METHODS,
  CALCULATION_METHOD,
  INDICATOR_STATUS,
  INDICATOR_TYPES,
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
      indicator: props.indicator || {
        code: "",
        label: "",
        description: "",
        module: "",
        method: CALCULATION_METHODS.AUTOMATIC,
        type: INDICATOR_TYPES[0],
        target: 0,
        value: 0,
        unit: "",
        formula: "",
        status: INDICATOR_STATUS[0],
      },
      isSaved: false,
    };
  }

  componentDidUpdate(prevProps) {
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

  save = () => {
    const { indicator } = this.state;
    if (indicator.id) {
      this.props.updateIndicator(indicator, `Updated indicator ${indicator.code}`);
    } else {
      this.props.createIndicator(indicator, `Created indicator ${indicator.code}`);
    }
    this.setState({ isSaved: true });
  };

  render() {
    const { classes } = this.props;
    const { indicator, isSaved } = this.state;
    const isManual = indicator.method === CALCULATION_METHODS.MANUAL;

    return (
      <div className={classes.page}>
        <Grid container>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              {/* === Section Informations de base === */}
              <Grid container className={classes.tableTitle}>
                <Grid item xs={8}>
                  <Typography>
                    <FormattedMessage
                      module={MODULE_NAME}
                      id="indicator.basicInfo"
                      defaultMessage="Basic information"
                    />
                  </Typography>
                </Grid>
              </Grid>

              <Grid container className={classes.item}>
                {/* Code */}
                <Grid item xs={3} className={classes.item}>
                  <TextInput
                    module={MODULE_NAME}
                    label={<FormattedMessage module={MODULE_NAME} id="indicator.code" />}
                    value={indicator.code}
                    onChange={(v) => this.updateField("code", v)}
                    required
                    readOnly={isSaved}
                  />
                </Grid>

                {/* Label */}
                <Grid item xs={3} className={classes.item}>
                  <TextInput
                    module={MODULE_NAME}
                    label={<FormattedMessage module={MODULE_NAME} id="indicator.label" />}
                    value={indicator.label}
                    onChange={(v) => this.updateField("label", v)}
                    required
                    readOnly={isSaved}
                  />
                </Grid>

                {/* Description */}
                <Grid item xs={6} className={classes.item}>
                  <TextInput
                    module={MODULE_NAME}
                    label={<FormattedMessage module={MODULE_NAME} id="indicator.description" />}
                    value={indicator.description}
                    onChange={(v) => this.updateField("description", v)}
                    multiline
                    readOnly={isSaved}
                  />
                </Grid>

                {/* Module */}
                <Grid item xs={3} className={classes.item}>
                  <TextInput
                    module={MODULE_NAME}
                    label={<FormattedMessage module={MODULE_NAME} id="indicator.module" />}
                    value={indicator.module}
                    onChange={(v) => this.updateField("module", v)}
                    required
                    readOnly={isSaved}
                  />
                </Grid>

                {/* Méthode */}
                <Grid item xs={3} className={classes.item}>
                  <FormControl fullWidth>
                    <InputLabel>
                      <FormattedMessage module={MODULE_NAME} id="indicator.method" />
                    </InputLabel>
                    <Select
                      value={indicator.method}
                      onChange={(e) => this.updateField("method", e.target.value)}
                      disabled={isSaved}
                    >
                      <MenuItem value="AUTOMATIC">
                        <FormattedMessage module={MODULE_NAME} id="indicator.automatic" />
                      </MenuItem>
                      <MenuItem value="MANUAL">
                        <FormattedMessage module={MODULE_NAME} id="indicator.manual" />
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Type */}
                <Grid item xs={3} className={classes.item}>
                  <FormControl fullWidth>
                    <InputLabel>
                      <FormattedMessage module={MODULE_NAME} id="indicator.type" />
                    </InputLabel>
                    <Select
                      value={indicator.type}
                      onChange={(e) => this.updateField("type", e.target.value)}
                      disabled={isSaved}
                    >
                      <MenuItem value="Quantitative">
                        <FormattedMessage module={MODULE_NAME} id="indicator.quantitative" />
                      </MenuItem>
                      <MenuItem value="Qualitative">
                        <FormattedMessage module={MODULE_NAME} id="indicator.qualitative" />
                      </MenuItem>
                      <MenuItem value="Composite">
                        <FormattedMessage module={MODULE_NAME} id="indicator.composite" />
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Statut */}
                <Grid item xs={3} className={classes.item}>
                  <FormControl fullWidth>
                    <InputLabel>
                      <FormattedMessage module={MODULE_NAME} id="indicator.status" />
                    </InputLabel>
                    <Select
                      value={indicator.status}
                      onChange={(e) => this.updateField("status", e.target.value)}
                      disabled={isSaved}
                    >
                      <MenuItem value="DRAFT">
                        <FormattedMessage module={MODULE_NAME} id="indicator.draft" />
                      </MenuItem>
                      <MenuItem value="ACTIVE">
                        <FormattedMessage module={MODULE_NAME} id="indicator.active" />
                      </MenuItem>
                      <MenuItem value="INACTIVE">
                        <FormattedMessage module={MODULE_NAME} id="indicator.inactive" />
                      </MenuItem>
                      <MenuItem value="ARCHIVED">
                        <FormattedMessage module={MODULE_NAME} id="indicator.archived" />
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Divider />

              {/* === Section Valeurs & Calcul === */}
              <Grid container className={classes.tableTitle}>
                <Grid item xs={8}>
                  <Typography>
                    <FormattedMessage
                      module={MODULE_NAME}
                      id="indicator.computation"
                      defaultMessage="Values & Computation"
                    />
                  </Typography>
                </Grid>
              </Grid>

              <Grid container className={classes.item}>
                {/* Target */}
                <Grid item xs={3} className={classes.item}>
                  <TextInput
                    module={MODULE_NAME}
                    label={<FormattedMessage module={MODULE_NAME} id="indicator.target" />}
                    value={indicator.target}
                    onChange={(v) => this.updateField("target", parseFloat(v) || 0)}
                    type="number"
                    readOnly={isSaved}
                  />
                </Grid>

                {/* Unit */}
                <Grid item xs={3} className={classes.item}>
                  <TextInput
                    module={MODULE_NAME}
                    label={<FormattedMessage module={MODULE_NAME} id="indicator.unit" />}
                    value={indicator.unit}
                    onChange={(v) => this.updateField("unit", v)}
                    readOnly={isSaved}
                  />
                </Grid>

                {/* Valeur (si manuel) */}
                {isManual && (
                  <Grid item xs={3} className={classes.item}>
                    <TextInput
                      module={MODULE_NAME}
                      label={<FormattedMessage module={MODULE_NAME} id="indicator.value" />}
                      value={indicator.value}
                      onChange={(v) => this.updateField("value", parseFloat(v) || 0)}
                      type="number"
                      readOnly={isSaved}
                    />
                  </Grid>
                )}

                {/* Formule (si automatique) */}
                {!isManual && (
                  <Grid item xs={6} className={classes.item}>
                    <TextInput
                      module={MODULE_NAME}
                      label={<FormattedMessage module={MODULE_NAME} id="indicator.formula" />}
                      value={indicator.formula}
                      onChange={(v) => this.updateField("formula", v)}
                      multiline
                      readOnly={isSaved}
                    />
                  </Grid>
                )}
              </Grid>

              {/* Bouton sauvegarde */}
              <Grid container justifyContent="flex-end" className={classes.item}>
                <IconButton
                  color="primary"
                  onClick={this.save}
                  disabled={!indicator.code || !indicator.label || !indicator.method || isSaved}
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
  injectIntl(withTheme(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(IndicatorForm))))
);
