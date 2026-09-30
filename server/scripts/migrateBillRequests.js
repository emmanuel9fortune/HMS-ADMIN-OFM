/**
 * ============================================================
 * BILL REQUEST MIGRATION
 * ============================================================
 *
 * Old:
 *     billRequests
 *
 * New:
 *     BillRequest
 *     BillRequestItem
 *
 * This migration:
 *
 * - Uses the existing Mongoose connection from main.js
 * - Does NOT call mongoose.connect()
 * - Does NOT call mongoose.disconnect()
 * - Can run every time the server starts
 * - Does NOT delete old billRequests
 * - Prevents duplicate BillRequests
 * - Preserves the original MongoDB _id in legacy.originalId
 * - Preserves historical financial values
 * - Calculates missing financial values from services
 * - Classifies migrated services for the new audit system
 * - Preserves CHURCH as a BILLING/PAYMENT MODE
 *   and NOT as a service type
 *
 * ============================================================
 */

const mongoose = require("mongoose");


// ============================================================
// MODELS
// ============================================================

const {
    billRequests
} = require("../../model");

const BillRequest =
    require("../model/BillRequest");

const BillRequestItem =
    require("../model/BillRequestItem");


// ============================================================
// CONFIG
// ============================================================

const BATCH_SIZE = 500;


// ============================================================
// SERVICE TYPES
// ============================================================
//
// IMPORTANT:
//
// CHURCH IS NOT A SERVICE TYPE.
//
// In the old JSON:
//
//     mode: "CHURCH"
//
// Therefore CHURCH is preserved inside:
//
//     payment.mode
//
// The actual service remains:
//
//     procedure
//     scan
//     lab
//     drugs
//     consumables
//     etc.
//
// ============================================================

const SERVICE_TYPES = [
    "drugs",
    "utils",
    "consumables",
    "cards",
    "consultation",
    "lab",
    "scan",
    "payout",
    "BLOOD",
    "OXYGEN",
    "PROFESSIONAL",
    "NURSING",
    "BED",
    "DELIVERY FEES",
    "PROCEDURE FEES",
    "discount"
];


// ============================================================
// HELPERS
// ============================================================

function cleanString(value) {

    if (
        value === undefined ||
        value === null
    ) {
        return null;
    }

    const result =
        String(value).trim();

    return result.length
        ? result
        : null;
}


function toNumber(value) {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return null;
    }

    const number =
        Number(value);

    return Number.isFinite(number)
        ? number
        : null;
}


function toDate(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return null;
    }


    if (
        value instanceof Date
    ) {

        return Number.isNaN(
            value.getTime()
        )
            ? null
            : value;
    }


    /*
     * Old system stores timestamps
     * using new Date().getTime()
     */
    if (
        typeof value === "number"
    ) {

        const date =
            new Date(value);

        return Number.isNaN(
            date.getTime()
        )
            ? null
            : date;
    }


    /*
     * Handle numeric strings too.
     */
    if (
        typeof value === "string" &&
        /^\d+$/.test(value)
    ) {

        const date =
            new Date(
                Number(value)
            );

        return Number.isNaN(
            date.getTime()
        )
            ? null
            : date;
    }


    const date =
        new Date(value);

    return Number.isNaN(
        date.getTime()
    )
        ? null
        : date;
}


function normalizeText(value) {

    return String(value || "")
        .trim()
        .toUpperCase()
        .replace(/\s+/g, " ");
}


function firstDefined(...values) {

    for (
        const value
        of values
    ) {

        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {
            return value;
        }
    }

    return null;
}


function firstNumber(...values) {

    for (
        const value
        of values
    ) {

        const number =
            toNumber(value);

        if (
            number !== null
        ) {
            return number;
        }
    }

    return null;
}


// ============================================================
// PARSE SERVICES
// ============================================================

/**
 * Convert the old `services` field
 * into an object or array.
 */
function parseServices(services) {

    if (
        services === undefined ||
        services === null
    ) {
        return null;
    }


    if (
        typeof services === "string"
    ) {

        try {

            return JSON.parse(
                services
            );

        } catch (error) {

            console.error(
                "Unable to parse services JSON:",
                services
            );

            return null;
        }
    }


    return services;
}


// ============================================================
// EXTRACT ITEMS
// ============================================================

