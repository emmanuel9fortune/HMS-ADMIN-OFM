async function deleteMigratedBillRequests() {
    try {
        console.log("Deleting migrated BillRequest data...");

        const bills = await billRequests.find({
            "legacy.originalCollection": "billrequests"
        }).select("_id");

        const billIds = bills.map((bill) => bill._id);

        if (billIds.length === 0) {
            console.log("No migrated BillRequest records found.");
            return;
        }


        const billResult = await billRequests.deleteMany({
            _id: { $in: billIds }
        });

        console.log(
            `Deleted ${billResult.deletedCount} BillRequest records.`
        );

    } catch (error) {
        console.error("Error deleting migrated BillRequest data:", error);
    }
}