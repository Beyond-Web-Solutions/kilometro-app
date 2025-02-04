// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ["expo", "prettier"],
  ignorePatterns: ["/dist/*"],
  plugins: ["prettier", "eslint-plugin-react-compiler"],
  rules: {
    "prettier/prettier": "error",
    "react-compiler/react-compiler": "error",
  },
};