function extractItems(services) {

    const parsed =
        parseServices(
            services
        );


    if (!parsed) {
        return [];
    }


    // --------------------------------------------------------
    // Array
    // --------------------------------------------------------

    if (
        Array.isArray(parsed)
    ) {

        return parsed;
    }


    // --------------------------------------------------------
    // Object containing items
    // --------------------------------------------------------

    if (
        Array.isArray(
            parsed.items
        )
    ) {

        return parsed.items;
    }


    // --------------------------------------------------------
    // Single item object
    // --------------------------------------------------------

    if (
        typeof parsed === "object"
    ) {

        return [parsed];
    }


    return [];
}


// ============================================================
// NORMALIZE DAYS
// ============================================================

function normalizeDays(value) {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return null;
    }


    const number =
        Number(value);


    if (
        Number.isFinite(number)
    ) {

        return number;
    }


    return null;
}


// ============================================================
// NORMALIZE DOSAGE
// ============================================================

function normalizeDosage(value) {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return null;
    }


    const number =
        Number(value);


    if (
        Number.isFinite(number)
    ) {

        return number;
    }


    return null;
}


// ============================================================
// SERVICE CLASSIFICATION
// ============================================================

function classifyService(
    item,
    oldBill
) {

    if (
        !item ||
        typeof item !== "object"
    ) {
        return null;
    }


    /*
     * If a legacy item already has serviceType,
     * preserve it when it is valid.
     *
     * CHURCH is intentionally NOT in SERVICE_TYPES.
     */
    const existingServiceType =
        cleanString(
            item.serviceType
        );


    if (
        existingServiceType &&
        SERVICE_TYPES.includes(
            existingServiceType
        )
    ) {

        return existingServiceType;
    }


    const name =
        normalizeText(
            firstDefined(
                item.name,
                item.drugs,
                item.testname,
                item.serviceName,
                item.service,
                item.description,
                item.test,
                item.scan
            )
        );


    const billType =
        normalizeText(
            oldBill?.type
        );


    const sourceType =
        normalizeText(
            firstDefined(
                item.sourceType,
                item.type,
                oldBill?.type
            )
        );


    // ========================================================
    // DISCOUNT
    // ========================================================

    if (
        name === "DISCOUNT" ||
        name.includes("DISCOUNT")
    ) {

        return "discount";
    }


    // ========================================================
    // BLOOD
    // ========================================================

    if (
        name.includes("BLOOD CULTURE") ||
        name.includes("BLOOD GROUP") ||
        name === "PCV" ||
        name.startsWith("PCV ") ||
        name.includes(" PCV") ||
        name === "HCV" ||
        name.startsWith("HCV ") ||
        name.includes(" HCV") ||
        name === "HBSA" ||
        name.startsWith("HBSA ") ||
        name.includes(" HBSA")
    ) {

        return "BLOOD";
    }


    // ========================================================
    // BED
    // ========================================================

    if (
        name === "BED FEE 1" ||
        name === "BED FEE 2" ||
        name === "BED FEE (PRIVATE WARD)" ||
        name === "BED FEE (PRIVATE WARD) 2" ||
        name === "BED FEE PRIVATE WARD" ||
        name === "BED FEE PRIVATE WARD 2" ||
        name.includes("BED FEE") ||
        name.includes("BED CHARGE") ||
        name.includes("WARD BED")
    ) {

        return "BED";
    }


    // ========================================================
    // OXYGEN
    // ========================================================

    if (
        name.includes("OXYGEN (HOURLY)") ||
        name.includes("OXYGEN (LESS THAN 30MINS)") ||
        name.includes("OXYGEN (LESS THAN 30 MINS)") ||
        name.includes("OXYGEN (ABOVE 30-60MINS)") ||
        name.includes("OXYGEN (ABOVE 30-60 MINS)") ||
        name.includes("NASAL OXYGEN CANULAR") ||
        name.includes("NASAL OXYGEN CANNULA") ||
        name.includes("OXYGEN")
    ) {

        return "OXYGEN";
    }


    // ========================================================
    // DELIVERY
    // ========================================================

    if (
        name === "DELIVERY FEES" ||
        name === "DELIVERY FEE" ||
        name.includes("DELIVERY FEE")
    ) {

        return "DELIVERY FEES";
    }


    // ========================================================
    // PROCEDURE
    // ========================================================

    if (
        name === "PROCEDURE FEE" ||
        name === "PROCEDURE FEES" ||
        name.includes("PROCEDURE FEE") ||
        name.includes("PROCEDURE FEES")
    ) {

        return "PROCEDURE FEES";
    }


    // ========================================================
    // PROFESSIONAL
    // ========================================================

    if (
        name === "PROFESSIONAL FEE" ||
        name === "PROFESSIONAL FEES" ||
        name.includes("PROFESSIONAL FEE") ||
        name.includes("PROFESSIONAL FEES")
    ) {

        return "PROFESSIONAL";
    }


    // ========================================================
    // IMPORTANT: CHURCH
    // ========================================================
    //
    // DO NOT classify CHURCH here.
    //
    // In the old JSON, CHURCH is stored as:
    //
    //     oldBill.mode === "CHURCH"
    //
    // Therefore:
    //
    //     payment.mode = "CHURCH"
    //
    // while the item keeps its actual service type.
    //
    // Example:
    //
    //     type: "scan"
    //     mode: "CHURCH"
    //
    // becomes:
    //
    //     serviceType: "scan"
    //     payment.mode: "CHURCH"
    //
    // ========================================================


    // ========================================================
    // SCAN
    // ========================================================

    if (
        billType === "SCAN" ||
        billType === "RADIOLOGY" ||
        billType === "IMAGING" ||
        sourceType === "SCAN" ||
        sourceType === "RADIOLOGY" ||
        sourceType === "IMAGING" ||
        name.includes("SCAN") ||
        name.includes("X-RAY") ||
        name.includes("XRAY") ||
        name.includes("ULTRASOUND") ||
        name.includes("CT ") ||
        name.startsWith("CT") ||
        name.includes("MRI") ||
        name.includes("MAMMOGRAPH")
    ) {

        return "scan";
    }


    // ========================================================
    // LABORATORY / TESTS
    // ========================================================
    //
    // IMPORTANT:
    //
    // Lab is checked before doctor/nurse fallbacks.
    //
    // This prevents tests from accidentally becoming
    // drugs/consumables.
    //
    // ========================================================

    if (
        billType === "LAB" ||
        billType === "LABORATORY" ||
        sourceType === "LAB" ||
        sourceType === "LABORATORY" ||
        name.includes("LAB") ||
        name.includes("TEST") ||
        name.includes("ASSAY") ||
        name.includes("CULTURE") ||
        name.includes("URINALYSIS") ||
        name.includes("URINE") ||
        name.includes("STOOL") ||
        name.includes("SEROLOGY") ||
        name.includes("HAEMOGLOBIN") ||
        name.includes("HEMOGLOBIN") ||
        name.includes("GLUCOSE") ||
        name === "FBS" ||
        name.startsWith("FBS ") ||
        name === "RBS" ||
        name.startsWith("RBS ")
    ) {

        return "lab";
    }


    // ========================================================
    // PAYOUT
    // ========================================================

    if (
        billType === "PAYOUT" ||
        sourceType === "PAYOUT" ||
        name.includes("PAYOUT")
    ) {

        return "payout";
    }


    // ========================================================
    // CARDS
    // ========================================================

    if (
        name.includes("CARD") ||
        name.includes("PATIENT CARD") ||
        name.includes("HOSPITAL CARD")
    ) {

        return "cards";
    }


    // ========================================================
    // CONSULTATION
    // ========================================================

    if (
        billType === "CONSULT" ||
        billType === "CONSULTATION" ||
        sourceType === "CONSULT" ||
        sourceType === "CONSULTATION" ||
        name.includes("CONSULTATION") ||
        name.includes("CONSULT")
    ) {

        return "consultation";
    }


    // ========================================================
    // NURSING
    // ========================================================

    if (
        name.includes("NURSING") ||
        name.includes("NURSE FEE") ||
        name.includes("NURSING FEE")
    ) {

        return "NURSING";
    }


    // ========================================================
    // UTILS
    // ========================================================

    if (
        name.includes("UTILITY") ||
        name.includes("UTILITIES") ||
        name.includes("UTIL")
    ) {

        return "utils";
    }


    // ========================================================
    // DOCTOR / DRUGS
    // ========================================================

    if (
        sourceType === "DOCTOR" ||
        billType === "DOCTOR" ||
        billType === "PHARMACY" ||
        sourceType === "PHARMACY" ||
        name.includes("TABLET") ||
        name.includes("CAPSULE") ||
        name.includes("SYRUP") ||
        name.includes("INJECTION") ||
        name.includes("CREAM") ||
        name.includes("OINTMENT") ||
        name.includes("SUSPENSION") ||
        name.includes("DRUG")
    ) {

        return "drugs";
    }


    // ========================================================
    // NURSE / CONSUMABLES
    // ========================================================

    if (
        sourceType === "NURSE" ||
        billType === "NURSE"
    ) {

        return "consumables";
    }


    // ========================================================
    // FALLBACK
    // ========================================================

    return null;
}


