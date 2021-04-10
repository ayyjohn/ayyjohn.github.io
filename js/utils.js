const isLowerCase = (string) => {
  return string != string.toUpperCase() && string == string.toLowerCase();
};

module.exports = {
  isLowerCase,
};
