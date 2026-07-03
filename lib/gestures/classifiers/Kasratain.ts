export function Kasratain(
  downwardDistance: number,
  horizontalDistance: number,
  vShapeScore: number
) {
  const score = Math.min(
    1,
    Math.max(
      0,
      downwardDistance * 5.5 -
        horizontalDistance * 1.9 +
        vShapeScore * 2.0 -
        1.0
    )
  );

  return score;
}
