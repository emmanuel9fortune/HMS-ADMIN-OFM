const mongoose = require("mongoose");
const { Schema } = mongoose;

const SERVICE_TYPES = [
  "drugs",
  "utils",
  "consumables",
  "cards",
  "consultation",
  "lab",
  "scan",
  "payout",
  "CHURCH",
  "BLOOD",
  "OXYGEN",
  "PROFESSIONAL",
  "NURSING",
  "BED",
  "DELIVERY FEES",
  "PROCEDURE FEES",
  "discount",
];

const BillRequestItemSchema = new Schema(
  {
    billRequestId: {
      type: Schema.Types.ObjectId,
      ref: "Bills",
      required: true,
      index: true,
    },

    itemId: {
      type: String,
      default: null,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    quantity: {
      type: Number,
      default: 1,
    },

    unitPrice: {
      type: Number,
      default: 0,
    },

    totalPrice: {
      type: Number,
      default: 0,
    },

    costPrice: {
      type: Number,
      default: 0,
    },

    /*
     * IMPORTANT:
     * This is the UNIT actual cost.
     *
     * Total actual cost is:
     * quantity * actualCost
     */
    actualCost: {
      type: Number,
      default: 0,
    },

    days: {
      type: Number,
      default: null,
    },

    dosage: {
      type: Number,
      default: null,
    },

    frequency: {
      type: String,
      default: null,
      trim: true,
    },

    status: {
      type: String,
      default: null,
    },

    time: {
      type: String,
      default: null,
    },

    serviceType: {
      type: String,
      enum: SERVICE_TYPES,
      default: null,
      index: true,
    },

    sourceType: {
      type: String,
      enum: [
        "nurse",
        "doctor",
        "lab",
        "pharmacy",
        "consult",
        "payout",
        "cashier",
        "scan",
        "doc",
      ],
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

BillRequestItemSchema.index({ billRequestId: 1 });
BillRequestItemSchema.index({ name: 1, sourceType: 1 });
BillRequestItemSchema.index({ itemId: 1, sourceType: 1 });
BillRequestItemSchema.index({ serviceType: 1 });
BillRequestItemSchema.index({ serviceType: 1, createdAt: -1 });

module.exports = mongoose.model(
  "BillRequestItem",
  BillRequestItemSchema
);