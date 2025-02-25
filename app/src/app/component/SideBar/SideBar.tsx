"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Layout,
  GraduationCap,
  Users,
  ClipboardX,
  Bookmark,
  MessageSquare,
  BarChart,
  Calendar,
  BookOpen,
  Coins,
  Settings,
  Shield,
  ChevronDown,
  ChevronRight,
  Menu,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/app/component/ui/sheet";
import { usePathname } from "next/navigation";
import Loading from "@/app/loading";

interface SubmenuItem {
  title: string;
  link: string;
}

interface MenuItem {
  title: string;
  icon: string;
  badge?: string;
  link?: string;
  submenu?: SubmenuItem[];
}

interface SidebarConfig {
  menuItems: any;
  logoUrl: string;
  logoAlt: string;
  theme?: {
    backgroundColor: string;
    textColor: string;
    activeItemBg: string;
    activeItemColor: string;
    hoverBg: string;
    badgeBg: string;
    badgeColor: string;
  };
}

interface SidebarMenuItemProps {
  item: MenuItem;
  isOpen: boolean;
  onToggle: (menuItem: string) => void;
  isActive?: boolean;
  theme?: SidebarConfig["theme"];
}

const IconComponent = ({
  name,
  className = "w-5 h-5",
}: {
  name: string;
  className?: string;
}) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    Layout: <Layout className={className} />,
    GraduationCap: <GraduationCap className={className} />,
    Users: <Users className={className} />,
    ClipboardX: <ClipboardX className={className} />,
    Bookmark: <Bookmark className={className} />,
    MessageSquare: <MessageSquare className={className} />,
    BarChart: <BarChart className={className} />,
    Calendar: <Calendar className={className} />,
    BookOpen: <BookOpen className={className} />,
    Coins: <Coins className={className} />,
    Settings: <Settings className={className} />,
    Shield: <Shield className={className} />,
    Menu: <Menu className={className} />,
    ChevronDown: <ChevronDown className={className} />,
    ChevronRight: <ChevronRight className={className} />,
  };

  return <>{iconMap[name] || <div className={className} />}</>;
};

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  item,
  isOpen,
  onToggle,
  isActive = false,
  theme,
}) => {
  const defaultTheme = {
    backgroundColor: "bg-white",
    textColor: "text-gray-700",
    activeItemBg: "bg-blue-50",
    activeItemColor: "text-blue-600",
    hoverBg: "hover:bg-gray-50",
    badgeBg: "bg-blue-100",
    badgeColor: "text-blue-800",
  };

  const t = theme || defaultTheme;

  if (item.submenu) {
    return (
      <div className="mb-1">
        <button
          onClick={() => onToggle(item.title)}
          className={`w-full flex items-center justify-between p-2 rounded-lg ${
            isActive ? t.activeItemBg : ""
          } ${t.hoverBg} ${isActive ? t.activeItemColor : t.textColor}`}
        >
          <span className="flex items-center gap-3">
            <IconComponent name={item.icon} />
            <span>{item.title}</span>
          </span>
          <span className="flex items-center">
            {item.badge && (
              <span
                className={`${t.badgeBg} ${t.badgeColor} text-xs px-2 py-1 rounded-full mr-2`}
              >
                {item.badge}
              </span>
            )}
            <IconComponent
              name={isOpen ? "ChevronDown" : "ChevronRight"}
              className="w-4 h-4"
            />
          </span>
        </button>
        {isOpen && (
          <ul className="ml-8 mt-2 space-y-1">
            {item.submenu.map((subItem, subIndex) => (
              <li key={subIndex}>
                <a
                  href={subItem.link}
                  className={`block p-2 text-sm ${t.textColor} hover:${t.activeItemColor} rounded-lg`}
                >
                  {subItem.title}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <a
      href={item.link}
      className={`flex items-center justify-between p-2 rounded-lg ${
        isActive ? t.activeItemBg : ""
      } ${t.hoverBg} ${isActive ? t.activeItemColor : t.textColor}`}
    >
      <span className="flex items-center gap-3">
        <IconComponent name={item.icon} />
        <span>{item.title}</span>
      </span>
      {item.badge && (
        <span
          className={`${t.badgeBg} ${t.badgeColor} text-xs px-2 py-1 rounded-full`}
        >
          {item.badge}
        </span>
      )}
    </a>
  );
};

// The main Sidebar component
const Sidebar: React.FC<{
  configUrl?: string;
  initialConfig?: SidebarConfig;
  currentPath?: string;
}> = ({
  configUrl = "/api/sidebar-config",
  initialConfig,
  currentPath = "",
}) => {
  const pathname = usePathname();
  currentPath = pathname;
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [config, setConfig] = useState<SidebarConfig>(
    initialConfig || {
      menuItems: [],
      logoUrl: "/assets/images/logo/logo.jpg",
      logoAlt: "Logo",
      theme: {
        backgroundColor: "bg-white",
        textColor: "text-gray-700",
        activeItemBg: "bg-blue-50",
        activeItemColor: "text-blue-600",
        hoverBg: "hover:bg-gray-50",
        badgeBg: "bg-blue-100",
        badgeColor: "text-blue-800",
      },
    }
  );
  const [loading, setLoading] = useState(!initialConfig);

  // Check if a menu item or its submenu contains the current path
  const isActiveItem = (item: MenuItem): boolean => {
    if (item.link === currentPath) return true;
    if (item.submenu) {
      return item.submenu.some((sub) => sub.link === currentPath);
    }
    return false;
  };

  // Automatically open menus containing active items
  useEffect(() => {
    const newOpenMenus: { [key: string]: boolean } = {};
    config.menuItems.forEach((item) => {
      if (
        item.submenu &&
        item.submenu.some((sub) => sub.link === currentPath)
      ) {
        newOpenMenus[item.title] = true;
      }
    });
    setOpenMenus((prev) => ({ ...prev, ...newOpenMenus }));
  }, [config.menuItems, currentPath]);
  const prevDataRef = useRef(null);
  useEffect(() => {
    const storedData = localStorage.getItem("userMenu");

    // Skip processing if stored data hasn't changed
    if (storedData === prevDataRef.current) {
      setLoading(false);
      return;
    }

    // Update the ref with current localStorage value
    prevDataRef.current = storedData;

    if (storedData) {
      try {
        const parsedData: MenuItem[] = JSON.parse(storedData);
        setConfig((prevConfig) => ({
          ...prevConfig,
          menuItems: parsedData,
        }));
      } catch (error) {
        console.error("Failed to parse menu data:", error);
      }
    }

    setLoading(false);
  }, []);
  const toggleSubmenu = (menuItem: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuItem]: !prev[menuItem],
    }));
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger className="lg:hidden p-2 rounded-md bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none">
          <IconComponent name="Menu" />
        </SheetTrigger>
        <SheetContent
          side="left"
          className={`w-64 p-0 ${config.theme?.backgroundColor || "bg-white"}`}
        >
          <div className="p-5 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <svg
                width="200"
                height="50"
                viewBox="0 0 200 50"
                xmlns="http://www.w3.org/2000/svg"
              >
                <text
                  x="10"
                  y="35"
                  font-family="Arial, sans-serif"
                  font-size="30"
                  fill="blue"
                  font-weight="bold"
                >
                  TeachEase
                </text>
              </svg>
            </div>
          </div>
          <nav className="p-4">
            <ul className="space-y-1">
              {config.menuItems.map((item, index) => (
                <li key={index}>
                  <SidebarMenuItem
                    item={item}
                    isOpen={openMenus[item.title] || false}
                    onToggle={toggleSubmenu}
                    isActive={isActiveItem(item)}
                    theme={config.theme}
                  />
                </li>
              ))}
            </ul>
          </nav>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:flex flex-col h-screen ${
          config.theme?.backgroundColor || "bg-white"
        } border-r border-gray-200`}
      >
        <div className="p-5 border-b border-gray-200">
          <svg
            width="200"
            height="50"
            viewBox="0 0 200 50"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text
              x="10"
              y="35"
              font-family="Arial, sans-serif"
              font-size="30"
              fill="blue"
              font-weight="bold"
            >
              TeachEase
            </text>
          </svg>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {config.menuItems.map((item, index) => (
              <li key={index}>
                <SidebarMenuItem
                  item={item}
                  isOpen={openMenus[item.title] || false}
                  onToggle={toggleSubmenu}
                  isActive={isActiveItem(item)}
                  theme={config.theme}
                />
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 p-2">
            <IconComponent name="Shield" />
            <span className={config.theme?.textColor || "text-gray-700"}>
              TeachEase Portal
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
