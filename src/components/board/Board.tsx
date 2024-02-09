import React, { useState } from "react";
import Cell from "../cell/Cell";
import { v4 as uuidv4 } from "uuid";
import {
  ICell,
  generateMatrix,
  generateMapData,
  handleClickCell,
} from "./helper";

const Board: React.FC = () => {
  const [buttonClicked, setButtonClicked] = useState(false);
  const [rowCount, setRowCount] = useState(10);
  const [colCount, setColCount] = useState(10);

  const [start, setStart] = useState<ICell>(null);
  const [target, setTarget] = useState<ICell>(null);
  const [startNeighbors, setStartNeighbors] = useState<ICell[]>([]);

  const [matrix, setMatrix] = useState<number[][]>([]);
  const generate = () => {
    setMatrix(generateMatrix(rowCount, colCount));
  };
  const onClickCell = (x: number, y: number) => {
    const { newStart, newTarget, newMatrix, newNeighbours } = handleClickCell(
      x,
      y,
      start,
      target,
      [...matrix]
    );
    setStart(newStart);
    setTarget(newTarget);
    setMatrix(newMatrix);
    !start?.x && setStartNeighbors(newNeighbours);
  };

  const reset = () => {
    setMatrix(generateMatrix(rowCount, colCount));
    setStartNeighbors([]);
    setStart(null);
    setTarget(null);
    setButtonClicked(false);
  };

  const generateMap = () => {
    setButtonClicked(true);

    setMatrix(generateMapData(matrix, startNeighbors, start, target));
  };

  return (
    <div>
      <label htmlFor="rowCount">Row Count</label>
      <br />
      <input
        type="number"
        id="rowCount"
        name="rowCount"
        value={rowCount}
        max={30}
        onChange={(event) => setRowCount(Number(event?.target.value))}
      />
      <br /> <br />
      <label htmlFor="colCount"> Col Count</label>
      <br />
      <input
        type="number"
        id="colCount"
        value={colCount}
        max={30}
        onChange={(event) => setColCount(Number(event?.target.value))}
      />
      <br />
      <br />
      <button onClick={generate}>Generate board</button>
      <br /> <br />
      <div>
        {!!rowCount &&
          !!colCount &&
          matrix &&
          matrix.map((row, rowIndex) => (
            <div key={uuidv4()} style={{ height: "50px" }}>
              {row.map((value, colIndex) => (
                <Cell
                  key={uuidv4()}
                  data={{
                    value,
                    x: rowIndex,
                    y: colIndex,
                    targetValue: colCount * rowCount,
                  }}
                  onClick={() => onClickCell(rowIndex, colIndex)}
                />
              ))}
            </div>
          ))}
      </div>
      <br />
      <br />
      {!!matrix && !!start && !!target && (
        <button onClick={reset}>Reset</button>
      )}
      <br />
      <br />
      {!!matrix && !!start && !!target && (
        <button
          onClick={generateMap}
          style={{ display: buttonClicked ? "none" : "block" }}
        >
          Find path
        </button>
      )}
    </div>
  );
};

export default Board;
