import React, { useState } from "react";
import Cell from "../cell/Cell";
import { v4 as uuidv4 } from "uuid";

interface ICell {
  x: number;
  y: number;
  value?: number;
}

const Board: React.FC = () => {
  const [rowCount, setRowCount] = useState(10);
  const [colCount, setColCount] = useState(10);

  const [start, setStart] = useState<ICell | null>(null);
  const [target, setTarget] = useState<ICell | null>(null);
  const [neighbors, setNeighbors] = useState<ICell[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [matrix, setMatrix] = useState<number[][]>([]);
  const generateBoard = () => {
    let m = [[0]];
    for (let i = 0; i < rowCount; i++) {
      m[i] = [];
      for (let j = 0; j < colCount; j++) {
        m[i][j] = 0;
      }
    }
    setMatrix(m);
  };

  const findNeighbors = (value: number, x: number, y: number): ICell[] => {
    const data: ICell[] = [];
    if (matrix.length) {
      if (x !== 0 && matrix[x - 1][y] === 0) {
        data.push({ x: x - 1, y, value });
      }

      if (y + 1 < colCount && matrix[x][y + 1] === 0) {
        data.push({ x, y: y + 1, value });
      }

      if (x + 1 < rowCount && matrix[x + 1][y] === 0) {
        data.push({ x: x + 1, y, value });
      }

      if (y !== 0 && matrix[x][y - 1] === 0) {
        data.push({ x, y: y - 1, value });
      }
    }

    return data;
  };

  const handleClickCell = (x: number, y: number) => {
    if (matrix.length) {
      if (!start) {
        setStart({ x, y, value: 1 });
        setNeighbors(findNeighbors(2, x, y));
        matrix[x][y] = 1;
      } else if (start && !target && (start.x !== x || start.y !== y)) {
        const value = colCount * rowCount;
        setTarget({ x, y, value });
        matrix[x][y] = value;
      }
      if (start && target && matrix[x][y] === 0) {
        matrix[x][y] = -1;
      }
      setMatrix([...matrix]);
    }
  };

  const reset = () => {
    setIsLoading(false);
    if (matrix && start && target) {
      matrix[target.x][target.y] = 0;
      matrix[start.x][start.y] = 0;

      for (let i = 0; i < rowCount; i++) {
        matrix[i] = [];
        for (let j = 0; j < colCount; j++) {
          matrix[i][j] = 0;
        }
      }

      setMatrix([...matrix]);
    }
    setNeighbors([]);
    setStart(null);
    setTarget(null);
  };

  const generateMap = () => {
    setIsLoading(true);
    if (matrix.length) {
      let n: ICell[] = [...neighbors];

      while (n.length) {
        const { x, y, value } = n[0];
        matrix[x][y] = value!;

        n.shift();
        const m = findNeighbors(value! + 1, x, y);
        if (m.length) {
          n.push(...m);
        }
      }

      setMatrix([...matrix]);

      console.log(findPath());
    }
  };
  const findPath = () => {
    const path: ICell[] = [];
    let { x, y, value } = target!;
    while (x !== start!.x && y !== start!.y) {
      const n = findNeighbors(value!, x, y);
      n.sort((a, b) => a.value! - b.value!);
      console.log(n);
      path.push(n[0]);
      x = n[0]?.x;
      y = n[0]?.y;
    }

    return path;
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
      />{" "}
      <br />
      <br />
      <button onClick={generateBoard}>Generate board</button>
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
                  onClick={() => handleClickCell(rowIndex, colIndex)}
                />
              ))}
            </div>
          ))}
      </div>
      <br />
      {isLoading && "Loading..."}
      <br />
      {!!matrix && !!start && !!target && (
        <button onClick={reset}>Reset</button>
      )}
      <br />
      <br />
      {!!matrix && !!start && !!target && (
        <button onClick={generateMap}>Find path</button>
      )}
    </div>
  );
};

export default Board;
