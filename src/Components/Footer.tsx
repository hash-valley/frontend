import Image from "next/image";
import styled from "styled-components";

const FooterContainer = styled.div`
  text-align: center;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 70px;
  padding: 10px 0 0 0;
`;

const FooterLink = styled.a`
  margin-right: 24px;
  margin-left: 24px;
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
      <FooterLink href="https://twitter.com/hash_valley" target={"_blank"}>
        <Image src="/twitter.svg" height={24} width={24} />
      </FooterLink>
      <FooterLink href="https://www.discord.com" target={"_blank"}>
        <Image src="/discord.svg" height={24} width={24} />
      </FooterLink>
      <FooterLink href="https://opensea.io" target={"_blank"}>
        <Image src="/opensea.svg" height={24} width={24} />
      </FooterLink>
      <FooterLink
        href="https://etherscan.io/token/0xd6327ce1fb9d6020e8c2c0e124a1ec23dcab7536"
        target={"_blank"}
      >
        <Image src="/etherscan.svg" height={24} width={24} />
      </FooterLink>
      <FooterLink href="https://github.com/hash-valley" target={"_blank"}>
        <Image src="/github.svg" height={24} width={24} />
      </FooterLink>
      <FooterLink
        href="https://inathan-m.gitbook.io/hash-valley-winery/"
        target={"_blank"}
      >
        <Image src="/docs.svg" height={24} width={24} />
      </FooterLink>
    </FooterContainer>
  );
};

export default Footer;
