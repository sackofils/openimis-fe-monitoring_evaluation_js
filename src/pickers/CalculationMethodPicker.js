/* eslint-disable react/destructuring-assignment */
import React from "react";
import { injectIntl } from "react-intl";
import { SelectInput } from "@openimis/fe-core";
import { MODULE_NAME } from "../constants";

const CalculationMethodPicker = (props) => {
  const { intl, value, onChange, readOnly, withNull = true } = props;

  const options = [
    {
      value: "MANUAL",
      label: intl.formatMessage({ id: `${MODULE_NAME}.calculationMethod.manual`, defaultMessage: "Manuel" }),
    },
    {
      value: "AUTOMATIC",
      label: intl.formatMessage({ id: `${MODULE_NAME}.calculationMethod.automatic`, defaultMessage: "Automatique" }),
    },
  ];

  return (
    <SelectInput
      module={MODULE_NAME}
      label={intl.formatMessage({ id: `${MODULE_NAME}.indicator.method`, defaultMessage: "Méthode de calcul" })}
      options={options}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      withNull={withNull}
    />
  );
};

export default injectIntl(CalculationMethodPicker);
