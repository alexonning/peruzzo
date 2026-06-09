import { Header } from "@/components/loja/Header";
import { Footer } from "@/components/loja/Footer";

export default function LojaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
