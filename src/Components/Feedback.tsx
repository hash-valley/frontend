import styled from "styled-components";

const Circle = styled.div`
  position: fixed;
  bottom: 68px;
  right: 22px;
  width: 52px;
  height: 52px;
  border-radius: 48px;
  background-color: #6abbd8;
  padding: 8px;

  box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.32);

  transition: all 150ms ease-out;

  &:hover {
    transform: translate(0px, -3px);
    transition: all 150ms ease-out;
    box-shadow: 0px 10px 26px 0px rgba(0, 0, 0, 0.32);
  }
`;

const Feedback = () => (
  <Circle>
    <a href="https://forms.gle/XcvChnFL5waNHviP8" target="_blank" rel="noreferrer">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="white"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3"
        />
      </svg>
    </a>
  </Circle>
);

export default Feedback;
