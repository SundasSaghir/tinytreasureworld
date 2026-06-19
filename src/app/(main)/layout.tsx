import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="flex-1" style={{ backgroundColor: '#faf9f5' }}>{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
