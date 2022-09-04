import styled from "styled-components";
import { Page, Header, SubHeader } from "../Styles/Components";
import Image from "next/image";
import About from "../Components/About";
import Mint from "../Components/Mint";

const LeftCorner = styled.div`
  float: left;
  margin-top: -8rem;
  margin-right: -22rem;
  margin-left: auto;
  filter: drop-shadow(2px 2px #fff);
`;

const RightCorner = styled.div`
  float: right;
  margin-top: -12rem;
  filter: drop-shadow(2px 2px #fff);
`;

const HeadDiv = styled.div`
  max-width: 36rem;
  margin: auto;
  margin-top: -6rem;

  text-shadow: 2px 2px #fff;
`;

const Chevron = styled.div`
  position: absolute;
  top: 90%;
  left: calc(50% - 24px);
  visibility: visible;

  transform: translate3d(0, 0, 0);
  animation-name: bounce;
  animation-duration: 5s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;

  @keyframes bounce {
    0%,
    4%,
    10%,
    16%,
    20% {
      transform: translateY(0);
    }
    8% {
      transform: translateY(-12px);
    }
    12% {
      transform: translateY(-6px);
    }
  }
`;

const Hero = styled(Page)`
  margin-top: -16px;
  padding-top: 200px;
  background-image: url("landscape.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  height: 100vh;
`;

const Splash = () => {
  const handleClick = () => {
    window.scrollTo({
      top: window.visualViewport.height,
      behavior: "smooth",
    });
  };
  return (
    <>
      <Hero>
        <HeadDiv>
          <LeftCorner>
            <Image
              src="/vine_svgs/left_corner.svg"
              alt="corner"
              height={220}
              width={220}
            />
          </LeftCorner>
          <Header>Hash Valley</Header>
          <RightCorner>
            <Image
              src="/vine_svgs/right_corner.svg"
              alt="corner"
              height={160}
              width={160}
            />
          </RightCorner>
          <SubHeader>The on-chain winery franchise</SubHeader>
        </HeadDiv>
      </Hero>

      <Chevron onClick={handleClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="white"
          strokeWidth="2"
          width="48px"
          height="48px"
          opacity={0.75}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 13l-7 7-7-7m14-8l-7 7-7-7"
          />
        </svg>
      </Chevron>

      <Mint />
      <About />
    </>
  );
};

export default Splash;