// ============================================================
// SOURCE TYPE
// ============================================================

function normalizeSourceType(
    item,
    oldBill
) {

    const explicit =
        cleanString(
            item.sourceType
        );


    const allowed = [
        "nurse",
        "doctor",
        "lab",
        "pharmacy",
        "consult",
        "payout",
        "cashier",
        "scan",
        "doc"
    ];


    if (
        allowed.includes(
            explicit
        )
    ) {

        return explicit;
    }


    const billType =
        normalizeText(
            oldBill.type
        );


    if (
        billType === "LAB" ||
        billType === "LABORATORY"
    ) {

        return "lab";
    }


    if (
        billType === "SCAN" ||
        billType === "RADIOLOGY" ||
        billType === "IMAGING"
    ) {

        return "scan";
    }


    if (
        billType === "NURSE"
    ) {

        return "nurse";
    }


    if (
        billType === "DOCTOR"
    ) {

        return "doctor";
    }


    if (
        billType === "CONSULT" ||
        billType === "CONSULTATION"
    ) {

        return "consult";
    }


    if (
        billType === "PAYOUT"
    ) {

        return "payout";
    }


    return "cashier";
}


// ============================================================
// NORMALIZE ONE ITEM
// ============================================================

function normalizeItem(
    item,
    index,
    oldBill
) {

    if (
        !item ||
        typeof item !== "object"
    ) {

        return null;
    }


    // --------------------------------------------------------
    // NAME
    // --------------------------------------------------------

    const name =
        cleanString(
            item.name ??
            item.drugs ??
            item.testname ??
            item.serviceName ??
            item.service ??
            item.description ??
            item.test ??
            item.scan
        );


    // --------------------------------------------------------
    // BillRequestItem.name is required
    // --------------------------------------------------------

    if (!name) {

        console.warn(
            `Skipping item ${index} in bill ${oldBill._id}: no name`
        );

        return null;
    }


    // --------------------------------------------------------
    // ITEM ID
    // --------------------------------------------------------

    const itemId =
        cleanString(
            item.id ??
            item.itemId ??
            item._id
        );


    // --------------------------------------------------------
    // QUANTITY
    // --------------------------------------------------------

    const quantity =
        toNumber(
            item.quantity ??
            item.qty
        ) ?? 1;


    // --------------------------------------------------------
    // UNIT PRICE
    // --------------------------------------------------------

    const unitPrice =
        toNumber(
            item.price ??
            item.unitPrice ??
            item.sellingPrice
        ) ?? 0;


    // --------------------------------------------------------
    // TOTAL PRICE
    // --------------------------------------------------------

    const explicitTotal =
        toNumber(
            item.totalPrice ??
            item.total ??
            item.Total
        );


    const totalPrice =
        explicitTotal !== null
            ? explicitTotal
            : (
                Number(quantity) *
                Number(unitPrice)
            );


    // --------------------------------------------------------
    // COST PRICE
    // --------------------------------------------------------

    const costPrice =
        toNumber(
            item.oprice ??
            item.costPrice ??
            item.originalPrice ??
            item.cost
        ) ?? 0;


    // --------------------------------------------------------
    // ACTUAL COST
    // --------------------------------------------------------
    //
    // actualCost is preserved as UNIT cost.
    //
    // calculatedCost later does:
    //
    // quantity × actualCost
    //
    // --------------------------------------------------------

    const actualCost =
        toNumber(
            item.actualPrice ??
            item.actualCost
        ) ?? 0;


    // --------------------------------------------------------
    // OTHER VALUES
    // --------------------------------------------------------

    const days =
        normalizeDays(
            item.days
        );


    const dosage =
        normalizeDosage(
            item.dosage
        );


    const frequency =
        cleanString(
            item.frequency ??
            item.freq
        );


    const time =
        cleanString(
            item.time
        );


    const status =
        cleanString(
            item.status
        );


    // --------------------------------------------------------
    // SERVICE TYPE
    // --------------------------------------------------------

    const serviceType =
        classifyService(
            item,
            oldBill
        );


    // --------------------------------------------------------
    // SOURCE TYPE
    // --------------------------------------------------------

    const sourceType =
        normalizeSourceType(
            item,
            oldBill
        );


    return {

        itemId,

        name,

        quantity,

        unitPrice,

        totalPrice,

        costPrice,

        actualCost,

        days,

        dosage,

        frequency,

        status,

        time,

        serviceType,

        sourceType
    };
}


