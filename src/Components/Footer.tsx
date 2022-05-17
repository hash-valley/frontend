import Image from "next/image";
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
  return (
    <FooterContainer>
      <FooterLink href="https://twitter.com/hash_valley" target="_blank">
        <Image src="/twitter.svg" alt="twitter" height={24} width={24} />
      </FooterLink>
      <FooterLink href="https://discord.gg/8E4ZVguE" target="_blank">
        <Image src="/discord.svg" alt="discord" height={24} width={24} />
      </FooterLink>
      <FooterLink
        href={
          process.env.NEXT_PUBLIC_CHAIN_ID === "69"
            ? `https://testnet.quixotic.io/collection/${VineyardAddress}`
            : `https://quixotic.io/collection/${VineyardAddress}`
        }
        target="_blank"
      >
        <Image src="/quixotic.svg" alt="quixotic" height={24} width={24} />
      </FooterLink>
      <FooterLink
        href={
          chainId === 10
            ? `https://optimistic.etherscan.io/token/${VineyardAddress}`
            : `https://kovan-optimistic.etherscan.io/token/${VineyardAddress}`
        }
        target="_blank"
      >
        <Image src="/etherscan.svg" alt="etherscan" height={24} width={24} />
      </FooterLink>
      <FooterLink href="https://github.com/hash-valley" target="_blank">
        <Image src="/github.svg" alt="github" height={24} width={24} />
      </FooterLink>
      <FooterLink
        href="https://inathan-m.gitbook.io/hash-valley-winery/"
        target="_blank"
      >
        <Image src="/docs.svg" alt="docs" height={24} width={24} />
      </FooterLink>
    </FooterContainer>
  );
};

export default Footer;
