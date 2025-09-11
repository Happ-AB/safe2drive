export const bacCalculator = (
  age: number,
  gender: string | undefined,
  meal: boolean,
  alcohol: number,
  weight: number
) => {
  const alcoholGrams = alcohol * 14;
  const distributionFactor = gender === "male" ? 0.68 : 0.55;
  let ageFactor = 1.0;
  if (age && age > 25) {
    ageFactor = 1.0 + (age - 25) * 0.005;
  }
  let bac =
    weight > 0 ? alcoholGrams / (weight * distributionFactor * ageFactor) : 0;
  if (meal) {
    bac *= 0.7;
  }
  // round to 2 decimals
  bac = Math.round(bac * 100) / 100;
  return Math.max(0, bac);
};
