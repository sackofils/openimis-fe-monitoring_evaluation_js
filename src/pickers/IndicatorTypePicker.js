/* eslint-disable react/destructuring-assignment */
import React from "react";
import { injectIntl } from "react-intl";
import { SelectInput } from "@openimis/fe-core";
import { MODULE_NAME } from "../constants";

const IndicatorTypePicker = (props) => {
  const { intl, value, onChange, readOnly, withNull = true } = props;

  const options = [
    {
      value: "QUANTITATIVE",
      label: intl.formatMessage({ id: `${MODULE_NAME}.indicator.type.quantitative`, defaultMessage: "Quantitatif" }),
    },
    {
      value: "QUALITATIVE",
      label: intl.formatMessage({ id: `${MODULE_NAME}.indicator.type.qualitative`, defaultMessage: "Qualitatif" }),
    },
  ];

  return (
    <SelectInput
      module={MODULE_NAME}
      label={intl.formatMessage({ id: `${MODULE_NAME}.indicator.type`, defaultMessage: "Type d’indicateur" })}
      options={options}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      withNull={withNull}
    />
  );
};

export default injectIntl(IndicatorTypePicker);
