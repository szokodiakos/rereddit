function handles({ url, domain }) {
  return (
    !url.endsWith('.gifv') &&
    (
      url.startsWith('https://imgur.com/a/') ||
      url.endsWith('.png') ||
      url.endsWith('.jpg') ||
      url.endsWith('.gif') ||
      domain.endsWith('imgur.com')
    )
  );
}

export default handles;