// ============================================================
// FINANCIAL INFORMATION
// ============================================================

function extractFinancials(
    services,
    oldBill = null
) {

    const parsed =
        parseServices(
            services
        );


    /*
     * First try the services object.
     */
    let total = null;
    let actualCost = null;
    let profit = null;


    if (
        parsed &&
        !Array.isArray(parsed) &&
        typeof parsed === "object"
    ) {

        total =
            firstNumber(
                parsed.totalPrice,
                parsed.total,
                parsed.Total,
                parsed.amount
            );


        actualCost =
            firstNumber(
                parsed.actualPrice,
                parsed.actualCost,
                parsed.cost
            );


        profit =
            firstNumber(
                parsed.profit,
                parsed.Profit
            );
    }


    /*
     * Some old records can have financial values
     * directly on the bill.
     *
     * Preserve those if services did not contain them.
     */
    if (oldBill) {

        total =
            total !== null
                ? total
                : firstNumber(
                    oldBill.total,
                    oldBill.totalPrice,
                    oldBill.amount
                );


        actualCost =
            actualCost !== null
                ? actualCost
                : firstNumber(
                    oldBill.actualCost,
                    oldBill.actualPrice,
                    oldBill.cost
                );


        profit =
            profit !== null
                ? profit
                : firstNumber(
                    oldBill.profit
                );
    }


    return {

        total,

        actualCost,

        profit
    };
}


