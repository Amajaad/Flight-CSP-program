export const getDynamicColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const goldenRatio = 0.618033988749895;
  const h = Math.abs((hash * goldenRatio * 360) % 360);

  return `hsl(${h}, 70%, 45%)`;
};