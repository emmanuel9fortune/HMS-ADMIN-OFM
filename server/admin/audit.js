const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const BillRequestItem = require("../model/BillRequestItem");

const {
  Patient,
  staff,
  expenses,
} = require("../../model");
const BillRequest = require("../model/BillRequest");

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

/* =========================================================
   DATE HELPERS
========================================================= */

function validDate(value) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function startOfDay(date) {
  const d = new Date(date);

  d.setHours(0, 0, 0, 0);

  return d;
}

function endOfDay(date) {
  const d = new Date(date);

  d.setHours(23, 59, 59, 999);

  return d;
}

/*
  Preserves your old period options:

  7
  31
  62
  186
  356
*/
function periodRange(period) {
  const days = Number(period);

  if (!Number.isFinite(days) || days <= 0) {
    return null;
  }

  const end = endOfDay(new Date());

  const start = startOfDay(new Date());

  start.setDate(
    start.getDate() - days + 1
  );

  return {
    start,
    end,
  };
}

function monthRange(year, month) {
  const y = Number(year);
  const m = Number(month);

  if (
    !Number.isInteger(y) ||
    !Number.isInteger(m) ||
    m < 1 ||
    m > 12
  ) {
    return null;
  }

  return {
    start: new Date(
      y,
      m - 1,
      1,
      0,
      0,
      0,
      0
    ),

    end: new Date(
      y,
      m,
      0,
      23,
      59,
      59,
      999
    ),
  };
}

function yearRange(year) {
  const y = Number(year);

  if (!Number.isInteger(y)) {
    return null;
  }

  return {
    start: new Date(
      y,
      0,
      1,
      0,
      0,
      0,
      0
    ),

    end: new Date(
      y,
      11,
      31,
      23,
      59,
      59,
      999
    ),
  };
}

/*
  Priority:

  1. dateFrom/dateTo
  2. period
  3. month + year
  4. year
*/
function getDateRange(body) {
  const dateFrom = validDate(
    body.dateFrom
  );

  const dateTo = validDate(
    body.dateTo
  );

  if (dateFrom || dateTo) {
    return {
      start: startOfDay(
        dateFrom || dateTo
      ),

      end: endOfDay(
        dateTo || dateFrom
      ),
    };
  }

  if (body.period) {
    return periodRange(
      body.period
    );
  }

  if (
    body.month &&
    body.year
  ) {
    return monthRange(
      body.year,
      body.month
    );
  }

  if (body.year) {
    return yearRange(
      body.year
    );
  }

  return null;
}

/* =========================================================
   GENERAL HELPERS
========================================================= */

function unique(values) {
  return [
    ...new Set(
      values
        .filter(Boolean)
        .map(String)
    ),
  ];
}

function getPatientUid(bill) {
  return (
    bill.patient?.uid ||
    bill.uid ||
    null
  );
}

function getBillDate(bill) {
  /*
    IMPORTANT:

    billDate is the historical transaction date.

    createdAt is only a fallback.
  */
  return (
    bill.billDate ||
    bill.createdAt ||
    bill.updatedAt ||
    null
  );
}

function getStaffIds(bill) {
  const candidates = [
    bill.staff?.staffId,
    bill.staff?.doctorId,
    bill.staff?.nurseId,

    bill.actors?.createdBy,
    bill.actors?.paidBy,
    bill.actors?.dispensedBy,
    bill.actors?.completedBy,

    // Legacy compatibility
    typeof bill.staff === "string"
      ? bill.staff
      : null,

    typeof bill.staffID === "string"
      ? bill.staffID
      : null,
  ];

  return [
    ...new Set(
      candidates
        .filter(
          (value) =>
            typeof value === "string" &&
            value.trim() !== ""
        )
        .map((value) => value.trim())
    ),
  ];
}

function getPaymentMode(bill) {
  return (
    bill.payment?.mode ||
    bill.payment?.tag ||
    bill.mode ||
    null
  );
}

function getBillStatus(bill) {
  if (
    bill.payment?.status === "PAID"
  ) {
    return "PAID";
  }

  if (
    bill.payment?.status === "DEBTOR"
  ) {
    return "DEBTORS";
  }

  if (
    bill.workflow?.stage ===
    "AWAITING_PHARMACY"
  ) {
    return "AWAITING";
  }

  return (
    bill.status ||
    "PENDING"
  );
}