// ============================================================
// NORMALIZE BILL
// ============================================================

function normalizeBill(
    oldBill
) {

    const services =
        parseServices(
            oldBill.services
        );


    const rawItems =
        extractItems(
            services
        );


    const oldFinancials =
        extractFinancials(
            services,
            oldBill
        );


    // --------------------------------------------------------
    // Normalize items
    // --------------------------------------------------------

    const items =
        rawItems
            .map(
                (item, index) =>
                    normalizeItem(
                        item,
                        index,
                        oldBill
                    )
            )
            .filter(Boolean);


    // ========================================================
    // CALCULATED TOTAL
    // ========================================================

    const calculatedTotal =
        items.reduce(
            (
                total,
                item
            ) => {

                return (
                    total +
                    (
                        Number(
                            item.totalPrice
                        ) || 0
                    )
                );

            },
            0
        );


    // ========================================================
    // CALCULATED COST
    // ========================================================

    const calculatedCost =
        items.reduce(
            (
                total,
                item
            ) => {

                const cost =
                    Number(
                        item.actualCost
                    ) || 0;


                const quantity =
                    Number(
                        item.quantity
                    ) || 0;


                return (
                    total +
                    (
                        cost *
                        quantity
                    )
                );

            },
            0
        );


    // ========================================================
    // CALCULATED PROFIT
    // ========================================================

    const calculatedProfit =
        calculatedTotal -
        calculatedCost;


    // ========================================================
    // FINAL BILL TOTAL
    // ========================================================

    const finalTotal =
        oldFinancials.total !== null
            ? oldFinancials.total
            : calculatedTotal;


    // ========================================================
    // FINAL COST
    // ========================================================

    const finalActualCost =
        oldFinancials.actualCost !== null
            ? oldFinancials.actualCost
            : calculatedCost;


    // ========================================================
    // FINAL PROFIT
    // ========================================================

    const finalProfit =
        oldFinancials.profit !== null
            ? oldFinancials.profit
            : (
                finalTotal -
                finalActualCost
            );


    // ========================================================
    // DIFFERENCE
    // ========================================================

    const totalDifference =
        oldFinancials.total !== null
            ? (
                oldFinancials.total -
                calculatedTotal
            )
            : 0;


    const hasMismatch =
        oldFinancials.total !== null &&
        Math.abs(
            totalDifference
        ) > 0.001;


    // ========================================================
    // BILL DATE
    // ========================================================

    const billDate =
        toDate(
            oldBill.timeStamp
        ) ||
        toDate(
            oldBill.preTime
        ) ||
        toDate(
            oldBill.createdAt
        ) ||
        toDate(
            oldBill.updatedAt
        );


    // ========================================================
    // PRE TIME
    // ========================================================

    const preTime =
        toDate(
            oldBill.preTime
        ) ||
        toDate(
            oldBill.createdAt
        );


    // ========================================================
    // PATIENT UID
    // ========================================================

    const patientUid =
        cleanString(
            oldBill.uid ??
            oldBill.patient?.uid
        );


    // ========================================================
    // PATIENT TYPE
    // ========================================================

    const rawPatientType =
        normalizeText(
            firstDefined(
                oldBill.patientType,
                oldBill.patienttype,
                oldBill.patient?.type
            )
        );


    let patientType = null;


    if (
        rawPatientType === "INPATIENT"
    ) {

        patientType = "inpatient";

    } else if (
        rawPatientType === "OUTPATIENT"
    ) {

        patientType = "outpatient";

    } else if (
        rawPatientType === "EMERGENCY"
    ) {

        patientType = "emergency";
    }


    // ========================================================
    // STAFF
    // ========================================================

    let staffId = null;


    if (
        typeof oldBill.staff === "string" ||
        typeof oldBill.staff === "number"
    ) {

        staffId =
            cleanString(
                oldBill.staff
            );

    } else if (
        oldBill.staff &&
        typeof oldBill.staff === "object"
    ) {

        staffId =
            cleanString(
                oldBill.staff.staffId ??
                oldBill.staff.id ??
                oldBill.staff._id
            );
    }


    const doctorId =
        cleanString(
            oldBill.doctorID ??
            oldBill.doctorId ??
            oldBill.docID
        );


    const nurseId =
        cleanString(
            oldBill.nurseID ??
            oldBill.nurseId
        );


    // ========================================================
    // BILLING / PAYMENT MODE
    // ========================================================
    //
    // THIS IS WHERE CHURCH IS PRESERVED.
    //
    // Old:
    //
    //     mode: "CHURCH"
    //
    // New:
    //
    //     payment.mode: "CHURCH"
    //
    // Other modes such as:
    //
    //     cash
    //     pos
    //     transfer
    //
    // are preserved the same way.
    //
    // ========================================================

    const billingMode =
        cleanString(
            oldBill.mode ??
            oldBill.payment?.mode
        );


    // ========================================================
    // NEW BILL
    // ========================================================

    const bill = {

        patient: {

            uid:
                patientUid
        },


        /*
         * Only include patientType when the old data
         * actually contains one.
         */
        ...(patientType
            ? {
                patientType
            }
            : {}),


        type:
            cleanString(
                oldBill.type
            ) || "doc",


        status:
            cleanString(
                oldBill.status
            ) || "PENDING",


        payment: {

            /*
             * IMPORTANT:
             *
             * CHURCH remains here as a mode.
             */
            mode:
                billingMode,


            tag:
                cleanString(
                    oldBill.tag ??
                    oldBill.payment?.tag ??
                    oldBill.tagged
                )
        },


        staff: {

            staffId,

            doctorId,

            nurseId
        },


        financials: {

            total:
                finalTotal,

            actualCost:
                finalActualCost,

            profit:
                finalProfit,


            deposit:
                toNumber(
                    oldBill.deposit
                ) ?? 0,


            initialDeposit:
                toNumber(
                    oldBill.initialDeposit
                ) ?? 0,


            calculatedTotal,

            calculatedCost,

            calculatedProfit,

            totalDifference,

            hasMismatch
        },


        instruction:
            cleanString(
                oldBill.instruction
            ),


        billDate,


        preTime,


        legacy: {

            originalId:
                String(
                    oldBill._id
                ),

            originalCollection:
                "billrequests"
        }
    };


    return {

        bill,

        items
    };
}


