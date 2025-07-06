import { type NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import dbConnect from "@/utils/dbConnect";
import { Transaction } from "@/models/Transactions";
import { ApiResponse } from "@/utils/ApiResponse";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const body = await request.json();
    const { description, amount, category, date, type } = body;

    // Validation
    if (!description || !amount || !category || !date || !type) {
      return ApiResponse(false, "All fields are required", 400);
    }

    if (amount <= 0) {
      return ApiResponse(false, "Amount must be greater than 0", 400);
    }

    if (!ObjectId.isValid(params.id)) {
      return ApiResponse(false, "Invalid transaction ID", 400);
    }

    const istDate = new Date(date + "T00:00:00.000+05:30");

    const updateData = {
      description: description.trim(),
      amount: Number.parseFloat(amount),
      category,
      date: istDate,
      type,
    };

    const result = await Transaction.findByIdAndUpdate(params.id, updateData, {
      new: true,
    });

    if (!result) {
      return ApiResponse(false, "Transaction not found", 404);
    }
    return ApiResponse(true, "Transaction updated successfully", 200);
  } catch (error) {
    console.error("Database Error:", error);
    return ApiResponse(false, "Failed to update transaction", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    if (!ObjectId.isValid(params.id)) {
      return ApiResponse(false, "Invalid transaction ID", 400);
    }

    const result = await Transaction.findByIdAndDelete(params.id);

    if (!result) {
      return ApiResponse(false, "Transaction not found", 404);
    }

    return ApiResponse(true, "Transaction deleted successfully", 200);
  } catch (error) {
    console.error("Database Error:", error);
    return ApiResponse(false, "Failed to delete transaction", 500);
  }
}
