"use client";
import { useEffect, useMemo, useState } from "react";
import { User } from "lucide-react";
import PropertyIcon from "../atoms/PropertyIcon";
import { Progress } from "@/components/ui/progress";
import { ChartPieSimple } from "./pie-chart";
import { authService, propertyService } from "@/services";
import { Property, User as UserType } from "@/types";
import { AuthState, RootState, useAppSelector } from "@/store";
import { toast } from "sonner";
import { ChartBar, type BarChartDataItem } from "./bar-chart";

export default function AdminStats() {
  const [properties, setProperties] = useState<Property[]>();
  const [users, setUsers] = useState<UserType[]>();
  const { access_token } = useAppSelector(
    (state: RootState) => state.auth,
  ) as AuthState;

  useEffect(() => {
    const fetchData = async () => {
      const res = await propertyService.getAllProperties();
      if (res.status === 200) {
        setProperties(res.data);
      } else {
        toast.error(res.message);
      }
    };
    const fetchUsers = async () => {
      const res = await authService.getAllUsers(access_token as string);
      if (res.status === 200) {
        setUsers(res.data);
      } else {
        toast.error(res.message);
      }
    };
    fetchData();
    fetchUsers();
  }, [access_token]);

  const propertiesForSale = properties?.filter(
    (prop) => prop.listing_type === "sale",
  );
  const propertiesForRent = properties?.filter(
    (prop) => prop.listing_type === "rent",
  );

  const pieChartData = [
    {
      item: "SALE",
      value: propertiesForSale?.length.toString() as string,
      color: "#ffd8a8",
    },
    {
      item: "RENT",
      value: propertiesForRent?.length.toString() as string,
      color: "#ffc078",
    },
  ];

  const admins = users?.filter((user) => user.role === "admin");
  const buyers = users?.filter((user) => user.role === "buyer");
  const sellers = users?.filter((user) => user.role === "seller");

  const usersPieChartData = [
    {
      item: "ADMINS",
      value: admins?.length.toString() as string,
      color: "#ffd8a8",
    },
    {
      item: "SELLERS",
      value: sellers?.length.toString() as string,
      color: "#ffc078",
    },
    {
      item: "BUYERS",
      value: buyers?.length.toString() as string,
      color: "#ffa94d",
    },
  ];

  const closedDeals = properties?.filter(
    (prop) => prop.status === "sold" || prop.status === "rented",
  );

  const rentedProperties = closedDeals?.filter(
    (prop) => prop.status === "rented",
  );

  const soldProperties = closedDeals?.filter((prop) => prop.status === "sold");

  const closedDealsPieChartData = [
    {
      item: "RENTED",
      value: rentedProperties?.length.toString() as string,
      color: "#ffc078",
    },
    {
      item: "SOLD",
      value: soldProperties?.length.toString() as string,
      color: "#ffa94d",
    },
  ];

  const barChartData = useMemo((): BarChartDataItem[] => {
    const currentYear = new Date().getFullYear();
    const months: BarChartDataItem[] = [];

    for (let month = 0; month < 12; month++) {
      const date = new Date(currentYear, month, 1);
      const nextMonth = new Date(currentYear, month + 1, 1);

      const inMonth = (createdAt: string | Date | undefined) => {
        if (!createdAt) return false;
        const d =
          typeof createdAt === "string" ? new Date(createdAt) : createdAt;
        return d >= date && d < nextMonth;
      };

      const Rent = (properties ?? []).filter(
        (p) =>
          (p.listing_type === "rent" || p.listing_type === "lease") &&
          inMonth(p.created_at),
      ).length;
      const Sell = (properties ?? []).filter(
        (p) => p.listing_type === "sale" && inMonth(p.created_at),
      ).length;

      months.push({ month: date, Rent, Sell });
    }
    return months;
  }, [properties]);

  return (
    <div>
      <div className="flex flex-col xl:flex-row gap-4 items-center">
        <div className="w-full flex flex-col items-center">
          <div className="bg-primary max-w-120 p-4 rounded-lg flex justify-between items-center mb-4 w-full">
            <PropertyIcon className="w-8 h-8 text-white" />
            <div className="flex flex-col items-center">
              <span className="text-white">Total properties</span>
              <Progress
                value={100}
                className="w-60 **:data-[slot=progress]:bg-white/20 **:data-[slot=progress-indicator]:bg-white"
              />
            </div>
            <span className="text-white font-bold">{properties?.length}</span>
          </div>
          <ChartPieSimple
            data={pieChartData}
            title="Properties available"
            description={new Date().toLocaleDateString()}
            footerText="Displaying property data insights"
          />
        </div>
        <div className="w-full flex flex-col items-center">
          <div className="bg-primary max-w-120 p-4 rounded-lg flex justify-between items-center mb-4 w-full">
            <PropertyIcon className="w-8 h-8 text-white" />
            <div className="flex flex-col items-center">
              <span className="text-white">Closed deals</span>
              <Progress
                value={100}
                className="w-60 **:data-[slot=progress]:bg-white/20 **:data-[slot=progress-indicator]:bg-white"
              />
            </div>
            <span className="text-white font-bold">{closedDeals?.length}</span>
          </div>
          <ChartPieSimple
            data={closedDealsPieChartData}
            title="Closed deals"
            description={new Date().toLocaleDateString()}
            footerText="Displaying property sold and rented"
          />
        </div>
        <div className="w-full flex flex-col items-center">
          <div className="bg-primary max-w-120 p-4 rounded-lg flex justify-between items-center mb-4 w-full">
            <User className="w-8 h-8 text-white" />
            <div className="flex flex-col items-center">
              <span className="text-white">Total users</span>
              <Progress
                value={100}
                className="w-60 **:data-[slot=progress]:bg-white/20 **:data-[slot=progress-indicator]:bg-white"
              />
            </div>
            <span className="text-white font-bold">{users?.length}</span>
          </div>

          <ChartPieSimple
            data={usersPieChartData}
            title="All users"
            description={new Date().toLocaleDateString()}
            footerText="Displaying user's data insights"
          />
        </div>
      </div>
      <ChartBar
        data={barChartData}
        title="Properties listings by month"
        description={`Rent vs Sell created in ${new Date().getFullYear()}`}
        rentColor={pieChartData.find((d) => d.item === "RENT")?.color}
        sellColor={pieChartData.find((d) => d.item === "SALE")?.color}
        className="mt-4"
      />
    </div>
  );
}
