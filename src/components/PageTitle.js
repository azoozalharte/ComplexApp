import { useEffect } from "react";
import Container from "./Container";

export default function PageTitle({ children, wide, title }) {
  useEffect(() => {
    document.title = ` ${title} | ComplexApp`;
    window.scrollTo(0, 0);
  });
  return <Container wide={wide}> {children} </Container>;
}
