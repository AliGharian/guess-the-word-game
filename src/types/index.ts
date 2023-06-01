import { ReactNode } from "react";
import { GameMode } from "../enum";

export type TInputWord = {
  onComplete: (value: string) => void;
};

export type TButton = {
  onClick?: (value: any) => void;
  children?: string | ReactNode;
};

export type TRadioGroup = {
  value: GameMode;
  onChange: (value: GameMode) => void;
};
