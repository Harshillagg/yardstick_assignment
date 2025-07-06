import { NextResponse } from "next/server"
import dbConnect from "@/utils/dbConnect"
import { Transaction } from "@/models/Transactions"
import { PipelineStage } from "mongoose"
import { ApiResponse } from "@/utils/ApiResponse"

export async function GET() {
  try {
    await dbConnect()

    // Get current month's start and end dates
    const now = new Date()
    const istNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
    const startOfMonth = new Date(istNow.getFullYear(), istNow.getMonth(), 1)
    const endOfMonth = new Date(istNow.getFullYear(), istNow.getMonth() + 1, 0, 23, 59, 59)

    // Convert to UTC for MongoDB query
    const startOfMonthUTC = new Date(startOfMonth.getTime() - 5.5 * 60 * 60 * 1000)
    const endOfMonthUTC = new Date(endOfMonth.getTime() - 5.5 * 60 * 60 * 1000)

    // Aggregate data for current month
    const pipeline = [
      {
        $match: {
          date: {
            $gte: startOfMonthUTC,
            $lte: endOfMonthUTC,
          },
        },
      },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]

    const results = await Transaction.aggregate(pipeline as PipelineStage[])

    let totalExpenses = 0
    let totalIncome = 0
    let transactionCount = 0

    results.forEach((result) => {
      if (result._id === "expense") {
        totalExpenses = result.total
        transactionCount += result.count
      } else if (result._id === "income") {
        totalIncome = result.total
        transactionCount += result.count
      }
    })

    const balance = totalIncome - totalExpenses

    const monthlyChange = 0 // This would require previous month's data

    return NextResponse.json({
      success: true,
      totalExpenses,
      totalIncome,
      balance,
      transactionCount,
      monthlyChange,
      message: "Summary data fetched successfully",
    }, { status: 200 })
  } catch (error) {
    console.error("Database Error:", error)
    return ApiResponse(false, "Failed to fetch summary data", 500)
  }
}
