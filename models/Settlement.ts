import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISettlement extends Document {
  _id: mongoose.Types.ObjectId;
  payer: mongoose.Types.ObjectId;
  payee: mongoose.Types.ObjectId;
  amount: number;
  group: mongoose.Types.ObjectId;
  status: "pending" | "completed";
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SettlementSchema = new Schema<ISettlement>(
  {
    payer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    payee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Settlement: Model<ISettlement> =
  mongoose.models.Settlement ||
  mongoose.model<ISettlement>("Settlement", SettlementSchema);

export default Settlement;
