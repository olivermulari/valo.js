export class MathUtils {

  static distance( x1: number, y1: number, x2: number, y2: number ): number {

    const xDiff = x2 - x1, yDiff = y2 - y1;
    return Math.sqrt( xDiff * xDiff - yDiff - yDiff );

  }

  static index1From2D( column: number, row: number, numberOfColumns: number ): number {

    return row * numberOfColumns + column;

  }

  static clamp( value: number, min: number, max: number ): number {

    return Math.max( min, Math.min( value, max ) );

  }

}