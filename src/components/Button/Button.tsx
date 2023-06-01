import React from "react";
import "./Button.css";
import { TButton } from "../../types";

export default function Button({ onClick, children }: TButton) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}
