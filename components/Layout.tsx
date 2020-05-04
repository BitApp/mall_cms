import Head from "next/head";
import "./layout.scss";

export default ({ children }) => {
  return (
    <div>
      <Head>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" rel="stylesheet" />
      </Head>
      <div>
        { children }
      </div>
    </div>
  );
};
