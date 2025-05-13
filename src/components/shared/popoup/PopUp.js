import { Button } from "react-bootstrap";
import React from "react";
// import Popup from 'react-animated-popup'
import "./popup.scss";
import { useTranslation } from "react-multi-lang";

function PopUp(props) {
  const closePOPUP = () => {
    props.closeAlert();
  };
  const t = useTranslation();
  return (
    <div className="popupBack">
      <div className="popup" onClose={closePOPUP}>
        <p>{props.msg}</p>
        <Button className="close" onClick={closePOPUP}>
          {t("PopUp.Close")}
        </Button>
      </div>
    </div>
  );
}

export default PopUp;
