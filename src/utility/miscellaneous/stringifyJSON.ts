function stringifyJSON(json: object): string {
  return JSON.stringify(json, null, 2);
}

export default stringifyJSON;
