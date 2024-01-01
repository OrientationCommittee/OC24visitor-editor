import '/src/app/styles/globals.css'
import '/src/app/styles/globals.scss'
import Header from './components/Header';
import Footer from './components/Footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <Header />
        <div className="px-10 py-2">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}
