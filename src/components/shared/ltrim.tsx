function lTrim(str: string) {
  if (str[0] === ' ') {
    return str.trim();
  }
  return str;
}

export default lTrim;
