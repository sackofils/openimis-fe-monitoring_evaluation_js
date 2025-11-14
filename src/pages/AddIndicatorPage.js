/* eslint-disable react/destructuring-assignment */
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { injectIntl, FormattedMessage } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Form, withModulesManager, journalize } from "@openimis/fe-core";
import IndicatorForm from "../components/IndicatorForm";
import { MODULE_NAME } from "../constants";

const styles = (theme) => ({
  page: theme.page,
});

class AddIndicatorPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      indicator: {},
    };
  }

  render() {
    const { intl } = this.props;

    return (
      <Form
        module={MODULE_NAME}
        title="indicator.addTitle"
        titleParams={{ label: "" }}
        back={this.props.back}
        edited={this.state.indicator}
        canSave={() => true}
        Panels={[IndicatorForm]}
      />
    );
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ journalize }, dispatch);

export default withModulesManager(
  injectIntl(withTheme(withStyles(styles)(connect(null, mapDispatchToProps)(AddIndicatorPage)))),
);
