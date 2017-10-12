function handles({ url }) {
  return url.endsWith('.mp4') || url.endsWith('.gifv');
}

export default handles;
