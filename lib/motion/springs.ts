export const springs = {
  default: { type: 'spring', stiffness: 300, damping: 30 },
  gentle:  { type: 'spring', stiffness: 200, damping: 25 },
  snappy:  { type: 'spring', stiffness: 400, damping: 35 },
} as const;

export const durations = {
  fast:    0.15,
  normal:  0.3,
  slow:    0.5,
} as const;
