import mongoose, { Schema, Document, model } from "mongoose";

export interface TransactionProps extends Document {
  description: string;
  amount: number;
  category: string;
  date: Date;
  type: "income" | "expense";
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<TransactionProps>(
  {
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: ["income", "expense"],
    },
  },
  {
    timestamps: true,
  }
);

export const Transaction =
  mongoose.models.Transaction ||
  model<TransactionProps>("Transaction", TransactionSchema);
