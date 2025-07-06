import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import { Transaction } from "@/models/Transactions";
import { ApiResponse } from "@/utils/ApiResponse";
import { PipelineStage } from "mongoose";

export async function GET() {
  try {
    await dbConnect();

    const now = new Date()
    const istNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
    const startOfMonth = new Date(istNow.getFullYear(), istNow.getMonth(), 1)
    const endOfMonth = new Date(istNow.getFullYear(), istNow.getMonth() + 1, 0, 23, 59, 59)

    // Convert to UTC for MongoDB query
    const startOfMonthUTC = new Date(startOfMonth.getTime() - 5.5 * 60 * 60 * 1000)
    const endOfMonthUTC = new Date(endOfMonth.getTime() - 5.5 * 60 * 60 * 1000)

    const pipeline = [
      {
        $match: {
          type: "expense",
          date: {
            $gte: startOfMonthUTC,
            $lte: endOfMonthUTC,
          },
        },
      },
      {
        $group: {
          _id: "$category",
          value: { $sum: "$amount" },
        },
      },
      {
        $sort: { value: -1 },
      },
    ];

    const results = await Transaction.aggregate(pipeline as PipelineStage[]);

    const categoryData = results.map((result) => ({
      name: result._id,
      value: result.value,
    }));

    return NextResponse.json(
      {
        success: true,
        data: categoryData,
        message: "Category data fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database Error:", error);
    return ApiResponse(false, "Failed to fetch category data", 500);
  }
}
