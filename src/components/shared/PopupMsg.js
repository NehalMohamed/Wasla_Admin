import React, { useState } from "react";
import { useTranslation } from "react-multi-lang";
import Alert from "react-popup-alert";
const PopUpMsg = ({ text, show, closeAlert }) => {
  const t = useTranslation();
  console.log("props.shows ", show);
  return (
    <Alert
      header={t("PopUp.Header")}
      btnText={t("PopUp.Close")}
      text={text}
      type={"error"}
      show={show}
      onClosePress={closeAlert}
      pressCloseOnOutsideClick={true}
      showBorderBottom={true}
      alertStyles={{}}
      headerStyles={{}}
      textStyles={{}}
      buttonStyles={{ backgroundColor: "#00bc82" }}
    />
  );
};

export default PopUpMsg;
