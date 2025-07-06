import { NextResponse } from "next/server"
import dbConnect from "@/utils/dbConnect"
import { Transaction } from "@/models/Transactions"
import { PipelineStage } from "mongoose"
import { ApiResponse } from "@/utils/ApiResponse"

export async function GET() {
  try {
    await dbConnect()

    // Get last 6 months of data
    const now = new Date()
    const istNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
    const sixMonthsAgo = new Date(istNow.getFullYear(), istNow.getMonth() - 6, 1)
    const sixMonthsAgoUTC = new Date(sixMonthsAgo.getTime() - 5.5 * 60 * 60 * 1000)

    const pipeline = [
      {
        $match: {
          date: { $gte: sixMonthsAgoUTC },
          type: "expense",
        },
      },
      {
        $addFields: {
          istDate: {
            $add: [
              "$date",
              { $multiply: [5.5, 60, 60, 1000] } // 5.5 hours in milliseconds
            ]
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$istDate" },
            month: { $month: "$istDate" },
          },
          expenses: { $sum: "$amount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]

    const results = await Transaction.aggregate(pipeline as PipelineStage[])

    // Format the results
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const formattedResults = results.map((result) => ({
      month: monthNames[result._id.month - 1],
      expenses: result.expenses,
    }))

    // Fill in missing months with 0
    const currentDate = new Date()
    const monthlyData = []

    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const monthName = monthNames[date.getMonth()]

      const existingData = formattedResults.find((item) => item.month === monthName)
      monthlyData.push({
        month: monthName,
        expenses: existingData ? existingData.expenses : 0,
      })
    }

    return NextResponse.json({
      success: true,
      data: monthlyData,
      message: "Monthly data fetched successfully",
    }, { status: 200 })
  } catch (error) {
    console.error("Database Error:", error)
    return ApiResponse(false, "Failed to fetch monthly data", 500)
  }
}
