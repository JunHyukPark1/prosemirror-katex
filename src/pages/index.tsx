import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Editor from "@/component/Editor";
import "@benrbray/prosemirror-math/dist/prosemirror-math.css";
import "katex/dist/katex.min.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <>
      <div
        className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}
        id="root"
      >
        <main className={styles.main}>
          <Editor />
        </main>
      </div>
    </>
  );
}
