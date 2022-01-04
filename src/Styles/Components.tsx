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
`;

export const GreyLink = styled(Link)`
  cursor: pointer;
  opacity: 0.7;
  text-decoration: underline;

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
`;

export const GridItem = styled.div`
  cursor: pointer;
  padding: 12px;
  margin: 16px;
  border-radius: 19px;
  background: #eeeeee;
  box-shadow: 5px 5px 10px #bebebe, -5px -5px 10px #ffffff;

  &:hover {
    background: #f7f7f7;
    transform: translate(0, -4px);
    transition-duration: 0.2s;
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

  &:hover {
    color: #999;
    transition-duration: 0.2s;
  }
`