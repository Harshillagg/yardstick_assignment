"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Wallet, CreditCard } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { formatCurrencyCompact } from "@/utils/formats";

interface SummaryData {
  totalExpenses: number;
  totalIncome: number;
  balance: number;
  transactionCount: number;
  monthlyChange: number;
}

export function SummaryCards() {
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSummaryData();
  }, []);

  const fetchSummaryData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/transactions/summary");
      if (!response.ok) {
        throw new Error("Failed to fetch summary data");
      }
      const summaryData = await response.json();
      setData(summaryData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <SummaryCardsSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load summary data: {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!data) return null;

  const cards = [
    {
      title: "Total Balance",
      value: data.balance,
      description: "Current account balance",
      icon: Wallet,
      color: data.balance >= 0 ? "text-blue-600" : "text-red-600",
      bgColor:
        data.balance >= 0
          ? "bg-blue-50 dark:bg-blue-950"
          : "bg-red-50 dark:bg-red-950",
    },
    {
      title: "Total Expenses",
      value: data.totalExpenses,
      description: "This month's spending",
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950",
    },
    {
      title: "Total Income",
      value: data.totalIncome,
      description: "This month's earnings",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      title: "Transactions",
      value: data.transactionCount,
      description: "Total this month",
      icon: CreditCard,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      isCount: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card
          key={index}
          className="hover:shadow-lg transition-shadow duration-200"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {card.isCount
                ? card.value
                : formatCurrencyCompact(Math.abs(card.value))}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function SummaryCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="h-8 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-1" />
            <div className="h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
