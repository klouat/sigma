export function Fathah(
  horizontalDistance: number,
  deltaY: number
) {
  const score = Math.min(
    1,
    Math.max(
      0,
      horizontalDistance * 5.4 -
        Math.abs(deltaY) * 1.7 +
        (horizontalDistance > Math.abs(deltaY) ? 0.22 : 0)
    )
  );

  return score;
}