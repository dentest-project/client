export const blackOrWhite = (color: string): string => {
  const luminance = (0.299 * parseInt(color.slice(1, 3), 16) + 0.587 * parseInt(color.slice(3, 5), 16) + 0.114 * parseInt(color.slice(5, 7), 16))/255;

  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}
