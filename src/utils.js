import numeral from 'numeral';

const format = n => (n > 1000 ? '0.0a' : '0a');

export default {
  formatNumber(n) {
    return numeral(n).format(format(n)).toUpperCase();
  },
};
