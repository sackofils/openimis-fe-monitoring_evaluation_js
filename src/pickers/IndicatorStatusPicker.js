/* eslint-disable react/destructuring-assignment */
import React from "react";
import { injectIntl } from "react-intl";
import { SelectInput } from "@openimis/fe-core";
import { MODULE_NAME } from "../constants";

const IndicatorStatusPicker = (props) => {
  const { intl, value, onChange, readOnly, withNull = true } = props;

  const options = [
    {
      value: "ACTIVE",
      label: intl.formatMessage({ id: `${MODULE_NAME}.indicator.status.active`, defaultMessage: "Actif" }),
    },
    {
      value: "INACTIVE",
      label: intl.formatMessage({ id: `${MODULE_NAME}.indicator.status.inactive`, defaultMessage: "Inactif" }),
    },
    {
      value: "ARCHIVED",
      label: intl.formatMessage({ id: `${MODULE_NAME}.indicator.status.archived`, defaultMessage: "Archivé" }),
    },
  ];

  return (
    <SelectInput
      module={MODULE_NAME}
      label={intl.formatMessage({ id: `${MODULE_NAME}.indicator.status`, defaultMessage: "Statut" })}
      options={options}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      withNull={withNull}
    />
  );
};

export default injectIntl(IndicatorStatusPicker);
