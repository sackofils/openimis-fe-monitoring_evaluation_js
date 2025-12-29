/* eslint-disable react/jsx-props-no-spreading */
import React, { Component } from 'react';
import { ConstantBasedPicker } from '@openimis/fe-core';

import { UNIT_TYPES, MODULE_NAME } from '../constants';

class UnitPicker extends Component {
  render() {
    const { intl, readOnly = false } = this.props;

    return (
      <ConstantBasedPicker
        constants={UNIT_TYPES}
        readOnly={readOnly}
        {...this.props}
      />
    );
  }
}

export default UnitPicker;
