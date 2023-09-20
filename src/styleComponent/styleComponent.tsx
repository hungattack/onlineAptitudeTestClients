import styled from "styled-components";

export const Div = styled.div<{
  width?: string;
  display?: string;
  align?: string;
  justify?: string;
  css?: string;
  wrap?: string;
}>`
  width: ${(props) => props.width || "100%"};
  display: ${(props) => props.display || "flex"};
  align-items: ${(props) => props.align || "center"};
  justify-content: ${(props) => props.justify || "center"};
  flex-wrap: ${(props) => props.wrap};
  ${(props) => props.css};
`;
export const P = styled.p<{ size?: string; css?: string }>`
  font-size: ${(props) => props.size};
  color: ${(props) => props.color};
  ${(props) => props.css};
`;
export const H3 = styled.h3<{ size?: string; css?: string }>`
  font-size: ${(props) => props.size};
  color: ${(props) => props.color};
  ${(props) => props.css};
`;
export const Input = styled.input<{ css?: string }>`
  color: ${(props) => props.color};
  ${(props) => props.css};
`;
