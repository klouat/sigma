export function Fathatain(
  horizontalDistance: number,
  deltaY: number,
  pathLength: number
) {
  // Path length should be significantly longer than straight-line horizontal distance 
  // for a back-and-forth double movement.
  const ratio = Math.max(0, pathLength - horizontalDistance) / (horizontalDistance + 0.01);
  const score = Math.min(
    1,
    Math.max(
      0,
      horizontalDistance * 4.0 + ratio * 1.5 - Math.abs(deltaY) * 2.0
    )
  );

  return score;
}