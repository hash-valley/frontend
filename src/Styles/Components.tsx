import styled from "styled-components";
import Link from "next/link";
import { Button, Select } from "antd";

export const CenteredSelect = styled(Select)`
  display: inline-block;
  margin: 1.4rem;
  min-width: 12rem;
`;

export const TokenFrame = styled.iframe`
  width: 400px;
  height: 400px;
  padding: 8px;
  margin-top: 12px;
  margin-bottom: 12px;

  border-radius: 12px;
  box-shadow: 15px 15px 30px #d9d9d9, -15px -15px 30px #ffffff;
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
    margin: 32px 16px;
  }
`;

export const Page = styled.div`
  margin-top: 96px;
  margin-left: 10%;
  margin-right: 10%;
  padding-bottom: 60px;
  font-family: Nunito;
`;

export const GridItem = styled.div`
  cursor: pointer;
  padding: 12px;
  margin: 16px;
  border-radius: 19px;
  background: #eeeeee;
  box-shadow: 5px 5px 10px #bebebe, -5px -5px 10px #ffffff;
  transition: all 200ms ease-out;

  &:hover {
    background: #f7f7f7;
    transform: translate(0, -4px);
    transition: all 200ms ease-out;
  }
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: auto auto auto;
  padding: 10px;

  @media screen and (max-width: 964px) {
    grid-template-columns: auto auto;
  }

  @media screen and (max-width: 652px) {
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
