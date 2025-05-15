import React from "react";
import { Button } from "react-bootstrap";
import "../popup/popup.scss";
function CustomMsg(props) {
  const closePOPUP = () => {
    props.closeAlert();
  };
  return (
    <div className="popupBack">
      <div className="popup" onClose={closePOPUP}>
        <p>{props.msg}</p>
        <Button className="close" onClick={closePOPUP}>
          Close
        </Button>
      </div>
    </div>
  );
}

export default CustomMsg;
