const mongoose = require("mongoose");

const { Schema } = mongoose;

const BillRequestSchema = new Schema(
  {
    // =========================================================
    // PATIENT
    // =========================================================
    patient: {
      uid: {
        type: String,
        default: null,
        index: true,
      },
    },

    // =========================================================
    // PATIENT TYPE
    // =========================================================
    patientType: {
      type: String,
      enum: ["outpatient", "inpatient", "emergency"],
      default: null,
      index: true,
    },

    // =========================================================
    // BILL TYPE
    // =========================================================
    type: {
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

    // =========================================================
    // CURRENT BILL STATUS
    // =========================================================
    status: {
      type: String,
      enum: [
        "PENDING",
        "PAID",
        "DISAPPROVE",
        "AWAITING",
        "DEBTORS",
        "APPROVE",
      ],
      default: "PENDING",
      index: true,
    },

    // =========================================================
    // WORKFLOW
    // =========================================================
    workflow: {
      currentDepartment: {
        type: String,
        enum: [
          "doctor",
          "nurse",
          "cashier",
          "pharmacy",
          "laboratory",
          "scan",
        ],
        default: null,
        index: true,
      },

      nextDepartment: {
        type: String,
        enum: [
          "doctor",
          "nurse",
          "cashier",
          "pharmacy",
          "laboratory",
          "scan",
        ],
        default: null,
        index: true,
      },

      stage: {
        type: String,
        enum: [
          "CREATED",
          "AWAITING_CASHIER",
          "AWAITING_PAYMENT",
          "PAID",
          "AWAITING_PHARMACY",
          "DISPENSED",
          "RETURNED_TO_CASHIER",
          "COMPLETED",
          "DISAPPROVED",
        ],
        default: "CREATED",
        index: true,
      },
    },

    // =========================================================
    // PAYMENT
    // =========================================================
    payment: {
      status: {
        type: String,
        enum: [
          "UNPAID",
          "PARTIAL",
          "PAID",
          "DEBTOR",
        ],
        default: "UNPAID",
        index: true,
      },

      mode: {
        type: String,
        default: null,
      },

      tag: {
        type: String,
        default: null,
      },

      paidAt: {
        type: Date,
        default: null,
      },

      paidBy: {
        type: String,
        default: null,
      },
    },

    // =========================================================
    // STAFF
    // =========================================================
    staff: {
      staffId: {
        type: String,
        default: null,
        index: true,
      },

      doctorId: {
        type: String,
        default: null,
        index: true,
      },

      nurseId: {
        type: String,
        default: null,
        index: true,
      },
    },

    // =========================================================
    // FINANCIAL INFORMATION
    // =========================================================
    financials: {
      // Original/stored accounting values
      total: {
        type: Number,
        default: 0,
      },

      actualCost: {
        type: Number,
        default: 0,
      },

      profit: {
        type: Number,
        default: 0,
      },

      deposit: {
        type: Number,
        default: 0,
      },

      initialDeposit: {
        type: Number,
        default: 0,
      },

      // Values reconstructed from BillRequestItem
      calculatedTotal: {
        type: Number,
        default: 0,
      },

      calculatedCost: {
        type: Number,
        default: 0,
      },

      calculatedProfit: {
        type: Number,
        default: 0,
      },

      // Stored total - calculated total
      totalDifference: {
        type: Number,
        default: 0,
      },

      // Useful for audit
      hasMismatch: {
        type: Boolean,
        default: false,
        index: true,
      },
    },

    // =========================================================
    // INSTRUCTIONS
    // =========================================================
    instruction: {
      type: String,
      default: null,
      trim: true,
    },

    // =========================================================
    // IMPORTANT DATES
    // =========================================================
    billDate: {
      type: Date,
      default: null,
      index: true,
    },

    preTime: {
      type: Date,
      default: null,
    },

    // =========================================================
    // WORKFLOW DATES
    // =========================================================
    dates: {
      submittedAt: {
        type: Date,
        default: null,
      },

      paidAt: {
        type: Date,
        default: null,
      },

      dispensedAt: {
        type: Date,
        default: null,
      },

      returnedToCashierAt: {
        type: Date,
        default: null,
      },

      completedAt: {
        type: Date,
        default: null,
      },
    },

    // =========================================================
    // WORKFLOW ACTORS
    // =========================================================
    actors: {
      createdBy: {
        type: String,
        default: null,
      },

      paidBy: {
        type: String,
        default: null,
      },

      dispensedBy: {
        type: String,
        default: null,
      },

      completedBy: {
        type: String,
        default: null,
      },
    },

    // =========================================================
    // LEGACY DATA
    // =========================================================
    legacy: {
      originalId: {
        type: String,
        default: null,
        index: true,
      },

      originalCollection: {
        type: String,
        default: "billrequests",
      },
    },
  },

  {
    timestamps: true,
  }
);

// =========================================================
// INDEXES
// =========================================================

BillRequestSchema.index({
  "patient.uid": 1,
  createdAt: -1,
});

BillRequestSchema.index({
  type: 1,
  status: 1,
  createdAt: -1,
});

BillRequestSchema.index({
  status: 1,
  createdAt: -1,
});

BillRequestSchema.index({
  patientType: 1,
  createdAt: -1,
});

BillRequestSchema.index({
  "workflow.stage": 1,
  createdAt: -1,
});

BillRequestSchema.index({
  "payment.status": 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "Bills",
  BillRequestSchema
);