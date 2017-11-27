function handles({ url, domain }) {
  return url.endsWith('.mp4') || url.endsWith('.gifv') || domain === 'v.redd.it';
}

export default handles;
