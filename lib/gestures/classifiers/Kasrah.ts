export function Kasrah(
  downwardDistance: number,
  horizontalDistance: number
) {
  const score = Math.min(
    1,
    Math.max(
      0,
      downwardDistance * 6.5 -
        horizontalDistance * 1.9 +
        (downwardDistance > horizontalDistance ? 0.22 : 0)
    )
  );

  return score;
}