function getItemAmount(item) {
  const total = Number(
    item.totalPrice
  );

  if (
    Number.isFinite(total)
  ) {
    return total;
  }

  return (
    Number(item.quantity || 0) *
    Number(item.unitPrice || 0)
  );
}

function getItemCost(item) {
  const actualCost = Number(
    item.actualCost
  );

  if (
    Number.isFinite(actualCost)
  ) {
    return actualCost;
  }

  return (
    Number(item.quantity || 0) *
    Number(item.costPrice || 0)
  );
}

/* =========================================================
   SERVICE DETECTION
========================================================= */

/*
  New records should always have serviceType.

  This fallback exists because your existing migrated records
  may not have serviceType yet.
*/
function deriveServiceType(
  bill,
  item
) {
  if (item.serviceType) {
    return item.serviceType;
  }

  const billType = String(
    bill.type || ""
  ).toLowerCase();

  const sourceType = String(
    item.sourceType || ""
  ).toLowerCase();

  const itemName = String(
    item.name || ""
  ).toLowerCase();

  if (
    billType === "lab" ||
    sourceType === "lab"
  ) {
    return "lab";
  }

  if (
    billType === "scan" ||
    sourceType === "scan"
  ) {
    return "scan";
  }

  if (
    billType === "payout" ||
    sourceType === "payout"
  ) {
    return "payout";
  }

  if (
    bill.staff?.doctorId ||
    bill.doctorID ||
    bill.type === "doctor" ||
    sourceType === "doctor"
  ) {
    return "drugs";
  }

  if (
    bill.staff?.nurseId ||
    bill.nurseID ||
    bill.type === "nurse" ||
    sourceType === "nurse"
  ) {
    if (
      itemName.includes(
        "consum"
      ) ||
      itemName.includes(
        "syringe"
      ) ||
      itemName.includes(
        "glove"
      ) ||
      itemName.includes(
        "cotton"
      )
    ) {
      return "consumables";
    }

    return "utils";
  }

  if (
    bill.type === "consult" ||
    itemName.includes(
      "consult"
    )
  ) {
    return "consultation";
  }

  if (
    itemName.includes("card")
  ) {
    return "cards";
  }

  return null;
}

/* =========================================================
   STATUS FILTER
========================================================= */

function statusQuery(status) {
  if (!status) {
    return null;
  }

  const value =
    String(status).toUpperCase();

  if (value === "PAID") {
    return {
      $or: [
        {
          status: "PAID",
        },
        {
          "payment.status":
            "PAID",
        },
      ],
    };
  }

  if (
    value === "DEBTORS" ||
    value === "DEBTOR"
  ) {
    return {
      $or: [
        {
          status: "DEBTORS",
        },
        {
          "payment.status":
            "DEBTOR",
        },
      ],
    };
  }

  if (
    value === "AWAITING" ||
    value === "PHARMACY"
  ) {
    return {
      $or: [
        {
          status: "AWAITING",
        },
        {
          "workflow.stage":
            "AWAITING_PHARMACY",
        },
      ],
    };
  }

  if (
    value === "PENDING"
  ) {
    return {
      $or: [
        {
          status: "PENDING",
        },
        {
          "payment.status":
            "UNPAID",
        },
      ],
    };
  }

  return {
    $or: [
      {
        status: value,
      },
      {
        "workflow.stage":
          value,
      },
    ],
  };
}

/* =========================================================
   STAFF LIST
========================================================= */

router.get(
  "/staffs",
  async (req, res) => {
    try {
      const allStaffs =
        await staff.find({}).lean();

      return res.json({
        status: "success",

        staffs:
          allStaffs.map(
            (person) => ({
              ...person,

              id: String(
                person._id
              ),

              name:
                person.name ||
                person.fullName ||
                person.username ||
                "Unknown staff",
            })
          ),
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message:
          error.message,
      });
    }
  }
);

/* =========================================================
   MAIN AUDIT
========================================================= */