// ============================================================
// CHECK ALREADY MIGRATED
// ============================================================

async function alreadyMigrated(
    originalId
) {

    const existing =
        await BillRequest
            .findOne({

                "legacy.originalId":
                    String(originalId)

            })
            .select("_id")
            .lean();


    return !!existing;
}


// ============================================================
// MIGRATE ONE BILL
// ============================================================

async function migrateOneBill(
    oldBill
) {

    // --------------------------------------------------------
    // Check duplicate
    // --------------------------------------------------------

    const exists =
        await alreadyMigrated(
            oldBill._id
        );


    if (exists) {

        return {

            skipped: true,

            items: 0,

            mismatch: false,

            isChurch: false,

            churchAmount: 0
        };
    }


    // --------------------------------------------------------
    // Normalize
    // --------------------------------------------------------

    const normalized =
        normalizeBill(
            oldBill
        );


    // --------------------------------------------------------
    // Create BillRequest
    // --------------------------------------------------------

    const newBill =
        await BillRequest.create(
            normalized.bill
        );


    // --------------------------------------------------------
    // Add parent ID to items
    // --------------------------------------------------------

    const items =
        normalized.items.map(
            item => ({

                ...item,

                billRequestId:
                    newBill._id
            })
        );


    // --------------------------------------------------------
    // Create items
    // --------------------------------------------------------

    if (
        items.length > 0
    ) {

        await BillRequestItem.insertMany(
            items,
            {
                ordered: true
            }
        );
    }


    // --------------------------------------------------------
    // CHURCH INFORMATION
    // --------------------------------------------------------

    const isChurch =
        normalizeText(
            oldBill.mode ??
            oldBill.payment?.mode
        ) === "CHURCH";


    const churchAmount =
        isChurch
            ? (
                Number(
                    normalized
                        .bill
                        .financials
                        .total
                ) || 0
            )
            : 0;


    return {

        skipped: false,

        items:
            items.length,

        mismatch:
            normalized
                .bill
                .financials
                .hasMismatch,

        isChurch,

        churchAmount
    };
}


