import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;
    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhaceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);

      return {
        ...initialProps,
        locale: ctx.locale,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <link rel="preload" href="/fancy-font.ttf" as="font" crossOrigin="" />
          <link
            rel="preload"
            href="/NunitoSans-Regular.ttf"
            as="font"
            crossOrigin=""
          />
          <meta name="theme-color" content="#000000" />
          <meta name="description" content="Cultivate fine wines on Ethereum" />
          <meta property="og:title" content="Hash Valley" />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="/landscape.png" />
          <meta property="og:url" content="https://www.hashvalley.xyz" />
          <link rel="apple-touch-icon" href="/logo192.png" />
          <link rel="manifest" href="/manifest.json" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
