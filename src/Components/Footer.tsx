import Image from "next/image";
import { useRouter } from "next/router";
import styled from "styled-components";
import { chainId, VineyardAddress } from "../Utils/constants";

const FooterContainer = styled.div`
  text-align: center;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 70px;
  padding: 10px 0 0 0;
`;

const FooterLink = styled.a`
  margin-right: 12px;
  margin-left: 12px;
  @media screen and (min-width: 475px) {
    margin-right: 24px;
    margin-left: 24px;
  }
  opacity: 0.35;
  transition: opacity 200ms ease-out;

  &:hover {
    opacity: 0.6;
    transition: opacity 200ms ease-out;
  }
`;

const Footer = () => {
  const router = useRouter();
  const darkMode = router.route === "/alchemy";

  return (
    <FooterContainer>
      <FooterLink href="https://twitter.com/hash_valley" target="_blank">
        <Image
          src={`/twitter${darkMode ? "_dark" : ""}.svg`}
          alt="twitter"
          height={24}
          width={24}
        />
      </FooterLink>
      <FooterLink href="https://discord.gg/7MRymWsVhr" target="_blank">
        <Image
          src={`/discord${darkMode ? "_dark" : ""}.svg`}
          alt="discord"
          height={24}
          width={24}
        />
      </FooterLink>
      <FooterLink
        href={
          process.env.NEXT_PUBLIC_CHAIN_ID === "420"
            ? `https://testnet.qx.app/collection/${VineyardAddress}`
            : `https://qx.app/collection/${VineyardAddress}`
        }
        target="_blank"
      >
        <Image src={`/qx${darkMode ? "_dark" : ""}.svg`} alt="quixotic" height={24} width={24} />
      </FooterLink>
      <FooterLink
        href={
          chainId === 10
            ? `https://optimistic.etherscan.io/token/${VineyardAddress}`
            : `https://goerli-optimistic.etherscan.io/token/${VineyardAddress}`
        }
        target="_blank"
      >
        <Image
          src={`/etherscan${darkMode ? "_dark" : ""}.svg`}
          alt="etherscan"
          height={24}
          width={24}
        />
      </FooterLink>
      <FooterLink href="https://github.com/hash-valley" target="_blank">
        <Image src={`/github${darkMode ? "_dark" : ""}.svg`} alt="github" height={24} width={24} />
      </FooterLink>
      <FooterLink href="https://inathan-m.gitbook.io/hash-valley-winery/" target="_blank">
        <Image src={`/docs${darkMode ? "_dark" : ""}.svg`} alt="docs" height={24} width={24} />
      </FooterLink>
    </FooterContainer>
  );
};

export default Footer;
