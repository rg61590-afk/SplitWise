import mongoose, { Schema, Document, Model } from "mongoose";

export interface IExpenseShare {
  user: mongoose.Types.ObjectId;
  amount: number;
  isPaid: boolean;
}

export interface IExpense extends Document {
  _id: mongoose.Types.ObjectId;
  description: string;
  amount: number;
  paidBy: mongoose.Types.ObjectId;
  group: mongoose.Types.ObjectId;
  shares: IExpenseShare[];
  category: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseShareSchema = new Schema<IExpenseShare>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Share amount cannot be negative"],
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const ExpenseSchema = new Schema<IExpense>(
  {
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [200, "Description cannot exceed 200 characters"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    paidBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    shares: [ExpenseShareSchema],
    category: {
      type: String,
      enum: [
        "food",
        "transport",
        "entertainment",
        "utilities",
        "rent",
        "shopping",
        "health",
        "travel",
        "other",
      ],
      default: "other",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Expense: Model<IExpense> =
  mongoose.models.Expense || mongoose.model<IExpense>("Expense", ExpenseSchema);

export default Expense;
