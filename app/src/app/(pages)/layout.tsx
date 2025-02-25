import Sidebar from "../component/SideBar/SideBar";
import TopBar from "../component/TopBar/TopBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full h-screen ">
      <div className="hidden lg:block lg:w-[15%] ">
        <Sidebar />
      </div>
      <div className="absolute right-1 lg:hidden">
        <Sidebar />
      </div>

      <div className="w-full lg:w-[85%] flex flex-col ">
        <TopBar />

        <div className="flex-1 overflow-y-auto px-3 lg:px-0 bg-[#ecf2fe]">
          {children}
        </div>
      </div>
    </div>
  );
}
