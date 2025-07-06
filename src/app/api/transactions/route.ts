import { Transaction } from "@/models/Transactions"
import { ApiResponse } from "@/utils/ApiResponse"
import dbConnect from "@/utils/dbConnect"
import { NextResponse, type NextRequest } from "next/server"

interface TransactionQuery {
  type?: string;
  category?: string;
  date?: {
    $gte?: Date;
    $lte?: Date;
  };
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit")
    const type = searchParams.get("type")
    const category = searchParams.get("category")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const page = searchParams.get("page") || "1"

    // Build query filters
    const query: TransactionQuery = {}
    
    if (type && ["income", "expense"].includes(type)) {
      query.type = type
    }
    
    if (category) {
      query.category = category
    }
    
    if (startDate || endDate) {
      query.date = {}
      if (startDate) {
        query.date.$gte = new Date(startDate + "T00:00:00.000+05:30")
      }
      if (endDate) {
        query.date.$lte = new Date(endDate + "T23:59:59.999+05:30")
      }
    }

    // Pagination
    const pageSize = limit ? Number.parseInt(limit) : 10
    const skip = (Number.parseInt(page) - 1) * pageSize

    const options = {
      sort: { date: -1, createdAt: -1 },
      limit: pageSize,
      skip: skip
    }

    // Get total count for pagination
    const totalCount = await Transaction.countDocuments(query)
    
    // Get transactions
    const transactions = await Transaction.find(query, null, options)

    return NextResponse.json({
        success: true,
        message: "Transactions fetched successfully",
        data: transactions,
        pagination: {
          page: Number.parseInt(page),
          pageSize,
          total: totalCount,
          totalPages: Math.ceil(totalCount / pageSize)
        }
    }, {status: 200})
  } catch (error) {
    console.error("Database Error:", error)
    return ApiResponse(false, "Failed to fetch transactions", 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()
    const { description, amount, category, date, type } = body

    // Validation
    if (!description || !amount || !category || !date || !type) {
      return ApiResponse(false, "All fields are required", 400)
    }

    if (amount <= 0) {
      return ApiResponse(false, "Amount must be greater than 0", 400)
    }

    if (!["income", "expense"].includes(type)) {
      return ApiResponse(false, "Type must be either income or expense", 400)
    }

    const istDate = new Date(date + "T00:00:00.000+05:30")

    const transaction = {
      description: description.trim(),
      amount: Number.parseFloat(amount),
      category,
      date: istDate,
      type,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await Transaction.create(transaction)

    return NextResponse.json({ success: true, message: "Transaction created successfully", id: result._id }, { status: 201 })
  } catch (error) {
    console.error("Database Error:", error)
    return ApiResponse(false, "Failed to create transaction", 500)
  }
}
