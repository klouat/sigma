export function Dammah(
  downwardDistance: number,
  horizontalDistance: number
) {
  const score = Math.min(
    1,
    Math.max(
      0,
      downwardDistance * 4.5 +
        horizontalDistance * 4.5 -
        Math.abs(downwardDistance - horizontalDistance) * 3.5
    )
  );

  return score;
}