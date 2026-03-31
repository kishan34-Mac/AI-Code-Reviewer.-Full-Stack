import { Schema, Types, model, type InferSchemaType } from "mongoose";

const reviewSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    language: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
    },
    qualityScore: {
      type: Number,
      required: true,
    },
    analysis: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export type IReview = InferSchemaType<typeof reviewSchema> & { _id: string };

export const Review = model("Review", reviewSchema);
