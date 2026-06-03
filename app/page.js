import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Works } from "@/components/sections/Works";
import { Projects } from "@/components/sections/Projects";
import { Demos } from "@/components/sections/Demos";
import { Achievements } from "@/components/sections/Achievements";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Skills />
        <Works />
        <Projects />
        <Demos />
        <Achievements />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
