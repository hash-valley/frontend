import { Timeline } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import React from "react";
import styled from "styled-components";

interface Item {
  text: string;
  complete: boolean;
}

interface Props {
  items: Item[];
}

const LargerText = styled.div`
  margin: 0 2.6rem;
  li {
    font-size: 18px;
  }
`;

const Roadmap: React.FC<Props> = ({ items }) => {
  return (
    <LargerText>
      <Timeline mode="alternate">
        {items.map((item: Item, index: number) =>
          item.complete ? (
            <Timeline.Item color="green" key={index}>
              {item.text}
            </Timeline.Item>
          ) : (
            <Timeline.Item dot={<ClockCircleOutlined style={{ fontSize: "18px" }} />} key={index}>
              {item.text}
            </Timeline.Item>
          )
        )}
      </Timeline>
    </LargerText>
  );
};

export default Roadmap;
