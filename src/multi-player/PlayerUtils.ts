export const arrayToMatrix = (items: any, cols: number) => {
  const rows = Math.ceil(items.length / cols);
  const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));

  let row = 0;
  let col = 0;
  for (const element of items) {
    matrix[row][col] = element;
    if (col === cols - 1) {
      row++;
      col = 0;
    } else {
      col++;
    }
  }
  return matrix;
};

export const findMatrixDimensions = (numberOfElements: number) => {
  const result = [];
  const length = numberOfElements;

  for (let i = 1; i <= length; i++) {
    const remainingElements = length - i;
    for (let j = 1; j <= remainingElements; j++) {
      if (i !== 1 && j !== 1) {
        const dimensions = [i, j];
        result.push(dimensions);
      }
    }
  }

  return result;
};
