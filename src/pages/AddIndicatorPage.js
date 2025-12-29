/* eslint-disable react/destructuring-assignment */
import React, { Component, Fragment, Grid } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { injectIntl, FormattedMessage } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Form, withModulesManager, journalize } from "@openimis/fe-core";
import IndicatorForm from "../components/IndicatorForm";
import { MODULE_NAME } from "../constants";

const styles = (theme) => ({
  paper: theme.paper.paper,
  tableTitle: theme.table.title,
  item: theme.paper.item,
  fullHeight: {
    height: '100%',
  },
});

class AddIndicatorPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: props?.match?.params?.category_code,
      indicator: {},
    };
  }

  render() {
    const { intl, history, classes } = this.props;
    const back = () => history.goBack();

    return (
        <div className={classes.page}>
          <Fragment>
              <Form
                module={MODULE_NAME}
                title="indicator.addTitle"
                titleParams={{ label: "" }}
                back={back}
                edited={this.state.indicator}
                category={this.state.category}
                canSave={() => true}
                Panels={[IndicatorForm]}
              />
          </Fragment>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ journalize }, dispatch);

export default withModulesManager(
  injectIntl(withTheme(withStyles(styles)(connect(null, mapDispatchToProps)(AddIndicatorPage)))),
);
