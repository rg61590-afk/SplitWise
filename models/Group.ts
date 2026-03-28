import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGroupMember {
  user: mongoose.Types.ObjectId;
  role: "admin" | "member";
  joinedAt: Date;
}

export interface IGroup extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  members: IGroupMember[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const GroupMemberSchema = new Schema<IGroupMember>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const GroupSchema = new Schema<IGroup>(
  {
    name: {
      type: String,
      required: [true, "Group name is required"],
      trim: true,
      minlength: [2, "Group name must be at least 2 characters"],
      maxlength: [100, "Group name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    members: [GroupMemberSchema],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Group: Model<IGroup> =
  mongoose.models.Group || mongoose.model<IGroup>("Group", GroupSchema);

export default Group;
