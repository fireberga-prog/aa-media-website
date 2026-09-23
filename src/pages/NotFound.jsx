import usePageTitle from "../hooks/usePageTitle.js";
import Container from "../components/Container.jsx";
import Button from "../components/Button.jsx";
import SectionHeading from "../components/SectionHeading.jsx";

export default function NotFound() {
  usePageTitle("Page not found", "This page doesn't exist.");
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <SectionHeading as="h1" bold="Page not" serif="found." size="xl" align="center" />
      <p className="mt-6 text-lg text-ink/70">This page doesn't exist or has moved.</p>
      <div className="mt-10">
        <Button to="/">Back home</Button>
      </div>
    </Container>
  );
}
