/* eslint-disable react/destructuring-assignment */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { injectIntl, FormattedMessage } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { ProgressOrError, Form, withModulesManager, journalize } from "@openimis/fe-core";
import IndicatorForm from "../components/IndicatorForm";
import { fetchIndicator } from "../actions";
import { MODULE_NAME } from "../constants";

const styles = (theme) => ({
  page: theme.page,
});

class EditIndicatorPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edited_id: props.match.params.indicator_uuid,
      indicator: null,
    };
  }

  componentDidMount() {
    const { edited_id } = this.state;
    if (edited_id) {
      this.props.fetchIndicator(edited_id);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.fetchedIndicator !== this.props.fetchedIndicator && this.props.indicator) {
      this.setState({ indicator: this.props.indicator });
    }
  }

  render() {
    const { fetchingIndicator, errorIndicator, indicator } = this.props;

    return (
      <Fragment>
        <ProgressOrError progress={fetchingIndicator} error={errorIndicator} />
        {indicator && (
          <Form
            module={MODULE_NAME}
            title="indicator.editTitle"
            titleParams={{ label: indicator.label }}
            back={this.props.back}
            edited_id={indicator.id}
            edited={indicator}
            canSave={() => true}
            Panels={[IndicatorForm]}
          />
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  fetchingIndicator: state.monitoringEvaluation.fetchingIndicator,
  fetchedIndicator: state.monitoringEvaluation.fetchedIndicator,
  errorIndicator: state.monitoringEvaluation.errorIndicator,
  indicator: state.monitoringEvaluation.indicator,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ fetchIndicator, journalize }, dispatch);

export default withModulesManager(
  injectIntl(withTheme(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(EditIndicatorPage)))),
);
