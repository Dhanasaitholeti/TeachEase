import { Card, CardContent } from "@/app/component/ui/card";
import { cn } from "@/lib/utils";
import { IoBookSharp } from "react-icons/io5";
import { GrCertificate } from "react-icons/gr";
import { RiGraduationCapFill } from "react-icons/ri";
import { SlPeople } from "react-icons/sl";
import { useEffect, useState } from "react";
import { getAdminDashboard } from "@/service/class";
import Loading from "@/app/loading";

const statsConfig = [
  {
    key: "totalStudents",
    label: "Total Students",
    icon: <IoBookSharp size={24} />,
    bg: "bg-[#3E80F9]",
  },
  {
    key: "totalPresentees",
    label: "Students Present Today",
    icon: <GrCertificate size={24} />,
    bg: "bg-[#27CEA7]",
  },
  {
    key: "totalClasses",
    label: "Total Classes",
    icon: <RiGraduationCapFill size={24} />,
    bg: "bg-purple-600",
  },
  {
    key: "totalTeachers",
    label: "Total Teachers",
    icon: <SlPeople size={24} />,
    bg: "bg-[#FF9F43]",
  },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminDashboard();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading dashboard data</div>;
  }

  return (
    <div className="py-3 flex-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full lg:max-w-screen">
        {statsConfig.map((stat, index) => (
          <Card key={index} className="shadow-md w-full mx-auto">
            <CardContent className="p-6">
              <h4 className="mb-2 text-xl font-semibold">{stats[stat.key]}</h4>
              <span className="text-gray-600">{stat.label}</span>
              <div className="flex justify-between items-center gap-4 mt-4">
                <span
                  className={cn(
                    "w-12 h-12 flex items-center justify-center rounded-full text-white text-2xl",
                    stat.bg
                  )}
                >
                  {stat.icon}
                </span>
                <div
                  id={stat.label.toLowerCase().replace(/\s/g, "-")}
                  className="rounded-tooltip-value"
                ></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