router.post(
  "/",
  async (req, res) => {
    try {
      const {
        dateFrom,
        dateTo,
        period,
        month,
        year,

        service,

        staff: staffId,

        paymentMode,

        /*
          mode is accepted for compatibility
          with your old React code.
        */
        mode,

        status,

        patientType,

        billType,

        search = "",

        page = 1,

        limit = 50,
      } = req.body;

      const selectedMode =
        paymentMode ||
        mode ||
        null;

      const currentPage =
        Math.max(
          1,
          Number(page) || 1
        );

      const pageLimit =
        Math.min(
          200,
          Math.max(
            1,
            Number(limit) || 50
          )
        );

      const query = {};

      /* =====================================================
         DATE
      ===================================================== */

      const range =
        getDateRange({
          dateFrom,
          dateTo,
          period,
          month,
          year,
        });

      if (range) {
        /*
          Use billDate first.

          Only use createdAt when billDate
          doesn't exist.
        */
        query.$or = [
          {
            billDate: {
              $gte: range.start,
              $lte: range.end,
            },
          },

          {
            billDate: null,

            createdAt: {
              $gte: range.start,
              $lte: range.end,
            },
          },
        ];
      }

      /* =====================================================
         STAFF
      ===================================================== */

      if (staffId) {
        query.$and = query.$and || [];

        query.$and.push({
            $or: [
            {
                "staff.staffId": String(staffId),
            },
            {
                "staff.doctorId": String(staffId),
            },
            {
                "staff.nurseId": String(staffId),
            },
            {
                "actors.createdBy": String(staffId),
            },
            {
                "actors.paidBy": String(staffId),
            },
            {
                "actors.dispensedBy": String(staffId),
            },
            {
                "actors.completedBy": String(staffId),
            },

            // Legacy field
            {
                staffID: String(staffId),
            },
            ],
        });
        }

      /* =====================================================
         PAYMENT MODE
      ===================================================== */

      if (selectedMode) {
        query.$and =
          query.$and || [];

        query.$and.push({
          $or: [
            {
              "payment.mode":
                selectedMode,
            },

            {
              "payment.tag":
                selectedMode,
            },

            /*
              Legacy compatibility.
            */
            {
              mode:
                selectedMode,
            },
          ],
        });
      }

      /* =====================================================
         PATIENT TYPE
      ===================================================== */

      if (patientType) {
        query.patientType =
          patientType;
      }

      /* =====================================================
         BILL TYPE
      ===================================================== */

      if (billType) {
        query.type =
          billType;
      }

      /* =====================================================
         STATUS
      ===================================================== */

      const statusFilter =
        statusQuery(status);

      if (statusFilter) {
        query.$and =
          query.$and || [];

        query.$and.push(
          statusFilter
        );
      }

      /* =====================================================
         SEARCH
      ===================================================== */

      const searchText =
        String(search || "")
          .trim();

      if (searchText) {
        const escaped =
          searchText.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          );

        const regex =
          new RegExp(
            escaped,
            "i"
          );

        const [
          patients,
          matchingItems,
        ] =
          await Promise.all([
            Patient.find({
              $or: [
                {
                  name: regex,
                },

                {
                  firstName:
                    regex,
                },

                {
                  lastName:
                    regex,
                },

                {
                  uid: regex,
                },
              ],
            })
              .select("_id")
              .lean(),

            BillRequestItem.find({
              $or: [
                {
                  name: regex,
                },

                {
                  itemId:
                    regex,
                },
              ],
            })
              .select(
                "billRequestId"
              )
              .lean(),
          ]);

        const patientIds =
          patients.map(
            (p) =>
              String(p._id)
          );

        const matchingBillIds =
          matchingItems.map(
            (item) =>
              String(
                item.billRequestId
              )
          );

        query.$and =
          query.$and || [];

        query.$and.push({
          $or: [
            {
              "patient.uid":
                {
                  $in:
                    patientIds,
                },
            },

            {
              uid: {
                $in:
                  patientIds,
              },
            },

            {
              _id: {
                $in:
                  matchingBillIds,
              },
            },
          ],
        });
      }

      /* =====================================================
         GET BILLS
      ===================================================== */

      const bills =
        await BillRequest.find(query)
          .sort({
            billDate: -1,
            createdAt: -1,
          })
          .lean();

      const billIds =
        bills.map(
          (bill) =>
            bill._id
        );

      /* =====================================================
         GET ITEMS + EXPENSES
      ===================================================== */

      const [
        items,
        expenseRows,
      ] = await Promise.all([
        billIds.length
          ? BillRequestItem.find({
              billRequestId: {
                $in:
                  billIds,
              },
            }).lean()
          : [],

        range
          ? expenses
              .find({
                time: {
                  $gte:
                    range.start.getTime(),

                  $lte:
                    range.end.getTime(),
                },
              })
              .lean()
          : expenses
              .find({})
              .lean(),
      ]);

      /* =====================================================
         ITEMS BY BILL
      ===================================================== */

      const itemsByBill =
        new Map();

      for (const item of items) {
        const id =
          String(
            item.billRequestId
          );

        if (
          !itemsByBill.has(id)
        ) {
          itemsByBill.set(
            id,
            []
          );
        }

        itemsByBill
          .get(id)
          .push(item);
      }

      /* =====================================================
         PATIENTS + STAFF
      ===================================================== */

      const patientIds =
        unique(
          bills.map(
            (bill) =>
              getPatientUid(
                bill
              )
          )
        );

      const staffIds = unique(
        bills.flatMap((bill) =>
            getStaffIds(bill)
        )
        ).filter((id) =>
        mongoose.Types.ObjectId.isValid(id)
        );

      const [
        patients,
        staffRows,
      ] =
        await Promise.all([
          patientIds.length
            ? Patient.find({
                _id: {
                  $in:
                    patientIds,
                },
              }).lean()
            : [],

          staffIds.length
            ? staff.find({
                _id: {
                  $in:
                    staffIds,
                },
              }).lean()
            : [],
        ]);

      const patientMap =
        new Map(
          patients.map(
            (patient) => [
              String(
                patient._id
              ),
              patient,
            ]
          )
        );

      const staffMap =
        new Map(
          staffRows.map(
            (person) => [
              String(
                person._id
              ),
              person,
            ]
          )
        );

      /* =====================================================
         TRANSACTIONS
      ===================================================== */

      let transactions = [];

      for (
        const bill of bills
      ) {
        const billItems =
          itemsByBill.get(
            String(
              bill._id
            )
          ) || [];

        const uid =
          getPatientUid(
            bill
          );

        const patient =
          patientMap.get(
            String(uid)
          ) || null;

        const currentStatus =
          getBillStatus(
            bill
          );

        const currentMode =
          getPaymentMode(
            bill
          );

        const billStaffIds =
          getStaffIds(
            bill
          );

        const resolvedStaff =
          billStaffIds
            .map(
              (id) =>
                staffMap.get(
                  String(id)
                )
            )
            .filter(Boolean);

        /*
          A bill without items still appears.

          This is useful for payouts and some
          legacy bills.
        */
        if (
          billItems.length ===
          0
        ) {
          const serviceType =
            deriveServiceType(
              bill,
              {}
            );

          if (
            service &&
            serviceType !==
              service
          ) {
            continue;
          }

          transactions.push({
            id: String(
              bill._id
            ),

            billId: String(
              bill._id
            ),

            itemId: null,

            date:
              getBillDate(
                bill
              ),

            patient: {
              id:
                uid || null,

              uid:
                uid || null,

              name:
                patient?.name ||
                (
                  `${patient?.firstName || ""} ${patient?.lastName || ""}`
                ).trim() ||
                "Unknown",
            },

            purpose:
              bill.instruction ||
              bill.type ||
              "Bill",

            service:
              serviceType ||
              bill.type ||
              "other",

            quantity: 1,

            amount:
              Number(
                bill.financials
                  ?.total || 0
              ),

            cost:
              Number(
                bill.financials
                  ?.actualCost ||
                  0
              ),

            profit:
              Number(
                bill.financials
                  ?.profit ??
                  (
                    Number(
                      bill.financials
                        ?.total ||
                        0
                    ) -
                    Number(
                      bill.financials
                        ?.actualCost ||
                        0
                    )
                  )
              ),

            mode:
              currentMode,

            status:
              currentStatus,

            billType:
              bill.type,

            patientType:
              bill.patientType,

            staff:
              resolvedStaff.map(
                (person) => ({
                  id: String(
                    person._id
                  ),

                  name:
                    person.name ||
                    person.fullName ||
                    person.username ||
                    "Unknown staff",
                })
              ),

            financialMismatch:
              Boolean(
                bill.financials
                  ?.hasMismatch
              ),
          });

          continue;
        }

        /*
          One audit transaction per item.

          This makes service filtering accurate.
        */
        for (
          const item of billItems
        ) {
          const serviceType =
            deriveServiceType(
              bill,
              item
            );

          if (
            service &&
            serviceType !==
              service
          ) {
            continue;
          }

          const amount =
            getItemAmount(
              item
            );

          const cost =
            getItemCost(
              item
            );

          transactions.push({
            id:
              `${String(
                bill._id
              )}:${String(
                item._id
              )}`,

            billId:
              String(
                bill._id
              ),

            itemId:
              item.itemId ||
              String(
                item._id
              ),

            date:
              getBillDate(
                bill
              ),

            patient: {
              id:
                uid || null,

              uid:
                uid || null,

              name:
                patient?.name ||
                (
                  `${patient?.firstName || ""} ${patient?.lastName || ""}`
                ).trim() ||
                "Unknown",
            },

            purpose:
              item.name,

            service:
              serviceType ||
              bill.type ||
              "other",

            quantity:
              Number(
                item.quantity || 0
              ),

            unitPrice:
              Number(
                item.unitPrice || 0
              ),

            amount,

            cost,

            profit:
              amount - cost,

            mode:
              currentMode,

            status:
              currentStatus,

            billType:
              bill.type,

            patientType:
              bill.patientType,

            staff:
              resolvedStaff.map(
                (person) => ({
                  id: String(
                    person._id
                  ),

                  name:
                    person.name ||
                    person.fullName ||
                    person.username ||
                    "Unknown staff",
                })
              ),

            financialMismatch:
              Boolean(
                bill.financials
                  ?.hasMismatch
              ),
          });
        }
      }

      /*
        Final staff check.

        This is useful for old/migrated documents.
      */
      if (staffId) {
        transactions =
          transactions.filter(
            (transaction) =>
              transaction.staff?.some(
                (person) =>
                  String(
                    person.id
                  ) ===
                  String(
                    staffId
                  )
              )
          );
      }

      /* =====================================================
         SORT
      ===================================================== */

      transactions.sort(
        (a, b) =>
          new Date(
            b.date || 0
          ).getTime() -
          new Date(
            a.date || 0
          ).getTime()
      );

      /* =====================================================
         FINANCIAL SUMMARY
      ===================================================== */

      const grossSales =
        transactions.reduce(
          (
            total,
            transaction
          ) =>
            total +
            Number(
              transaction.amount ||
                0
            ),
          0
        );

      const cost =
        transactions.reduce(
          (
            total,
            transaction
          ) =>
            total +
            Number(
              transaction.cost ||
                0
            ),
          0
        );

      const profit =
        grossSales - cost;

      const paidAmount =
        transactions
          .filter(
            (transaction) =>
              transaction.status ===
              "PAID"
          )
          .reduce(
            (
              total,
              transaction
            ) =>
              total +
              Number(
                transaction.amount ||
                  0
              ),
            0
          );

      const outstanding =
        transactions
          .filter(
            (transaction) =>
              transaction.status ===
              "DEBTORS"
          )
          .reduce(
            (
              total,
              transaction
            ) =>
              total +
              Number(
                transaction.amount ||
                  0
              ),
            0
          );

      const expenseTotal =
        expenseRows.reduce(
          (
            total,
            expense
          ) => {
            const amount =
              Number(
                expense.amount
              ) ||
              Number(
                expense.total
              ) ||
              Number(
                expense.cost
              ) ||
              Number(
                expense.price
              ) ||
              0;

            return (
              total + amount
            );
          },
          0
        );

      const netProfit =
        profit -
        expenseTotal;

      /* =====================================================
         BILL COUNTS
      ===================================================== */

      const billIdsUsed =
        unique(
          transactions.map(
            (transaction) =>
              transaction.billId
          )
        );

      const filteredBills =
        bills.filter(
          (bill) =>
            billIdsUsed.includes(
              String(
                bill._id
              )
            )
        );

      const counts = {
        totalBills:
          filteredBills.length,

        paid:
          filteredBills.filter(
            (bill) =>
              getBillStatus(
                bill
              ) === "PAID"
          ).length,

        pending:
          filteredBills.filter(
            (bill) =>
              getBillStatus(
                bill
              ) === "PENDING"
          ).length,

        debtors:
          filteredBills.filter(
            (bill) =>
              getBillStatus(
                bill
              ) === "DEBTORS"
          ).length,

        awaitingPharmacy:
          filteredBills.filter(
            (bill) =>
              getBillStatus(
                bill
              ) === "AWAITING"
          ).length,

        completed:
          filteredBills.filter(
            (bill) =>
              bill.workflow
                ?.stage ===
                "COMPLETED" ||
              bill.status ===
                "PAID"
          ).length,
      };

      /* =====================================================
         SERVICE BREAKDOWN
      ===================================================== */

      const breakdown = {};

      for (
        const transaction of
          transactions
      ) {
        const key =
          transaction.service ||
          "other";

        breakdown[key] =
          (
            breakdown[key] ||
            0
          ) +
          Number(
            transaction.amount ||
              0
          );
      }

      /* =====================================================
         PAYMENT MODE BREAKDOWN
      ===================================================== */

      const paymentModes = {};

      for (
        const transaction of
          transactions
      ) {
        const key =
          transaction.mode ||
          "unknown";

        paymentModes[key] =
          (
            paymentModes[key] ||
            0
          ) +
          Number(
            transaction.amount ||
              0
          );
      }

      /* =====================================================
         STAFF BREAKDOWN
      ===================================================== */

      const staffBreakdown =
        {};

      for (
        const transaction of
          transactions
      ) {
        for (
          const person of
            transaction.staff ||
            []
        ) {
          const id =
            String(
              person.id
            );

          if (
            !staffBreakdown[
              id
            ]
          ) {
            staffBreakdown[
              id
            ] = {
              id,

              name:
                person.name,

              amount: 0,

              transactions: 0,
            };
          }

          staffBreakdown[
            id
          ].amount +=
            Number(
              transaction.amount ||
                0
            );

          staffBreakdown[
            id
          ].transactions += 1;
        }
      }

      /* =====================================================
         PAGINATION
      ===================================================== */

      const total =
        transactions.length;

      const startIndex =
        (currentPage - 1) *
        pageLimit;

      const pageTransactions =
        transactions.slice(
          startIndex,
          startIndex +
            pageLimit
        );

      /* =====================================================
         RESPONSE
      ===================================================== */

      return res.json({
        status: "success",

        filters: {
          dateFrom:
            range?.start ||
            null,

          dateTo:
            range?.end ||
            null,

          period:
            period || null,

          month:
            month || null,

          year:
            year || null,

          service:
            service || null,

          staff:
            staffId || null,

          paymentMode:
            selectedMode ||
            null,

          status:
            status || null,

          patientType:
            patientType ||
            null,

          billType:
            billType || null,

          search:
            searchText,
        },

        summary: {
          grossSales,

          amountPaid:
            paidAmount,

          outstanding,

          cost,

          profit,

          expenses:
            expenseTotal,

          netProfit,
        },

        counts,

        breakdown,

        paymentModes,

        staffBreakdown:
          Object.values(
            staffBreakdown
          ).sort(
            (a, b) =>
              b.amount -
              a.amount
          ),

        transactions:
          pageTransactions,

        services:
          SERVICE_TYPES,

        staffs:
          staffRows.map(
            (person) => ({
              id: String(
                person._id
              ),

              name:
                person.name ||
                person.fullName ||
                person.username ||
                "Unknown staff",
            })
          ),

        expenses:
          expenseRows,

        pagination: {
          page:
            currentPage,

          limit:
            pageLimit,

          total,

          pages:
            Math.ceil(
              total /
                pageLimit
            ),
        },
      });
    } catch (error) {
      console.error(
        "AUDIT ERROR:",
        error
      );

      return res.status(
        500
      ).json({
        status: "error",
        message:
          error.message,
      });
    }
  }
);

module.exports = router;
