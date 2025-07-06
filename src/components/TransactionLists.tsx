"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Receipt } from "lucide-react";
import { getCategoryIcon } from "@/utils/categories";
import { formatDateIST, formatCurrency } from "@/utils/formats";
import { EditTransactionDialog } from "@/components/EditTransactionDialog";
import { DeleteTransactionDialog } from "@/components/DeleteTransactionDialog";

interface Transaction {
  _id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: "income" | "expense";
}

export function TransactionsList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/transactions");
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const data = await response.json();
      setTransactions(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionUpdate = () => {
    fetchTransactions();
  };

  if (loading) {
    return <TransactionsListSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load transactions: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-blue-600" />
          All Transactions
        </CardTitle>
        <CardDescription>
          {transactions.length} transaction
          {transactions.length !== 1 ? "s" : ""} found (amounts in INR)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <Receipt className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              No transactions yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Start tracking your finances by adding your first transaction.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => {
              const CategoryIcon = getCategoryIcon(transaction.category);
              return (
                <div
                  key={transaction._id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800">
                      <CategoryIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                        {transaction.description}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {formatDateIST(transaction.date)}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {transaction.category}
                        </Badge>
                        <Badge
                          variant={
                            transaction.type === "income"
                              ? "default"
                              : "destructive"
                          }
                          className="text-xs"
                        >
                          {transaction.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p
                        className={`text-lg font-bold ${
                          transaction.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatCurrency(Math.abs(transaction.amount))}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <EditTransactionDialog
                        transaction={transaction}
                        onUpdate={handleTransactionUpdate}
                      />
                      <DeleteTransactionDialog
                        transaction={transaction}
                        onDelete={handleTransactionUpdate}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TransactionsListSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2" />
        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
                <div>
                  <div className="h-5 w-40 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2" />
                  <div className="flex gap-2">
                    <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                    <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                <div className="flex gap-1">
                  <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                  <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
