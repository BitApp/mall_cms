/*
  Do not copy/paste this file. It is used internally
  to manage end-to-end test suites.
*/

import NextI18Next from "next-i18next";

const nextI18NextInstance = new NextI18Next({
  defaultLanguage: "cn",
  otherLanguages: ["en"],
});

// export default NextI18NextInstance

/* Optionally, export class methods as named exports */
export const {
  appWithTranslation,
  withTranslation,
  initPromise,
  Link,
  i18n,
  useTranslation,
} = nextI18NextInstance;

export default nextI18NextInstance;
