import numeral from 'numeral';

function format(n) {
  return (n > 1000 ? '0.0a' : '0a');
}

function getRGBComponents(color) {
  const r = color.substring(1, 3);
  const g = color.substring(3, 5);
  const b = color.substring(5, 7);

  return {
    R: parseInt(r, 16),
    G: parseInt(g, 16),
    B: parseInt(b, 16),
  };
}

export default {
  DEFAULT_COLOR: '#c0392b',
  formatNumber(n) {
    return numeral(n).format(format(n)).toUpperCase();
  },
  getTextColor(bgColor) {
    if (!bgColor) {
      return '#000000';
    }
    const nThreshold = 105;
    const components = getRGBComponents(bgColor);
    const bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);

    return ((255 - bgDelta) < nThreshold) ? '#000000' : '#ffffff';
  },
  mod(n, m) {
    return ((n % m) + m) % m;
  },
};
