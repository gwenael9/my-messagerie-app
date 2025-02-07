import Head from "next/head";
import { ReactNode } from "react";
import Header from "./Header";
import { Toaster } from "../ui/toaster";
import BreadcrumbMessage from "../BreadCrumb";

interface LayoutProps {
  children: ReactNode;
  title: string;
}

export default function Layout({ children, title }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="flex flex-col h-screen">
        <Header />
        <main className="flex-grow px-8 overflow-y-auto">
          <BreadcrumbMessage />
          {children}
        </main>
      </div>
      <Toaster />
    </>
  );
}
