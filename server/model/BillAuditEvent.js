const mongoose = require("mongoose");

const { Schema } = mongoose;

const BillAuditEventSchema = new Schema(
    {
        // =====================================================
        // BILL
        // =====================================================
        billId: {
            type: Schema.Types.ObjectId,
            ref: "Bills",
            required: true,
            index: true,
        },

        // =====================================================
        // WHAT HAPPENED
        // =====================================================
        action: {
            type: String,
            enum: [
                "CREATED",
                "SUBMITTED",
                "APPROVED",
                "PAYMENT_RECEIVED",
                "PAYMENT_UPDATED",
                "SENT_TO_PHARMACY",
                "DISPENSED",
                "RETURNED_TO_CASHIER",
                "COMPLETED",
                "DISAPPROVED",
                "REFUNDED",
                "DISCOUNT_APPLIED",
                "ITEM_ADDED",
                "ITEM_REMOVED",
                "BILL_UPDATED",
            ],
            required: true,
            index: true,
        },

        // =====================================================
        // DEPARTMENT
        // =====================================================
        department: {
            type: String,
            enum: [
                "doctor",
                "nurse",
                "cashier",
                "pharmacy",
                "laboratory",
                "scan",
                "admin",
                "system",
            ],
            default: null,
            index: true,
        },

        // =====================================================
        // STAFF WHO PERFORMED ACTION
        // =====================================================
        staffId: {
            type: String,
            default: null,
            index: true,
        },

        // =====================================================
        // FINANCIAL INFORMATION RELATED TO EVENT
        // =====================================================
        amount: {
            type: Number,
            default: 0,
        },

        paymentMode: {
            type: String,
            default: null,
        },

        // =====================================================
        // STATE TRANSITION
        // =====================================================
        previousStatus: {
            type: String,
            default: null,
        },

        newStatus: {
            type: String,
            default: null,
        },

        previousStage: {
            type: String,
            default: null,
        },

        newStage: {
            type: String,
            default: null,
        },

        // =====================================================
        // OPTIONAL NOTE
        // =====================================================
        note: {
            type: String,
            default: null,
            trim: true,
        },

        // =====================================================
        // EXTRA DATA
        // =====================================================
        metadata: {
            type: Schema.Types.Mixed,
            default: null,
        },
    },

    {
        timestamps: true,
    }
);

BillAuditEventSchema.index({
    billId: 1,
    createdAt: 1,
});

BillAuditEventSchema.index({
    action: 1,
    createdAt: -1,
});

BillAuditEventSchema.index({
    department: 1,
    createdAt: -1,
});

module.exports = mongoose.model(
    "BillAuditEvent",
    BillAuditEventSchema
);