export * from "./async";

export function round(value, decimals) {
  return Number(Math.round((value + "e" + decimals) as any) + "e-" + decimals);
}
