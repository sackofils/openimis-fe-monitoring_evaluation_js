/* eslint-disable react/jsx-props-no-spreading */
import React, { Component } from 'react';
import { ConstantBasedPicker } from '@openimis/fe-core';

import { MODULE_TYPES, MODULE_NAME } from '../constants';

class ModulePicker extends Component {
  render() {
    const { intl, readOnly = false } = this.props;

    return (
      <ConstantBasedPicker
        constants={MODULE_TYPES}
        readOnly={readOnly}
        {...this.props}
      />
    );
  }
}

export default ModulePicker;
