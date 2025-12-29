/* eslint-disable react/jsx-props-no-spreading */
import React, { Component } from 'react';
import { ConstantBasedPicker } from '@openimis/fe-core';

import { FREQUENCY_TYPES, MODULE_NAME } from '../constants';

class FrequencyPicker extends Component {
  render() {
    const { intl, readOnly = false } = this.props;

    return (
      <ConstantBasedPicker
        constants={FREQUENCY_TYPES}
        readOnly={readOnly}
        {...this.props}
      />
    );
  }
}

export default FrequencyPicker;
