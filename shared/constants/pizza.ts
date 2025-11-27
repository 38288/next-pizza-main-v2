export const mapPizzaSize = {
  20: 'Свинина',
  30: 'Курица',
  40: 'Сосиски',
} as const;

export const mapPizzaType = {
  1: '',
  2: '',
} as const;

export const pizzaSizes = Object.entries(mapPizzaSize).map(([value, name]) => ({
  name,
  value,
}));

export const pizzaTypes = Object.entries(mapPizzaType).map(([value, name]) => ({
  name,
  value,
}));

export type PizzaSize = keyof typeof mapPizzaSize;
export type PizzaType = keyof typeof mapPizzaType;
