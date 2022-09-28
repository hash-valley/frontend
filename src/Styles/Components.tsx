import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import { Button, Select } from "antd";

export const RoundedImg = styled(Image)`
  border-radius: 4px;
`;

export const CenteredSelect = styled(Select)`
  display: inline-block;
  margin: 1.4rem;
  min-width: 12rem;
`;

export const TokenFrame = styled.iframe`
  width: 300px;
  height: 300px;
  margin-top: 12px;
  margin-bottom: 22px;
  background: #fff;

  border-radius: 12px;
  box-shadow: 19px 19px 38px #c4c4c4, -19px -19px 38px #ffffff;

  @media screen and (min-width: 350px) {
    width: 316px;
    height: 316px;
  }

  @media screen and (min-width: 550px) {
    width: 500px;
    height: 500px;
  }
`;

export const GreyLink = styled(Link)`
  cursor: pointer;
  opacity: 0.7;
  transition-duration: 0.2s;

  &:hover {
    opacity: 0.4;
    transition-duration: 0.2s;
  }
`;

export const Spaced = styled(Button)`
  &&& {
    margin: 16px;
  }
`;

export const BreakWords = styled.div`
  overflow-wrap: break-word;
`;

export const Page = styled.div<{ color?: string; shadow?: string }>`
  margin-top: 96px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 12px 60px 12px;
  font-family: Nunito;
  color: ${(props) => (props.color ? props.color : "black")};
  ${(props) =>
    props.shadow ? `filter: drop-shadow(2px 2px 3px ${props.shadow});` : ""}
`;

export const GridItem = styled.div<{ selected?: boolean }>`
  cursor: pointer;
  width: 20rem;
  padding: 1.6rem 0;
  border-radius: 19px;
  background: ${(props) =>
    props.selected ? "rgba(255,150,207,0.48)" : "#eee"};
  box-shadow: 5px 5px 10px #bebebe, -5px -5px 10px #ffffff;
  transition: all 200ms ease-out;

  &:hover {
    background: #f5f5f5;

    background: ${(props) =>
      props.selected ? "rgba(255,150,207,0.48)" : "#f5f5f5"};
    transform: translate(0, -4px);
    transition: all 200ms ease-out;

    box-shadow: 5px 9px 10px #bebebe, -5px -5px 10px #ffffff;
  }
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: auto auto auto;
  padding: 10px;
  justify-content: center;
  grid-column-gap: 64px;
  grid-row-gap: 24px;

  @media screen and (max-width: 1115px) {
    grid-template-columns: auto auto;
  }

  @media screen and (max-width: 766px) {
    grid-template-columns: auto;
  }
`;

export const SuccessText = styled.div`
  color: green;
  font-weight: 600;
`;

export const FailText = styled.div`
  color: red;
  font-weight: 600;
`;

export const InfoText = styled.div`
  color: blue;
  font-weight: 600;
`;

export const BigLink = styled.h2`
  cursor: pointer;
  text-decoration: underline;
  font-style: italic;
  transition: color 200ms ease-out;

  &:hover {
    color: #999;
    transition: color 200ms ease-out;
  }
`;

export const GreyBigLink = styled(BigLink)`
  font-weight: 320;
  font-size: 1.1rem;
`;

export const TokenSign = styled.div`
  margin: 16px 100px 12px 100px;
  padding: 16px 0px;

  border-radius: 12px;
  border: 1px solid lightgrey;
`;

export const TokenPage = styled(Page)`
  max-width: 600px;
  margin: 6rem auto 1.8rem auto;
`;

export const Flourish = styled.div`
  margin-top: -8rem;
  margin-bottom: 3rem;
`;

export const Header = styled.h1`
  margin: 10rem 4.2rem 7rem 4.2rem;
  font-size: 3.69rem;
  font-family: FancyFont;

  @media screen and (max-width: 600px) {
    font-size: 2.5rem;
  }
`;

export const SubHeader = styled.h1`
  font-size: 1.6rem;
  font-style: italic;

  @media screen and (min-width: 600px) {
    font-size: 2rem;
  }

  @media screen and (min-width: 876px) {
    font-size: 2.2rem;
  }
`;

export const Tag = styled.span<{ color: string; text?: string }>`
  background-color: ${(props) => props.color};
  color: ${(props) => (props.text ? props.text : "white")};
  border-radius: 12px;
  padding: 2px 10px;
  font-weight: bold;
`;

export const AlchemyBack = styled.div`
  background-color: black !important;
  background: url("/symbol_trace.svg");
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;

  position: absolute;
  height: 100%;
  width: 100%;

  top: 0; 
  z-index: -1;

  background-opacity: 10%;
`;

export const ListItem = styled.div`
  max-width: 500px;
  margin: auto;
`;
