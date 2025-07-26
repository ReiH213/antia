import {
  Dawning_of_a_New_Day,
  Homemade_Apple,
  Imperial_Script,
  Pacifico,
} from "next/font/google";

export const homemade = Homemade_Apple({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-homemade",
});

export const day = Dawning_of_a_New_Day({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-day",
});

export const imperial = Imperial_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-day",
});

export const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-day",
});
