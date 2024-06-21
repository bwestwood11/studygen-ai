import Sidebar from "@/app/dashboard/_components/Sidebar";
import React from "react";
import DashboardNavbar from "./_components/DashboardNavbar";
import MaxWidthContainer from "@/components/layout/max-width-container";
import { auth } from "@/auth";


const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth()
  return (
    <>
      <DashboardNavbar />
      <div className="flex">
        <Sidebar credits={session?.user.credits} />
        <main className="flex-1">
          <MaxWidthContainer>
            {children}
          </MaxWidthContainer>
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;
