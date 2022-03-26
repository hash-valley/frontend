import styled from "styled-components";
import { Page } from "../Styles/Components";

const Header = styled.h1`
  margin: 9rem 0 7rem 0;
  font-size: 3rem;
  font-family: FancyFont;
  text-align: center;
  user-select: none;
`;

const Container = styled.div`
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
    monospace;

  padding: 32px;
  width: 518px;
  margin: auto;
  user-select: none;

  border-radius: 13px;
  background: linear-gradient(145deg, #ffd5ff, #e6b3e1);
  box-shadow: 21px 21px 61px #d6a7d2, -21px -21px 61px #ffe7ff;
`;

const TwitterLink = styled.a`
    color: black;
`

const ComingSoon = () => {
  return (
    <Page>
      <Header>Hash Valley Winery</Header>

      <Container>
        <h2>idle vineyard</h2>
        <h2>first-of-its-kind revenue sharing</h2>
        <h2>nft buzzwords</h2>
        <h2><TwitterLink href="https://twitter.com/hash_valley">twitter</TwitterLink></h2>
        <h2 className="loading">mint event loading</h2>
      </Container>
    </Page>
  );
};

export default ComingSoon;
