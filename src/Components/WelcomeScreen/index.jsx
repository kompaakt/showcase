import React from "react";
import "./index.css";

export default () => {
  return (
    <div className="container">
      <div className="actions">
        <input className="btn join" placeholder="join" />
        <button className="btn create" onClick={() => console.log("clicked")}>
          create
        </button>
      </div>
    </div>
  );
};
