export function Sukun(
  totalDistance: number
) {
  // Score is high if distance is very low
  const score = Math.min(1, Math.max(0, 1.0 - (totalDistance / 0.05)));

  return score;
}