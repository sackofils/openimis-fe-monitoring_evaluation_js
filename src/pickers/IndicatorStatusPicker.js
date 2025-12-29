/* eslint-disable react/jsx-props-no-spreading */
import React, { Component } from 'react';
import { ConstantBasedPicker } from '@openimis/fe-core';

import { INDICATOR_STATUSES, MODULE_NAME } from '../constants';

class IndicatorStatusPicker extends Component {
  render() {
    const { intl, readOnly = false } = this.props;

    return (
      <ConstantBasedPicker
        constants={INDICATOR_STATUSES}
        readOnly={readOnly}
        {...this.props}
      />
    );
  }
}

export default IndicatorStatusPicker;
