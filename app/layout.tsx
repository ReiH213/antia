import "./globals.css";
import {
  Dawning_of_a_New_Day,
  La_Belle_Aurore,
  Homemade_Apple,
} from "next/font/google";
const metadata = {
  title: "Wedding – M & A",
  description: "A meticulously recreated wedding invite experience",
};

export const homemade = Homemade_Apple({ subsets: ["latin"], weight: "400" });

export const fonts = {
  homemade: homemade.className,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fonts.homemade}`}>
      <body className="bg-ivory text-stone-800 antialiased selection:bg-stone-800 selection:text-ivory">
        {children}
      </body>
    </html>
  );
}
