import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders h1 with text User List Application", () => {
  render(<App />);
  const h1Element = screen.getByText(/User List Application/i);
  expect(h1Element).toBeInTheDocument();
});
