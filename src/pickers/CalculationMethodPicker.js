/* eslint-disable react/jsx-props-no-spreading */
import React, { Component } from 'react';
import { ConstantBasedPicker } from '@openimis/fe-core';

import { CALCULATION_METHODS, MODULE_NAME } from '../constants';

class CalculationMethodPicker extends Component {
  render() {
    const { intl, readOnly = false } = this.props;

    return (
      <ConstantBasedPicker
        constants={CALCULATION_METHODS}
        readOnly={readOnly}
        {...this.props}
      />
    );
  }
}

export default CalculationMethodPicker;

