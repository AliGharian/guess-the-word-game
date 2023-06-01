import React from "react";
import { GameMode } from "../../enum";
import "./RadioGroup.css";
import { TRadioGroup } from "../../types";

const RadioGroup: React.FC<TRadioGroup> = ({ value, onChange }) => {
  return (
    <div>
      <label className="radio">
        <input
          type="radio"
          className="radio"
          checked={value === GameMode.EASTY}
          onChange={() => onChange(GameMode.EASTY)}
        />
        Easy
      </label>
      <label className="radio">
        <input
          className="radio"
          type="radio"
          checked={value === GameMode.REGULAR}
          onChange={() => onChange(GameMode.REGULAR)}
        />
        Regular
      </label>
      <label className="radio">
        <input
          className="radio"
          type="radio"
          checked={value === GameMode.HARD}
          onChange={() => onChange(GameMode.HARD)}
        />
        Hard
      </label>
    </div>
  );
};

export default RadioGroup;