// ============================================================
// MAIN MIGRATION
// ============================================================

async function migrateBillRequests() {

    console.log(
        "\n=========================================="
    );

    console.log(
        " BILL REQUEST MIGRATION"
    );

    console.log(
        "=========================================="
    );


    // --------------------------------------------------------
    // Check connection
    // --------------------------------------------------------

    if (
        mongoose.connection.readyState !== 1
    ) {

        throw new Error(
            "MongoDB is not connected."
        );
    }


    console.log(
        "MongoDB:",
        mongoose.connection.name
    );


    // --------------------------------------------------------
    // Count old records
    // --------------------------------------------------------

    const total =
        await billRequests.countDocuments();


    console.log(
        `Old billRequests records: ${total}`
    );


    if (
        total === 0
    ) {

        console.log(
            "No records to migrate."
        );

        return;
    }


    // --------------------------------------------------------
    // Counters
    // --------------------------------------------------------

    let processed = 0;

    let migrated = 0;

    let skipped = 0;

    let itemsCreated = 0;

    let mismatches = 0;

    let missingUid = 0;

    let errors = 0;


    /*
     * Service counters
     */
    const serviceCounts = {};


    /*
     * Financial totals calculated from items.
     */
    let calculatedSales = 0;

    let calculatedCost = 0;

    let calculatedProfit = 0;


    let labItems = 0;

    let scanItems = 0;


    /*
     * CHURCH is a billing/payment mode,
     * not a service type.
     */
    let churchBills = 0;

    let churchAmount = 0;


    const errorRecords = [];


    // --------------------------------------------------------
    // Stream old records
    // --------------------------------------------------------

    const cursor =
        billRequests
            .find({})
            .lean()
            .cursor();


    let batch = [];


    // ========================================================
    // PROCESS BATCHES
    // ========================================================

    for await (
        const oldBill of cursor
    ) {

        batch.push(
            oldBill
        );


        if (
            batch.length >=
            BATCH_SIZE
        ) {

            for (
                const bill of batch
            ) {

                processed++;


                try {

                    if (
                        !bill.uid &&
                        !bill.patient?.uid
                    ) {

                        missingUid++;
                    }


                    const result =
                        await migrateOneBill(
                            bill
                        );


                    if (
                        result.skipped
                    ) {

                        skipped++;

                    } else {

                        migrated++;

                        itemsCreated +=
                            result.items;


                        if (
                            result.mismatch
                        ) {

                            mismatches++;
                        }


                        // ------------------------------------------------
                        // CHURCH BILLING STATISTICS
                        // ------------------------------------------------

                        if (
                            result.isChurch
                        ) {

                            churchBills++;

                            churchAmount +=
                                result.churchAmount;
                        }


                        // ------------------------------------------------
                        // SERVICE STATISTICS
                        // ------------------------------------------------

                        const rawItems =
                            extractItems(
                                bill.services
                            );


                        for (
                            const item
                            of rawItems
                        ) {

                            const serviceType =
                                classifyService(
                                    item,
                                    bill
                                );


                            if (
                                serviceType
                            ) {

                                serviceCounts[
                                    serviceType
                                ] =
                                    (
                                        serviceCounts[
                                            serviceType
                                        ] || 0
                                    ) + 1;


                                if (
                                    serviceType === "lab"
                                ) {

                                    labItems++;
                                }


                                if (
                                    serviceType === "scan"
                                ) {

                                    scanItems++;
                                }
                            }
                        }


                        // ------------------------------------------------
                        // FINANCIAL STATISTICS
                        // ------------------------------------------------

                        const normalized =
                            normalizeBill(
                                bill
                            );


                        calculatedSales +=
                            normalized
                                .bill
                                .financials
                                .calculatedTotal;


                        calculatedCost +=
                            normalized
                                .bill
                                .financials
                                .calculatedCost;


                        calculatedProfit +=
                            normalized
                                .bill
                                .financials
                                .calculatedProfit;
                    }


                } catch (error) {

                    errors++;


                    errorRecords.push({

                        id:
                            bill._id,

                        message:
                            error.message

                    });


                    console.error(
                        `Failed migrating ${bill._id}:`,
                        error.message
                    );
                }
            }


            console.log(
                `Processed ${processed}/${total}`
            );


            batch = [];
        }
    }


    // ========================================================
    // REMAINING RECORDS
    // ========================================================

    for (
        const bill of batch
    ) {

        processed++;


        try {

            if (
                !bill.uid &&
                !bill.patient?.uid
            ) {

                missingUid++;
            }


            const result =
                await migrateOneBill(
                    bill
                );


            if (
                result.skipped
            ) {

                skipped++;

            } else {

                migrated++;

                itemsCreated +=
                    result.items;


                if (
                    result.mismatch
                ) {

                    mismatches++;
                }


                // ------------------------------------------------
                // CHURCH BILLING STATISTICS
                // ------------------------------------------------

                if (
                    result.isChurch
                ) {

                    churchBills++;

                    churchAmount +=
                        result.churchAmount;
                }


                // ------------------------------------------------
                // SERVICE STATISTICS
                // ------------------------------------------------

                const rawItems =
                    extractItems(
                        bill.services
                    );


                for (
                    const item
                    of rawItems
                ) {

                    const serviceType =
                        classifyService(
                            item,
                            bill
                        );


                    if (
                        serviceType
                    ) {

                        serviceCounts[
                            serviceType
                        ] =
                            (
                                serviceCounts[
                                    serviceType
                                ] || 0
                            ) + 1;


                        if (
                            serviceType === "lab"
                        ) {

                            labItems++;
                        }


                        if (
                            serviceType === "scan"
                        ) {

                            scanItems++;
                        }
                    }
                }


                // ------------------------------------------------
                // FINANCIAL STATISTICS
                // ------------------------------------------------

                const normalized =
                    normalizeBill(
                        bill
                    );


                calculatedSales +=
                    normalized
                        .bill
                        .financials
                        .calculatedTotal;


                calculatedCost +=
                    normalized
                        .bill
                        .financials
                        .calculatedCost;


                calculatedProfit +=
                    normalized
                        .bill
                        .financials
                        .calculatedProfit;
            }


        } catch (error) {

            errors++;


            errorRecords.push({

                id:
                    bill._id,

                message:
                    error.message

            });


            console.error(
                `Failed migrating ${bill._id}:`,
                error.message
            );
        }
    }


    // ========================================================
    // REPORT
    // ========================================================

    console.log(
        "\n=========================================="
    );

    console.log(
        " BILL REQUEST MIGRATION COMPLETE"
    );

    console.log(
        "=========================================="
    );


    console.log(
        "Total old records:",
        total
    );


    console.log(
        "Processed:",
        processed
    );


    console.log(
        "New bills created:",
        migrated
    );


    console.log(
        "Already migrated:",
        skipped
    );


    console.log(
        "Bill items created:",
        itemsCreated
    );


    console.log(
        "Financial mismatches:",
        mismatches
    );


    console.log(
        "Missing UID:",
        missingUid
    );


    console.log(
        "Errors:",
        errors
    );


    console.log(
        "Calculated sales from items:",
        calculatedSales
    );


    console.log(
        "Calculated cost from items:",
        calculatedCost
    );


    console.log(
        "Calculated profit from items:",
        calculatedProfit
    );


    console.log(
        "Lab items:",
        labItems
    );


    console.log(
        "Scan items:",
        scanItems
    );


    // ========================================================
    // CHURCH REPORT
    // ========================================================

    console.log(
        "\nCHURCH BILLING:"
    );


    console.log(
        "Church-mode bills:",
        churchBills
    );


    console.log(
        "Church-mode amount:",
        churchAmount
    );


    console.log(
        "\nSERVICE BREAKDOWN:"
    );


    Object.entries(
        serviceCounts
    )
    .forEach(
        (
            [
                service,
                count
            ]
        ) => {

            console.log(
                `${service}: ${count}`
            );
        }
    );


    if (
        errorRecords.length
    ) {

        console.log(
            "\nFirst migration errors:"
        );


        console.table(
            errorRecords.slice(
                0,
                50
            )
        );
    }


    console.log(
        "==========================================\n"
    );
}


// ============================================================
// EXPORT
// ============================================================

module.exports = {
    migrateBillRequests,

    /*
     * Useful for testing classification
     * without running the migration.
     */
    classifyService,

    normalizeItem,

    normalizeBill
};