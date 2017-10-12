function handles({ domain }) {
  return domain.endsWith('youtube.com') || domain === 'youtu.be';
}

export default handles;
