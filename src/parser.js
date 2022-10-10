export const parseData = (data) => {
  const domParser = new DOMParser();
  const parsedDocument = domParser.parseFromString(data, 'text/xml');

  return parsedDocument;
};
