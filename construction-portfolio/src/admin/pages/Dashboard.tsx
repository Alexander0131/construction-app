import React, { useEffect, useState } from "react";
import {
  FaArrowTrendUp,
  FaEye,
  FaMessage,
  FaPenToSquare,
} from "react-icons/fa6";
import { Link } from "react-router-dom";

import DashPosts from "../components/DashPosts";
import { countAllPost, getAllViewsData } from "../../service/api";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
}

function StatsCard({
  title,
  value,
  subtitle,
  icon,
}: StatsCardProps): React.ReactElement {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            {value}
          </h2>
        </div>

        <div className="rounded-xl bg-slate-100 p-3 text-xl text-slate-700">
          {icon}
        </div>
      </div>

      <p className="mt-4 text-sm text-green-600">
        {subtitle}
      </p>
    </div>
  );
}

export default function Dashboard(): React.ReactElement {
  const [getAllPostNo, setGetAllPostNo] = useState<number>(0);
  const [getPostingRate, setPostingRate] = useState<string>("0");
  const [getTotalViews, setGetTotalViews] = useState<number>(0);
  useEffect(() => {
    async function loadConfigs(){
      // count posts amounts
      const getPostCount = await countAllPost();
      setGetAllPostNo(getPostCount.totalPosts);
      setPostingRate(getPostCount.growthPercentage);

      // get views count
    const getViewsCount = await getAllViewsData();
    const totalViews = getViewsCount.reduce(
      (sum, view) => sum + view.visitcount, 0);
    setGetTotalViews(totalViews);

    }
    loadConfigs();
  }, [])

const statsData: StatsCardProps[] = [
    {
      title: "Total Posts",
      value: String(getAllPostNo),
      subtitle: `+${getPostingRate}% this month`,
      icon: <FaPenToSquare />,
    },
    {
      title: "Total Views",
      value: String(getTotalViews),
      subtitle: "",
      icon: <FaEye />,
    },
    {
      title: "Comments",
      value: "842",
      subtitle: "+8% engagement",
      icon: <FaMessage />,
    },
    {
      title: "Growth Rate",
      value: "76%",
      subtitle: "Performing well",
      icon: <FaArrowTrendUp />,
    },
  ];




  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-6">
      {/* HERO SECTION */}
      <section className="mb-6 flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-700 p-6 text-white shadow-lg md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Dashboard Overview
          </h1>

          <p className="mt-2 text-sm text-slate-300">
            Welcome back Here’s a quick overview of your
            portfolio activity and engagement.
          </p>
        </div>

        <Link
          to="/admin/company/add"
          className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:scale-105"
        >
          + Create New Post
        </Link>
      </section>

      {/* STATS */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsData.map((item) => (
          <StatsCard
            key={item.title}
            title={item.title}
            value={item.value}
            subtitle={item.subtitle}
            icon={item.icon}
          />
        ))}
      </section>

      {/* ANALYTICS */}
      <section className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* GRAPH */}
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-800">
              Post Analytics
            </h2>

            <p className="text-sm text-slate-500">
              Weekly engagement performance for your recent posts.
            </p>
          </div>

          <div className="flex h-72 items-end justify-between gap-2 rounded-2xl bg-slate-50 p-4">
            {[
              { day: "Mon", value: 35 },
              { day: "Tue", value: 60 },
              { day: "Wed", value: 45 },
              { day: "Thu", value: 80 },
              { day: "Fri", value: 95 },
              { day: "Sat", value: 70 },
              { day: "Sun", value: 100 },
            ].map((item) => (
              <div
                key={item.day}
                className="flex flex-1 flex-col items-center justify-end gap-2"
              >
                <div
                  className="w-full rounded-t-xl bg-slate-800 transition hover:opacity-80"
                  style={{
                    height: `${item.value}%`,
                  }}
                />

                <span className="text-xs font-medium text-slate-500">
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">
            Quick Actions
          </h2>

          <div className="mt-5 grid gap-3">
            <Link
              to="/admin/company/add"
              className="rounded-2xl border border-slate-200 p-4 text-left transition hover:bg-slate-50"
            >
              <h3 className="font-semibold text-slate-800">
                Create New Post
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Publish a new project or article.
              </p>
            </Link>

            <Link
              to="/admin/company/list"
              className="rounded-2xl border border-slate-200 p-4 text-left transition hover:bg-slate-50"
            >
              <h3 className="font-semibold text-slate-800">
                Manage Portfolio
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Edit your portfolio and projects.
              </p>
            </Link>

            <Link
              to="/admin/company/messages"
              className="rounded-2xl border border-slate-200 p-4 text-left transition hover:bg-slate-50"
            >
              <h3 className="font-semibold text-slate-800">
                View Messages
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Check recent user conversations.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* RECENT POSTS */}
      <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Recent Posts
            </h2>

            <p className="text-sm text-slate-500">
              Recently published articles and portfolio updates.
            </p>
          </div>

          <button
            type="button"
            className="text-sm font-semibold text-slate-700 transition hover:underline"
          >
            View All
          </button>
        </div>

        <DashPosts />
      </section>
    </main>
  );
}