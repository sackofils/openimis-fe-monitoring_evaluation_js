/* eslint-disable react/destructuring-assignment */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { injectIntl } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";
import {
    ProgressOrError,
    Form,
    withModulesManager,
    withHistory,
    journalize,
    useHistory,
} from "@openimis/fe-core";

import IndicatorForm from "../components/IndicatorForm";
import { fetchIndicator } from "../actions";
import { MODULE_NAME } from "../constants";

const styles = (theme) => ({
  page: theme.page,
});
const history = useHistory();
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

  flattenIndicator = (ind) => {
    if (!ind) return null;

    const values = ind.values?.edges?.map((e) => e.node) || [];

    let latestValue = null;
    if (values.length > 0) {
      values.sort((a, b) => new Date(b.periodEnd) - new Date(a.periodEnd));
      latestValue = values[0].value ?? values[0].qualitativeValue ?? null;
    }

    return {
      ...ind,
      latestValue,
      valuesList: values,
    };
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.fetchedIndicator !== this.props.fetchedIndicator &&
      this.props.indicator
    ) {
      this.setState({
        indicator: this.flattenIndicator(this.props.indicator),
      });
    }
  }

  render() {
    const { fetchingIndicator, errorIndicator, history } = this.props;
    const { indicator } = this.state;

    const back = () => history.goBack();

    return (
      <Fragment>
        <ProgressOrError progress={fetchingIndicator} error={errorIndicator} />

        {indicator && (
          <Form
            module={MODULE_NAME}
            title="indicator.editTitle"
            titleParams={{ label: indicator.name }}
            back={back}
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
  withHistory(
    connect(mapStateToProps, mapDispatchToProps)(
      injectIntl(withTheme(withStyles(styles)(EditIndicatorPage)))
    )
  )
);
