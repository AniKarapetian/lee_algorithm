import React from "react";
import classes from "./cell.module.css";

type CellProps = {
  data: {
    value: number;
    x: number;
    y: number;
    targetValue: number;
  };
  onClick?: VoidFunction;
};

type Style = { [key: string]: string };

const Cell: React.FC<CellProps> = ({ data, onClick }) => {
  const values = [-1, 0, 1, data.targetValue];
  const backgroundColors: Style = {
    "0": "white",
    "1": "red",
    [data.targetValue]: "green",
    "-1": "#5a0e0e",
    "-2": "blue",
  };
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  return (
    <div
      onClick={handleClick}
      className={classes.cell}
      style={{
        backgroundColor: backgroundColors[String(data.value)] || "lightblue",
      }}
    >
      {data.value}
    </div>
  );
};

export default Cell;
