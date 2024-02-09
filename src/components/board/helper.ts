export type ICell = {
    x: number;
    y: number;
    value: number;
  } | null;



  export const generateMatrix = (rowCount: number, colCount:number) => {
    let m = [[0]];
    for (let i = 0; i < rowCount; i++) {
      m[i] = [];
      for (let j = 0; j < colCount; j++) {
        m[i][j] = 0;
      }
    }
    return m;
  };
 
  export const handleClickCell = (x: number, y: number, start: ICell, target: ICell,  matrix:number[][]) => {
      let neighbours: ICell[] = [];
      if (matrix.length) {
          if (!start) {
        start = { x, y, value: 1 };
        neighbours = findNeighbours(2, x, y, matrix);
        matrix[x][y] = 1;
      } else if (start && !target && (start.x !== x || start.y !== y)) {
        const value = matrix[0].length * matrix.length;
       target = { x, y, value };
        matrix[x][y] = value;
      }
      if (start && target && matrix[x][y] === 0) {
        matrix[x][y] = -1;
      }
    }

    return {
        newStart:start, newTarget:target, newMatrix:[...matrix], newNeighbours: [...neighbours]
    }
  };

   const findPath = (start: ICell, target: ICell, matrix:number[][]) => {
    const path: ICell[] = [];
    let { x, y } = target!;
    while (matrix[x][y] !== 1) {
      const data = [];

      if (x !== 0 && matrix[x - 1][y] !== -1) {
        data.push({ x: x - 1, y, value: matrix[x - 1][y] });
      }

      if (y + 1 <  matrix[0].length && matrix[x][y + 1] !== -1) {
        data.push({ x, y: y + 1, value: matrix[x][y + 1] });
      }

      if (x + 1 < matrix.length && matrix[x + 1][y] !== -1) {
        data.push({ x: x + 1, y, value: matrix[x + 1][y] });
      }

      if (y !== 0 && matrix[x][y - 1] !== -1) {
        data.push({ x, y: y - 1, value: matrix[x][y - 1] });
      }

      if (data.length) {
        data.sort((a, b) => a.value! - b.value!);
        if (data[0].value !== 1 && data[0].value !== -1) {
          path.push(data[0]);
        }
        x = data[0]?.x;
        y = data[0]?.y;
      } else {
        x = start!.x;
        y = start!.y;
      }
    }

    return path;
  };

  const findNeighbours = (value: number, x: number, y: number, matrix:number[][] ): ICell[] => {
    const data: ICell[] = [];
    if (matrix.length && matrix[0].length) {
      if (x !== 0 && matrix[x - 1][y] === 0) {
        data.push({ x: x - 1, y, value });
      }

      if (y + 1 < matrix[0].length && matrix[x][y + 1] === 0) {
        data.push({ x, y: y + 1, value });
      }

      if (x + 1 < matrix.length && matrix[x + 1][y] === 0) {
        data.push({ x: x + 1, y, value });
      }

      if (y !== 0 && matrix[x][y - 1] === 0) {
        data.push({ x, y: y - 1, value });
      }
    }

    return data;
  };
  export const generateMapData = (matrixData:number[][], startNeighbors: ICell[], start: ICell, target: ICell) => {

   

      const matrix = [...matrixData];
      if (matrix.length) {
      let n: ICell[] = [...startNeighbors];

      while (n.length) {
        const { x, y, value } = n[0]!;
        matrix[x][y] = value!;

        n.shift();
        const m = findNeighbours(value + 1, x, y, matrix);
        if (m.length) {
          n.push(...m);
        }
      }

      const path = findPath(start, target, matrix);
      for (let i = 0; i < path.length; i++) {
        matrix[path[i]!.x][path[i]!.y] = -2;
      }

    }

   
    return matrix;
  };