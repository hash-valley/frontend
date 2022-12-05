import styled from "styled-components";
import { Page } from "../Styles/Components";

const Header = styled.h1`
  margin: 9rem auto 7rem auto;
  font-size: 3rem;
  font-family: FancyFont;
  text-align: center;
  user-select: none;
  padding: 22px;
  max-width: 600px;

  background: linear-gradient(to right, purple, red);
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;

  animation: vint2 2.6s infinite;
`;

const Container = styled.div`
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
    monospace;

  padding: 32px;
  max-width: 518px;
  margin: -64px auto auto auto;
  user-select: none;

  border-radius: 13px;
  background: linear-gradient(145deg, #ffd5ff, #e6b3e1);
  box-shadow: 21px 21px 61px #d6a7d2, -21px -21px 61px #ffe7ff;
`;

const SocialLink = styled.a`
  color: black;
`;

const HText1 = styled.span`
  background: linear-gradient(to right, orange, red);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const HText2 = styled.span`
  background: linear-gradient(to right, #1da93a, #a4d43a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const HText3 = styled.span`
  background: linear-gradient(to right, #e01948, #c04edd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const HText4 = styled.span`
  background: linear-gradient(to right, #53c8b6, #367bc8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ComingSoon = () => {
  return (
    <Page>
      <Header>Hash Valley Winery</Header>

      <Container>
        <h2>
          on-chain <HText2>pvp/co-op</HText2> gameplay
        </h2>
        <h2>
          first-of-its-kind <HText1>revenue sharing</HText1>
        </h2>
        <h2>
          dynamic <HText3>interactive</HText3> digital art
        </h2>
        <h2>
          retroactive <HText4>public goods funding</HText4>
        </h2>

        <h2>
          <SocialLink href="https://twitter.com/hash_valley">
            &#10140; twitter
          </SocialLink>
        </h2>
        <h2>
          <SocialLink href="https://discord.gg/7MRymWsVhr">
            &#10140; discord
          </SocialLink>
        </h2>

        <h2 className="loading">mint event loading</h2>
      </Container>
    </Page>
  );
};

export default ComingSoon;
