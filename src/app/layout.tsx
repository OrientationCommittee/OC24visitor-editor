import "/src/app/styles/globals.css";
import "/src/app/styles/globals.scss";
import { TypekitLoader } from "./utils/TypekitLoader";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <TypekitLoader />
      <body>
        <Header />
        <div className="px-10 py-2">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
