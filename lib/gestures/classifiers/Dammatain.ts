export function Dammatain(
  downwardDistance: number,
  horizontalDistance: number,
  vShapeScore: number
) {
  const score = Math.min(
    1,
    Math.max(
      0,
      downwardDistance * 3.5 +
        horizontalDistance * 3.5 -
        Math.abs(downwardDistance - horizontalDistance) * 3.5 +
        vShapeScore * 2.0 -
        1.0 // Requires high vShapeScore
    )
  );

  return score;
}