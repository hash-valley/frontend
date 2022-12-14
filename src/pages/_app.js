import "../../public/index.css";
import "@rainbow-me/rainbowkit/styles.css";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/antd.css";

import "../css/variables.less";

import { ApolloProvider } from "@apollo/client";
import Head from "next/head";
import styled from "styled-components";
import { ToastContainer } from "react-toastify";
import { WagmiConfig } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

import Account from "../Components/Account";
import Footer from "../Components/Footer";

import { chains, wagmiClient } from "../Utils/rainbowWallet";
import { apolloClient } from "../Utils/apollo";
import { chainId } from "../Utils/constants";
import Feedback from "../Components/Feedback";

import React, { useEffect } from "react";
import { ModalProvider } from "../Hooks/ModalProvider";
import PendingModal from "../Components/PendingModal";

import ComingSoon from "../Components/ComingSoon";

const AppContainer = styled.div`
  text-align: center;
  min-height: calc(100vh - 70px);
  margin-top: -10px;
`;

function MyApp({ Component, pageProps }) {
  var red = 215;
  var reverse = false;

  useEffect(() => {
    window.addEventListener(
      "mousemove",
      function (e) {
        // falling trail
        [1, 0.9, 0.8, 0.5, 0.25, 0.6, 0.3, 0.2].forEach(function (i) {
          var j = (1 - i) * 50;
          var elem = document.createElement("div");
          var size = Math.ceil(Math.random() * 10 * i) + "px";
          elem.style.position = "fixed";
          elem.style.zIndex = 6;
          elem.style.top = e.pageY - window.scrollY + Math.round(Math.random() * j - j / 2) + "px";
          elem.style.left = e.pageX + Math.round(Math.random() * j - j / 2) + "px";
          elem.style.width = size;
          elem.style.height = size;
          elem.style.animation = "fallingsparkles 1s";
          elem.style.background = `rgb(${red}, 46, 129)`;
          elem.style.borderRadius = size;
          elem.style.pointerEvents = "none";
          document.body.appendChild(elem);

          if (reverse) {
            if (red > 216) {
              reverse = false;
            } else {
              red += 0.2;
            }
          } else {
            if (red < 100) {
              reverse = true;
            } else {
              red -= 0.2;
            }
          }

          window.setTimeout(function () {
            document.body.removeChild(elem);
          }, Math.round(Math.random() * i * 1000));
        });
      },
      false
    );
  }, []);

  if (process.env.NEXT_PUBLIC_PREVIEW_MODE === "true") {
    return (
      <>
        <Head>
          <title>Hash Valley Winery</title>
        </Head>
        <ComingSoon />
      </>
    );
  }

  return (
    <ApolloProvider client={apolloClient}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider
          chains={chains}
          showRecentTransactions={true}
          appInfo={{
            appName: "Hash Valley Winery",
            learnMoreUrl: "https://www.hashvalley.xyz/about",
          }}
        >
          <ModalProvider>
            <AppContainer>
              <Head>
                <title>Hash Valley Winery</title>
              </Head>
              <Account />
              <Component {...pageProps} />
              <ToastContainer position="bottom-right" />
              {chainId !== 10 && <Feedback />}
              <PendingModal />
            </AppContainer>
          </ModalProvider>

          <Footer />
        </RainbowKitProvider>
      </WagmiConfig>
    </ApolloProvider>
  );
}

export default MyApp;
