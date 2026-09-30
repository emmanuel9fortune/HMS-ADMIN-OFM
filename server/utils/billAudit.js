const BillAuditEvent = require("../model/BillAuditEvent");

async function createBillAudit({
    billId,
    action,
    department = null,
    staffId = null,
    amount = 0,
    paymentMode = null,
    previousStatus = null,
    newStatus = null,
    previousStage = null,
    newStage = null,
    note = null,
    metadata = null,
}) {
    return BillAuditEvent.create({
        billId,
        action,
        department,
        staffId,
        amount,
        paymentMode,
        previousStatus,
        newStatus,
        previousStage,
        newStage,
        note,
        metadata,
    });
}

module.exports = {
    createBillAudit,
};