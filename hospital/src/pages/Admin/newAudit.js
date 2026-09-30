import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
/*
  If axios already has a configured baseURL,
  leave this as "".

  Otherwise put your server URL here, for example:
  const API_BASE = "http://localhost:5000";
*/
const API_BASE = "http://localhost:7700";

const SERVICE_OPTIONS = [
  {
    value: "",
    label: "All Services",
  },
  {
    value: "drugs",
    label: "Drugs",
  },
  {
    value: "utils",
    label: "Utils",
  },
  {
    value: "consumables",
    label: "Consumables",
  },
  {
    value: "cards",
    label: "Cards",
  },
  {
    value: "consultation",
    label: "Consultation",
  },
  {
    value: "lab",
    label: "Laboratory",
  },
  {
    value: "scan",
    label: "Scan",
  },
  {
    value: "payout",
    label: "Payout",
  },
  {
    value: "BLOOD",
    label: "BLOOD",
  },
  {
    value: "OXYGEN",
    label: "OXYGEN",
  },
  {
    value: "PROFESSIONAL",
    label: "PROFESSIONAL",
  },
  {
    value: "NURSING",
    label: "NURSING",
  },
  {
    value: "BED",
    label: "BED",
  },
  {
    value: "DELIVERY FEES",
    label: "DELIVERY FEES",
  },
  {
    value: "PROCEDURE FEES",
    label: "PROCEDURE FEES",
  },
  {
    value: "discount",
    label: "Discount",
  },
];

const PERIOD_OPTIONS = [
  {
    value: "",
    label: "Custom Date",
  },
  {
    value: "7",
    label: "Last 7 Days",
  },
  {
    value: "31",
    label: "Last 31 Days",
  },
  {
    value: "62",
    label: "Last 62 Days",
  },
  {
    value: "186",
    label: "Last 186 Days",
  },
  {
    value: "356",
    label: "Last 356 Days",
  },
];

const MODE_OPTIONS = [
  {
    value: "",
    label: "All Payment Modes",
  },
  {
    value: "cash",
    label: "Cash",
  },
  {
    value: "pos",
    label: "POS",
  },
  {
    value: "transfer",
    label: "Transfer",
  },
  {
    value: "CHURCH",
    label: "Church",
  },
];

const STATUS_OPTIONS = [
  {
    value: "",
    label: "All Statuses",
  },
  {
    value: "PAID",
    label: "Paid",
  },
  {
    value: "PENDING",
    label: "Pending",
  },
  {
    value: "DEBTORS",
    label: "Debtors",
  },
  {
    value: "AWAITING",
    label: "Awaiting Pharmacy",
  },
];

const BILL_TYPES = [
  {
    value: "",
    label: "All Bill Types",
  },
  {
    value: "doctor",
    label: "Doctor",
  },
  {
    value: "nurse",
    label: "Nurse",
  },
  {
    value: "lab",
    label: "Laboratory",
  },
  {
    value: "scan",
    label: "Scan",
  },
  {
    value: "pharmacy",
    label: "Pharmacy",
  },
  {
    value: "consult",
    label: "Consultation",
  },
  {
    value: "payout",
    label: "Payout",
  },
];

function money(value) {
  return new Intl.NumberFormat(
    "en-NG",
    {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 2,
    }
  ).format(
    Number(value || 0)
  );
}

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "-";
  }

  return date.toLocaleString(
    "en-NG",
    {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

function dateInputValue(value) {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function label(value) {
  if (!value) return "-";

  return String(value)
    .replace(
      /_/g,
      " "
    )
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );
}

function defaultDates() {
  const today =
    new Date();

  const from =
    new Date(today);

  from.setDate(
    today.getDate() - 6
  );

  return {
    from:
      dateInputValue(
        from
      ),

    to:
      dateInputValue(
        today
      ),
  };
}

export default function Audits() {
  const defaults =
    defaultDates();

  /* =====================================================
     FILTERS
  ===================================================== */

  const [dateFrom, setDateFrom] =
    useState(
      defaults.from
    );

  const [dateTo, setDateTo] =
    useState(
      defaults.to
    );

  const [period, setPeriod] =
    useState("");

  const [month, setMonth] =
    useState("");

  const [year, setYear] =
    useState(
      String(
        new Date().getFullYear()
      )
    );

  const [service, setService] =
    useState("");

  const [staffId, setStaffId] =
    useState("");

  const [
    paymentMode,
    setPaymentMode,
  ] = useState("");

  const [status, setStatus] =
    useState("");

  const [
    patientType,
    setPatientType,
  ] = useState("");

  const [
    billType,
    setBillType,
  ] = useState("");

  const [search, setSearch] =
    useState("");

  /* =====================================================
     DATA
  ===================================================== */

  const [staffs, setStaffs] =
    useState([]);

  const [
    transactions,
    setTransactions,
  ] = useState([]);

  const [
    expenses,
    setExpenses,
  ] = useState([]);

  const [summary, setSummary] =
    useState({
      grossSales: 0,
      amountPaid: 0,
      outstanding: 0,
      cost: 0,
      profit: 0,
      expenses: 0,
      netProfit: 0,
    });

  const [counts, setCounts] =
    useState({
      totalBills: 0,
      paid: 0,
      pending: 0,
      debtors: 0,
      awaitingPharmacy: 0,
      completed: 0,
    });

  const [
    breakdown,
    setBreakdown,
  ] = useState({});

  const [
    paymentBreakdown,
    setPaymentBreakdown,
  ] = useState({});

  /* =====================================================
     UI
  ===================================================== */

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [
    pagination,
    setPagination,
  ] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0,
  });

  const [
    lastUpdated,
    setLastUpdated,
  ] = useState(null);

  const limit = 50;

  /* =====================================================
     PAYLOAD
  ===================================================== */

  const buildPayload =
    useCallback(
      (requestedPage = 1) => {
        const payload = {
          page:
            requestedPage,

          limit,

          dateFrom:
            dateFrom || null,

          dateTo:
            dateTo || null,

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
            paymentMode || null,

          status:
            status || null,

          patientType:
            patientType || null,

          billType:
            billType || null,

          search:
            search.trim(),
        };

        /*
          Period overrides normal date selection.
        */
        if (period) {
          payload.dateFrom =
            null;

          payload.dateTo =
            null;

          payload.month =
            null;

          payload.year =
            null;
        }

        /*
          Month/year overrides normal dates.
        */
        else if (month) {
          payload.dateFrom =
            null;

          payload.dateTo =
            null;

          payload.period =
            null;
        }

        /*
          Year alone means full year.
        */
        else if (year) {
          payload.dateFrom =
            null;

          payload.dateTo =
            null;

          payload.period =
            null;
        }

        return payload;
      },
      [
        dateFrom,
        dateTo,
        period,
        month,
        year,
        service,
        staffId,
        paymentMode,
        status,
        patientType,
        billType,
        search,
      ]
    );

  /* =====================================================
     STAFF
  ===================================================== */

  const loadStaffs =
    useCallback(
      async () => {
        try {
          const response =
            await axios.get(
              `${API_BASE}/main-audit/staffs`
            );

          if (
            response.data
              ?.status ===
            "success"
          ) {
            setStaffs(
              response.data
                .staffs || []
            );
          }
        } catch (error) {
          console.error(
            "STAFF AUDIT ERROR:",
            error
          );
        }
      },
      []
    );

  /* =====================================================
     AUDIT REQUEST
  ===================================================== */

  const loadAudit =
    useCallback(
      async (
        requestedPage = 1
      ) => {
        try {
          setLoading(true);
          setError("");

          const payload =
            buildPayload(
              requestedPage
            );

          const response =
            await axios.post(
              `${API_BASE}/main-audit`,
              payload
            );

          const data =
            response.data;

          if (
            data?.status !==
            "success"
          ) {
            throw new Error(
              data?.message ||
                "Unable to load audit"
            );
          }

          setTransactions(
            data.transactions ||
              []
          );

          setExpenses(
            data.expenses ||
              []
          );

          setSummary({
            grossSales:
              Number(
                data.summary
                  ?.grossSales
              ) || 0,

            amountPaid:
              Number(
                data.summary
                  ?.amountPaid
              ) || 0,

            outstanding:
              Number(
                data.summary
                  ?.outstanding
              ) || 0,

            cost:
              Number(
                data.summary
                  ?.cost
              ) || 0,

            profit:
              Number(
                data.summary
                  ?.profit
              ) || 0,

            expenses:
              Number(
                data.summary
                  ?.expenses
              ) || 0,

            netProfit:
              Number(
                data.summary
                  ?.netProfit
              ) || 0,
          });

          setCounts({
            totalBills:
              Number(
                data.counts
                  ?.totalBills
              ) || 0,

            paid:
              Number(
                data.counts
                  ?.paid
              ) || 0,

            pending:
              Number(
                data.counts
                  ?.pending
              ) || 0,

            debtors:
              Number(
                data.counts
                  ?.debtors
              ) || 0,

            awaitingPharmacy:
              Number(
                data.counts
                  ?.awaitingPharmacy
              ) || 0,

            completed:
              Number(
                data.counts
                  ?.completed
              ) || 0,
          });

          setBreakdown(
            data.breakdown ||
              {}
          );

          setPaymentBreakdown(
            data.paymentModes ||
              {}
          );

          setPagination(
            data.pagination || {
              page:
                requestedPage,

              limit,

              total: 0,

              pages: 0,
            }
          );

          if (
            Array.isArray(
              data.staffs
            )
          ) {
            setStaffs(
              data.staffs
            );
          }

          setPage(
            requestedPage
          );

          setLastUpdated(
            new Date()
          );
        } catch (error) {
          console.error(
            "AUDIT ERROR:",
            error
          );

          setError(
            error.response
              ?.data
              ?.message ||
              error.message ||
              "Unable to load audit"
          );
        } finally {
          setLoading(false);
        }
      },
      [
        buildPayload,
      ]
    );

  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    loadStaffs();
    loadAudit(1);
  }, []);

  /* =====================================================
     FILTER HANDLERS
  ===================================================== */

  const applyFilters =
    () => {
      loadAudit(1);
    };

  const resetFilters =
    () => {
      const fresh =
        defaultDates();

      setDateFrom(
        fresh.from
      );

      setDateTo(
        fresh.to
      );

      setPeriod("");

      setMonth("");

      setYear(
        String(
          new Date().getFullYear()
        )
      );

      setService("");

      setStaffId("");

      setPaymentMode("");

      setStatus("");

      setPatientType("");

      setBillType("");

      setSearch("");

      /*
        Load with explicit default
        filters rather than waiting
        for React state to update.
      */
      setTimeout(() => {
        loadAudit(1);
      }, 0);
    };

  const changePeriod =
    (value) => {
      setPeriod(value);

      if (value) {
        setDateFrom("");
        setDateTo("");
        setMonth("");
        setYear("");
      }
    };

  const changeMonth =
    (value) => {
      setMonth(value);

      if (value) {
        setDateFrom("");
        setDateTo("");
        setPeriod("");

        if (!year) {
          setYear(
            String(
              new Date()
                .getFullYear()
            )
          );
        }
      }
    };

  const changeYear =
    (value) => {
      setYear(value);

      if (value) {
        setDateFrom("");
        setDateTo("");
        setPeriod("");
      }
    };

  /* =====================================================
     CURRENT PAGE TOTAL
  ===================================================== */

  const currentPageTotal =
    useMemo(
      () =>
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
        ),
      [transactions]
    );

  /* =====================================================
     CSV & PDF
  ===================================================== */

    const [exporting, setExporting] = useState(false);
    const [exportType, setExportType] = useState("");
    const [exportProgress, setExportProgress] = useState(0);
    const [exportCount, setExportCount] = useState(0);
    const [exportTotal, setExportTotal] = useState(0);
    const [exportStatus, setExportStatus] = useState("");

 // ============================================================
// COMPLETE AUDIT EXPORT SYSTEM
// ============================================================

// Your actual audit component uses:
// date      = start timestamp
// enddate   = end timestamp
// sort      = service filter
// staff     = staff filter
// mode      = payment mode
// status    = status
// searchText = search text
// cip       = server hostname

    const getAuditExportFilters = () => {
        return {
            ...buildPayload(1),

            // We will override these when fetching pages
            page: 1,

            // Large page size for export
            limit: 1000,
        };
    };


// ============================================================
// FETCH ALL AUDIT TRANSACTIONS
// ============================================================

// ============================================================
// FETCH ALL AUDIT TRANSACTIONS
// ============================================================

    const fetchAllAuditTransactions = async () => {
        try {
            const basePayload = getAuditExportFilters();

            const allTransactions = [];

            let page = 1;
            const limit = 1000;

            setExportProgress(0);
            setExportCount(0);
            setExportTotal(0);
            setExportStatus("Connecting to audit server...");

            while (true) {
                setExportStatus(
                    `Fetching audit records... Page ${page}`
                );

                const payload = {
                    ...basePayload,
                    page,
                    limit,
                };

                const response = await axios.post(
                    `${API_BASE}/main-audit`,
                    payload
                );

                const data = response?.data;

                if (!data) {
                    throw new Error(
                        "No response was received from the audit server."
                    );
                }

                if (data.status !== "success") {
                    throw new Error(
                        data.message || "Audit export request failed."
                    );
                }

                const pageTransactions =
                    Array.isArray(data.transactions)
                        ? data.transactions
                        : Array.isArray(data.data)
                            ? data.data
                            : [];

                allTransactions.push(...pageTransactions);

                const pagination = data.pagination || {};

                const total = Number(
                    pagination.total ??
                    data.total ??
                    0
                );

                const currentPage = Number(
                    pagination.page ?? page
                );

                const pageLimit = Number(
                    pagination.limit ?? limit
                );

                const totalPages = Number(
                    pagination.totalPages ??
                    (
                        total > 0
                            ? Math.ceil(total / pageLimit)
                            : 0
                    )
                );

                setExportTotal(total || allTransactions.length);
                setExportCount(allTransactions.length);

                if (total > 0) {
                    const progress = Math.min(
                        100,
                        Math.round(
                            (allTransactions.length / total) * 100
                        )
                    );

                    setExportProgress(progress);
                }

                if (totalPages > 0) {
                    if (currentPage >= totalPages) {
                        break;
                    }
                } else {
                    if (pageTransactions.length < limit) {
                        break;
                    }
                }

                page++;

                if (page > 10000) {
                    throw new Error(
                        "Export stopped because too many pages were returned."
                    );
                }
            }

            setExportProgress(100);
            setExportCount(allTransactions.length);

            return allTransactions;

        } catch (error) {
            console.error(
                "FETCH ALL AUDIT TRANSACTIONS ERROR:",
                error
            );

            throw error;
        }
    };


// ============================================================
// CSV ESCAPER
// ============================================================

    const escapeCSV = (value) => {

        const text = String(
            value ?? ""
        );

        if (
            text.includes(",") ||
            text.includes('"') ||
            text.includes("\n") ||
            text.includes("\r")
        ) {
            return `"${text.replace(
                /"/g,
                '""'
            )}"`;
        }

        return text;
    };


// ============================================================
// FORMAT DATE
// ============================================================

    const formatExportDate = (value) => {

        if (!value) {
            return "";
        }

        const parsed =
            new Date(value);

        if (
            Number.isNaN(
                parsed.getTime()
            )
        ) {
            return "";
        }

        return parsed.toLocaleString(
            "en-NG"
        );
    };


// ============================================================
// GET STAFF NAME
// ============================================================

    const getExportStaffName = (
        transaction
    ) => {

        if (
            typeof transaction?.staff ===
            "string"
        ) {
            return transaction.staff;
        }

        if (
            transaction?.staff?.name
        ) {
            return transaction.staff.name;
        }

        if (
            transaction?.staff?.staffId
        ) {
            return transaction.staff.staffId;
        }

        if (
            transaction?.staff?.doctorId
        ) {
            return transaction.staff.doctorId;
        }

        if (
            transaction?.staff?.nurseId
        ) {
            return transaction.staff.nurseId;
        }

        if (
            Array.isArray(
                transaction?.staff
            )
        ) {

            return transaction.staff
                .map(person => {

                    if (
                        typeof person ===
                        "string"
                    ) {
                        return person;
                    }

                    return (
                        person?.name ||
                        person?.staffId ||
                        person?.doctorId ||
                        person?.nurseId ||
                        ""
                    );
                })
                .filter(Boolean)
                .join(" | ");
        }

        return "";
    };


// ============================================================
// NORMALIZE TRANSACTION FOR EXPORT
// USES THE SAME DATA STRUCTURE AS THE MAIN AUDIT TABLE
// ============================================================

    const normalizeExportTransaction = (transaction) => {
        // --------------------------------------------------------
        // PATIENT
        // --------------------------------------------------------

        const patientName =
            transaction?.patient?.name ||
            transaction?.patientName ||
            "";

        const patientUid =
            transaction?.patient?.uid ||
            transaction?.uid ||
            "";

        // --------------------------------------------------------
        // ITEM / PURPOSE
        // --------------------------------------------------------

        const itemName =
            transaction?.item?.name ||
            transaction?.itemName ||
            transaction?.name ||
            transaction?.purpose ||
            "";

        const purpose =
            transaction?.purpose ||
            itemName ||
            "";

        // --------------------------------------------------------
        // SERVICE
        // --------------------------------------------------------

        const service =
            transaction?.service ||
            transaction?.serviceType ||
            "";

        // --------------------------------------------------------
        // QUANTITY
        // --------------------------------------------------------

        const quantity = Number(
            transaction?.quantity ?? 1
        );

        // --------------------------------------------------------
        // UNIT PRICE
        // --------------------------------------------------------

        let unitPrice = Number(
            transaction?.unitPrice
        );

        if (!Number.isFinite(unitPrice)) {
            unitPrice =
                quantity > 0
                    ? Number(transaction?.amount || 0) / quantity
                    : Number(transaction?.amount || 0);
        }

        // --------------------------------------------------------
        // TOTAL SELLING PRICE
        // --------------------------------------------------------

        const total = Number(
            transaction?.amount ??
            transaction?.total ??
            transaction?.totalPrice ??
            0
        );

        // --------------------------------------------------------
        // TOTAL COST
        // --------------------------------------------------------

        let totalCost = Number(
            transaction?.cost ??
            transaction?.actualCost ??
            0
        );

        // --------------------------------------------------------
        // UNIT COST
        //
        // If backend sends actualCost as a UNIT cost, calculate
        // total cost using quantity.
        // If backend already sends cost as total cost, use cost.
        // --------------------------------------------------------

        let unitCost = Number(
            transaction?.unitCost
        );

        if (!Number.isFinite(unitCost)) {
            unitCost =
                quantity > 0
                    ? totalCost / quantity
                    : totalCost;
        }

        // --------------------------------------------------------
        // PROFIT
        // --------------------------------------------------------

        let profit = Number(
            transaction?.profit
        );

        if (!Number.isFinite(profit)) {
            profit =
                total -
                totalCost;
        }

        // --------------------------------------------------------
        // STAFF
        // SAME STAFF ARRAY USED BY YOUR TABLE
        // --------------------------------------------------------

        let staffName = "";

        if (Array.isArray(transaction?.staff)) {
            staffName = transaction.staff
                .map((person) => {
                    if (typeof person === "string") {
                        return person;
                    }

                    return (
                        person?.name ||
                        person?.staffName ||
                        person?.staffId ||
                        person?.doctorId ||
                        person?.nurseId ||
                        ""
                    );
                })
                .filter(Boolean)
                .join(", ");
        } else if (
            typeof transaction?.staff === "string"
        ) {
            staffName = transaction.staff;
        } else if (transaction?.staff) {
            staffName =
                transaction.staff?.name ||
                transaction.staff?.staffName ||
                transaction.staff?.staffId ||
                transaction.staff?.doctorId ||
                transaction.staff?.nurseId ||
                "";
        }

        // --------------------------------------------------------
        // PAYMENT
        // --------------------------------------------------------

        const paymentMode =
            transaction?.mode ||
            transaction?.paymentMode ||
            transaction?.payment?.mode ||
            "";

        // --------------------------------------------------------
        // STATUS
        // --------------------------------------------------------

        const transactionStatus =
            transaction?.status ||
            transaction?.payment?.status ||
            "";

        // --------------------------------------------------------
        // RETURN COMPLETE EXPORT OBJECT
        // --------------------------------------------------------

        return {
            date: formatExportDate(
                transaction?.date ||
                transaction?.billDate ||
                transaction?.createdAt
            ),

            patientName,

            uid: patientUid,

            service,

            item: itemName,

            purpose,

            quantity,

            unitPrice,

            total,

            totalCost,

            unitCost,

            profit,

            staffName,

            paymentMode,

            status: transactionStatus,

            patientType:
                transaction?.patientType ||
                "",

            billType:
                transaction?.billType ||
                transaction?.type ||
                "",
        };
    };


// ============================================================
// CSV EXPORT
// ============================================================

    // ============================================================
// CSV EXPORT
// ============================================================

    const downloadCSV = async () => {
        try {
            setExporting(true);
            setExportType("CSV");
            setExportProgress(0);
            setExportCount(0);
            setExportTotal(0);
            setExportStatus(
                "Preparing complete audit CSV export..."
            );

            const rawTransactions =
                await fetchAllAuditTransactions();

            if (!rawTransactions.length) {
                throw new Error(
                    "There are no audit records to export."
                );
            }

            setExportStatus(
                `Processing ${rawTransactions.length.toLocaleString()} audit records...`
            );

            await new Promise((resolve) =>
                setTimeout(resolve, 100)
            );

            const transactions =
                rawTransactions.map(
                    normalizeExportTransaction
                );

            // ----------------------------------------------------
            // HEADERS
            // ----------------------------------------------------

            const headers = [
                "Date",
                "Patient Name",
                "Patient UID",
                "Service",
                "Item",
                "Purpose",
                "Quantity",
                "Unit Price",
                "Total Cost / Amount",
                "Actual Cost",
                "Profit",
                "Staff",
                "Payment Method",
                "Status",
                "Patient Type",
                "Bill Type",
            ];

            // ----------------------------------------------------
            // ROWS
            // ----------------------------------------------------

            const rows = transactions.map(
                (item) => [
                    item.date,
                    item.patientName,
                    item.uid,
                    label(item.service),
                    item.item,
                    item.purpose,
                    item.quantity,
                    item.unitPrice,
                    item.total,
                    item.totalCost,
                    item.profit,
                    item.staffName,
                    label(item.paymentMode),
                    label(item.status),
                    label(item.patientType),
                    label(item.billType),
                ]
            );

            setExportStatus(
                "Creating CSV file..."
            );

            await new Promise((resolve) =>
                setTimeout(resolve, 100)
            );

            // ----------------------------------------------------
            // CSV ESCAPING
            // ----------------------------------------------------

            const csvContent = [
                headers,
                ...rows,
            ]
                .map((row) =>
                    row
                        .map((value) =>
                            `"${String(
                                value ?? ""
                            ).replace(
                                /"/g,
                                '""'
                            )}"`
                        )
                        .join(",")
                )
                .join("\n");

            // UTF-8 BOM makes Excel handle Nigerian text/currency
            // and special characters correctly.
            const BOM = "\uFEFF";

            const blob = new Blob(
                [
                    BOM,
                    csvContent,
                ],
                {
                    type:
                        "text/csv;charset=utf-8;",
                }
            );

            setExportStatus(
                "Downloading complete CSV..."
            );

            const url =
                URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                `audit-export-${new Date()
                    .toISOString()
                    .slice(0, 10)}.csv`;

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            URL.revokeObjectURL(url);

            setExportProgress(100);

            setExportStatus(
                `CSV export completed — ${transactions.length.toLocaleString()} records exported.`
            );

            await new Promise((resolve) =>
                setTimeout(resolve, 1000)
            );

        } catch (error) {
            console.error(
                "CSV export error:",
                error
            );

            setExportStatus(
                "CSV export failed."
            );

            alert(
                error?.message ||
                "Failed to export audit data."
            );

        } finally {
            setExporting(false);
        }
    };


// ============================================================
// PDF EXPORT
// ============================================================

// ============================================================
// PDF EXPORT
// ============================================================

    const downloadPDF = async () => {
        try {
            setExporting(true);
            setExportType("PDF");
            setExportProgress(0);
            setExportCount(0);
            setExportTotal(0);
            setExportStatus(
                "Preparing complete audit PDF export..."
            );

            const rawTransactions =
                await fetchAllAuditTransactions();

            if (!rawTransactions.length) {
                throw new Error(
                    "There are no audit records to export."
                );
            }

            setExportStatus(
                `Processing ${rawTransactions.length.toLocaleString()} audit records...`
            );

            await new Promise((resolve) =>
                setTimeout(resolve, 150)
            );

            const transactions =
                rawTransactions.map(
                    normalizeExportTransaction
                );

            // ----------------------------------------------------
            // CREATE PDF
            // ----------------------------------------------------

            const doc = new jsPDF(
                "landscape",
                "mm",
                "a4"
            );

            // ----------------------------------------------------
            // TITLE
            // ----------------------------------------------------

            doc.setFontSize(16);

            doc.text(
                "Hospital Audit Report",
                10,
                10
            );

            doc.setFontSize(8);

            doc.text(
                `Generated: ${new Date().toLocaleString(
                    "en-NG"
                )}`,
                10,
                15
            );

            setExportStatus(
                "Building complete PDF table..."
            );

            await new Promise((resolve) =>
                setTimeout(resolve, 100)
            );

            // ----------------------------------------------------
            // PDF HEADERS
            // ----------------------------------------------------

            const headers = [
                "Date",
                "Patient",
                "UID",
                "Service",
                "Item",
                "Qty",
                "Unit Price",
                "Total",
                "Cost",
                "Profit",
                "Staff",
                "Payment",
                "Status",
            ];

            // ----------------------------------------------------
            // PDF ROWS
            // ----------------------------------------------------

            const rows = transactions.map(
                (item) => [
                    item.date || "-",

                    item.patientName || "-",

                    item.uid || "-",

                    label(item.service),

                    item.item ||
                        item.purpose ||
                        "-",

                    item.quantity ?? "",

                    money(item.unitPrice),

                    money(item.total),

                    money(item.totalCost),

                    money(item.profit),

                    item.staffName || "-",

                    label(
                        item.paymentMode
                    ),

                    label(item.status),
                ]
            );

            // ----------------------------------------------------
            // AUTOTABLE
            // IMPORTANT:
            // Use autoTable(doc, ...)
            // NOT doc.autoTable(...)
            // ----------------------------------------------------

            autoTable(doc, {
                head: [headers],

                body: rows,

                startY: 20,

                theme: "grid",

                styles: {
                    fontSize: 6.5,
                    cellPadding: 1.5,
                    overflow: "linebreak",
                    valign: "middle",
                },

                headStyles: {
                    fontSize: 7,
                    fontStyle: "bold",
                },

                columnStyles: {
                    0: {
                        cellWidth: 24,
                    },

                    1: {
                        cellWidth: 30,
                    },

                    2: {
                        cellWidth: 23,
                    },

                    3: {
                        cellWidth: 22,
                    },

                    4: {
                        cellWidth: 35,
                    },

                    5: {
                        cellWidth: 10,
                    },

                    6: {
                        cellWidth: 20,
                    },

                    7: {
                        cellWidth: 22,
                    },

                    8: {
                        cellWidth: 22,
                    },

                    9: {
                        cellWidth: 22,
                    },

                    10: {
                        cellWidth: 30,
                    },

                    11: {
                        cellWidth: 20,
                    },

                    12: {
                        cellWidth: 20,
                    },
                },

                margin: {
                    top: 20,
                    right: 6,
                    bottom: 15,
                    left: 6,
                },

                // ------------------------------------------------
                // PAGE FOOTER
                // ------------------------------------------------

                didDrawPage: (data) => {
                    const pageNumber =
                        doc.internal.getNumberOfPages();

                    doc.setFontSize(7);

                    doc.text(
                        `Audit Report • Page ${pageNumber}`,
                        10,
                        doc.internal.pageSize.height - 7
                    );
                },
            });

            setExportProgress(100);

            setExportStatus(
                "Finalizing PDF file..."
            );

            await new Promise((resolve) =>
                setTimeout(resolve, 200)
            );

            doc.save(
                `audit-export-${new Date()
                    .toISOString()
                    .slice(0, 10)}.pdf`
            );

            setExportStatus(
                `PDF export completed — ${transactions.length.toLocaleString()} records exported.`
            );

            await new Promise((resolve) =>
                setTimeout(resolve, 1000)
            );

        } catch (error) {
            console.error(
                "PDF export error:",
                error
            );

            setExportStatus(
                "PDF export failed."
            );

            alert(
                error?.message ||
                "Failed to export audit PDF."
            );

        } finally {
            setExporting(false);
        }
    };
    
  return (
    <div
      style={{
        padding: 20,
        minHeight:
          "100vh",
        background:
          "#f5f6f8",
        fontFamily:
          "Arial, Helvetica, sans-serif",
      }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <div
        style={{
          display:
            "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
          flexWrap:
            "wrap",
          gap: 10,
          marginBottom:
            20,
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
            }}
          >
            Audit
          </h2>

          <div
            style={{
              color:
                "#777",
              marginTop: 5,
              fontSize:
                13,
            }}
          >
            Hospital bills,
            payments,
            services,
            staff and
            expenses
          </div>
        </div>

        <div
          style={{
            display:
              "flex",
            gap: 10,
          }}
        >
          <button
            onClick={() =>
              loadAudit(1)
            }
            disabled={
              loading
            }
          >
            {loading
              ? "Loading..."
              : "Refresh"}
          </button>

          <button
            onClick={
              downloadCSV
            }
            disabled={
              !transactions.length
            }
          >
            Download CSV
          </button>
          <button
            onClick={
              downloadPDF
            }
            disabled={
              !transactions.length
            }
          >
            Download PDF
          </button>
        </div>
      </div>

      {exporting && (
            <div className="audit-export-overlay">
                <div className="audit-export-modal">

                    <div className="audit-export-spinner">
                        <div className="audit-export-spinner-inner"></div>
                    </div>

                    <h3>
                        {exportType === "PDF"
                            ? "Preparing PDF Export"
                            : "Preparing CSV Export"}
                    </h3>

                    <p className="audit-export-status">
                        {exportStatus}
                    </p>

                    {exportTotal > 0 && (
                        <>
                            <div className="audit-export-count">
                                <strong>
                                    {exportCount.toLocaleString()}
                                </strong>
                                <span>
                                    {" "} / {exportTotal.toLocaleString()} records
                                </span>
                            </div>

                            <div className="audit-export-progress">
                                <div
                                    className="audit-export-progress-bar"
                                    style={{
                                        width: `${exportProgress}%`
                                    }}
                                />
                            </div>

                            <div className="audit-export-percent">
                                {exportProgress}%
                            </div>
                        </>
                    )}

                    <div className="audit-export-warning">
                        Please don't close this window while the export is being prepared.
                    </div>

                </div>
            </div>
        )}

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div
          style={{
            padding: 12,
            background:
              "#ffe5e5",
            color:
              "#b00020",
            borderRadius: 6,
            marginBottom:
              15,
          }}
        >
          {error}
        </div>
      )}

      {/* =================================================
          FILTERS
      ================================================= */}

      <div
        style={{
          background:
            "#fff",
          padding: 15,
          borderRadius: 8,
          marginBottom:
            20,
          boxShadow:
            "0 1px 4px rgba(0,0,0,.08)",
        }}
      >
        <h3
          style={{
            marginTop: 0,
          }}
        >
          Audit Filters
        </h3>

        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
          }}
        >
          {/* DATE FROM */}

          <FilterField
            label="Date From"
          >
            <input
              type="date"
              value={
                dateFrom
              }
              onChange={(e) => {
                setDateFrom(
                  e.target
                    .value
                );

                setPeriod("");

                setMonth("");
              }}
            />
          </FilterField>

          {/* DATE TO */}

          <FilterField
            label="Date To"
          >
            <input
              type="date"
              value={
                dateTo
              }
              onChange={(e) => {
                setDateTo(
                  e.target
                    .value
                );

                setPeriod("");

                setMonth("");
              }}
            />
          </FilterField>

          {/* PERIOD */}

          <FilterField
            label="Period"
          >
            <select
              value={
                period
              }
              onChange={(e) =>
                changePeriod(
                  e.target
                    .value
                )
              }
            >
              {PERIOD_OPTIONS.map(
                (option) => (
                  <option
                    key={
                      option.value
                    }
                    value={
                      option.value
                    }
                  >
                    {
                      option.label
                    }
                  </option>
                )
              )}
            </select>
          </FilterField>

          {/* MONTH */}

          <FilterField
            label="Month"
          >
            <select
              value={
                month
              }
              onChange={(e) =>
                changeMonth(
                  e.target
                    .value
                )
              }
            >
              <option value="">
                Select Month
              </option>

              {Array.from(
                {
                  length: 12,
                },
                (_, index) => {
                  const value =
                    String(
                      index + 1
                    );

                  const monthName =
                    new Date(
                      2000,
                      index,
                      1
                    ).toLocaleString(
                      "en-US",
                      {
                        month:
                          "long",
                      }
                    );

                  return (
                    <option
                      key={
                        value
                      }
                      value={
                        value
                      }
                    >
                      {
                        monthName
                      }
                    </option>
                  );
                }
              )}
            </select>
          </FilterField>

          {/* YEAR */}

          <FilterField
            label="Year"
          >
            <select
              value={
                year
              }
              onChange={(e) =>
                changeYear(
                  e.target
                    .value
                )
              }
            >
              <option value="">
                Select Year
              </option>

              {Array.from(
                {
                  length: 10,
                },
                (_, index) => {
                  const current =
                    new Date().getFullYear();

                  const value =
                    String(
                      current -
                        index
                    );

                  return (
                    <option
                      key={
                        value
                      }
                      value={
                        value
                      }
                    >
                      {
                        value
                      }
                    </option>
                  );
                }
              )}
            </select>
          </FilterField>

          {/* SERVICE */}

          <FilterField
            label="Service"
          >
            <select
              value={
                service
              }
              onChange={(e) =>
                setService(
                  e.target
                    .value
                )
              }
            >
              {SERVICE_OPTIONS.map(
                (option) => (
                  <option
                    key={
                      option.value
                    }
                    value={
                      option.value
                    }
                  >
                    {
                      option.label
                    }
                  </option>
                )
              )}
            </select>
          </FilterField>

          {/* STAFF */}

          <FilterField
            label="Staff"
          >
            <select
              value={
                staffId
              }
              onChange={(e) =>
                setStaffId(
                  e.target
                    .value
                )
              }
            >
              <option value="">
                All Staff
              </option>

              {staffs.map(
                (person) => (
                  <option
                    key={
                      person.id
                    }
                    value={
                      person.id
                    }
                  >
                    {
                      person.name
                    }
                  </option>
                )
              )}
            </select>
          </FilterField>

          {/* PAYMENT MODE */}

          <FilterField
            label="Payment Mode"
          >
            <select
              value={
                paymentMode
              }
              onChange={(e) =>
                setPaymentMode(
                  e.target
                    .value
                )
              }
            >
              {MODE_OPTIONS.map(
                (option) => (
                  <option
                    key={
                      option.value
                    }
                    value={
                      option.value
                    }
                  >
                    {
                      option.label
                    }
                  </option>
                )
              )}
            </select>
          </FilterField>

          {/* STATUS */}

          <FilterField
            label="Status"
          >
            <select
              value={
                status
              }
              onChange={(e) =>
                setStatus(
                  e.target
                    .value
                )
              }
            >
              {STATUS_OPTIONS.map(
                (option) => (
                  <option
                    key={
                      option.value
                    }
                    value={
                      option.value
                    }
                  >
                    {
                      option.label
                    }
                  </option>
                )
              )}
            </select>
          </FilterField>

          {/* PATIENT TYPE */}

          <FilterField
            label="Patient Type"
          >
            <select
              value={
                patientType
              }
              onChange={(e) =>
                setPatientType(
                  e.target
                    .value
                )
              }
            >
              <option value="">
                All Patient Types
              </option>

              <option value="outpatient">
                Outpatient
              </option>

              <option value="inpatient">
                Inpatient
              </option>

              <option value="emergency">
                Emergency
              </option>
            </select>
          </FilterField>

          {/* BILL TYPE */}

          <FilterField
            label="Bill Type"
          >
            <select
              value={
                billType
              }
              onChange={(e) =>
                setBillType(
                  e.target
                    .value
                )
              }
            >
              {BILL_TYPES.map(
                (option) => (
                  <option
                    key={
                      option.value
                    }
                    value={
                      option.value
                    }
                  >
                    {
                      option.label
                    }
                  </option>
                )
              )}
            </select>
          </FilterField>

          {/* SEARCH */}

          <FilterField
            label="Search Patient / Item"
          >
            <input
              type="text"
              placeholder="Patient, UID, drug, service..."
              value={
                search
              }
              onChange={(e) =>
                setSearch(
                  e.target
                    .value
                )
              }
              onKeyDown={(e) => {
                if (
                  e.key ===
                  "Enter"
                ) {
                  applyFilters();
                }
              }}
            />
          </FilterField>
        </div>

        <div
          style={{
            display:
              "flex",
            gap: 10,
            marginTop:
              15,
          }}
        >
          <button
            onClick={
              applyFilters
            }
            disabled={
              loading
            }
          >
            Apply Filters
          </button>

          <button
            onClick={
              resetFilters
            }
            disabled={
              loading
            }
          >
            Reset
          </button>
        </div>
      </div>

      {/* =================================================
          FINANCIAL SUMMARY
      ================================================= */}

      <div
        style={{
          display:
            "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
          marginBottom:
            20,
        }}
      >
        <SummaryCard
          title="Gross Sales"
          value={money(
            summary.grossSales
          )}
        />

        <SummaryCard
          title="Amount Paid"
          value={money(
            summary.amountPaid
          )}
        />

        <SummaryCard
          title="Outstanding"
          value={money(
            summary.outstanding
          )}
        />

        <SummaryCard
          title="Cost"
          value={money(
            summary.cost
          )}
        />

        <SummaryCard
          title="Profit"
          value={money(
            summary.profit
          )}
        />

        <SummaryCard
          title="Expenses"
          value={money(
            summary.expenses
          )}
        />

        <SummaryCard
          title="Net Profit"
          value={money(
            summary.netProfit
          )}
        />
      </div>

      {/* =================================================
          COUNTS
      ================================================= */}

      <div
        style={{
          display:
            "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 10,
          marginBottom:
            20,
        }}
      >
        <CountCard
          title="Bills"
          value={
            counts.totalBills
          }
        />

        <CountCard
          title="Paid"
          value={
            counts.paid
          }
        />

        <CountCard
          title="Pending"
          value={
            counts.pending
          }
        />

        <CountCard
          title="Debtors"
          value={
            counts.debtors
          }
        />

        <CountCard
          title="Awaiting Pharmacy"
          value={
            counts.awaitingPharmacy
          }
        />

        <CountCard
          title="Completed"
          value={
            counts.completed
          }
        />
      </div>

      {/* =================================================
          BREAKDOWNS
      ================================================= */}

      <div
        style={{
          display:
            "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 15,
          marginBottom:
            20,
        }}
      >
        <BreakdownCard
          title="Service Breakdown"
          data={
            breakdown
          }
        />

        <BreakdownCard
          title="Payment Mode Breakdown"
          data={
            paymentBreakdown
          }
        />
      </div>

      {/* =================================================
          TRANSACTIONS
      ================================================= */}

      <div
        style={{
          background:
            "#fff",
          borderRadius:
            8,
          overflow:
            "hidden",
        }}
      >
        <div
          style={{
            padding:
              15,
            display:
              "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            flexWrap:
              "wrap",
            gap: 10,
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
              }}
            >
              Transactions
            </h3>

            <div
              style={{
                color:
                  "#777",
                fontSize:
                  13,
                marginTop:
                  5,
              }}
            >
              Showing{" "}
              {
                transactions.length
              }{" "}
              transactions ·
              Page total{" "}
              {money(
                currentPageTotal
              )}{" "}
              · Total matching{" "}
              {
                pagination.total
              }
            </div>
          </div>

          {lastUpdated && (
            <div
              style={{
                color:
                  "#777",
                fontSize:
                  12,
              }}
            >
              Updated{" "}
              {formatDate(
                lastUpdated
              )}
            </div>
          )}
        </div>

        <div
          style={{
            overflowX:
              "auto",
          }}
        >
          <table
            style={{
              width:
                "100%",
              borderCollapse:
                "collapse",
              minWidth:
                1250,
            }}
          >
            <thead>
              <tr
                style={{
                  background:
                    "#f0f1f3",
                }}
              >
                <th
                  style={
                    thStyle
                  }
                >
                  TIME
                </th>

                <th
                  style={
                    thStyle
                  }
                >
                  PATIENT
                </th>

                <th
                  style={
                    thStyle
                  }
                >
                  PURPOSE
                </th>

                <th
                  style={
                    thStyle
                  }
                >
                  SERVICE
                </th>

                <th
                  style={
                    thStyle
                  }
                >
                  STAFF
                </th>

                <th
                  style={
                    thStyle
                  }
                >
                  AMOUNT
                </th>

                <th
                  style={
                    thStyle
                  }
                >
                  COST
                </th>

                <th
                  style={
                    thStyle
                  }
                >
                  PROFIT
                </th>

                <th
                  style={
                    thStyle
                  }
                >
                  MODE
                </th>

                <th
                  style={
                    thStyle
                  }
                >
                  STATUS
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="10"
                    style={{
                      padding:
                        30,
                      textAlign:
                        "center",
                    }}
                  >
                    Loading audit...
                  </td>
                </tr>
              ) : transactions.length ===
                0 ? (
                <tr>
                  <td
                    colSpan="10"
                    style={{
                      padding:
                        30,
                      textAlign:
                        "center",
                    }}
                  >
                    No transactions
                    found.
                  </td>
                </tr>
              ) : (
                transactions.map(
                  (
                    transaction
                  ) => (
                    <tr
                      key={
                        transaction.id
                      }
                      style={{
                        borderTop:
                          "1px solid #eee",
                      }}
                    >
                      <td
                        style={
                          tdStyle
                        }
                      >
                        {formatDate(
                          transaction.date
                        )}
                      </td>

                      <td
                        style={
                          tdStyle
                        }
                      >
                        <strong>
                          {
                            transaction
                              .patient
                              ?.name
                          }
                        </strong>

                        {transaction
                          .patient
                          ?.uid && (
                          <div
                            style={{
                              fontSize:
                                11,
                              color:
                                "#777",
                            }}
                          >
                            {
                              transaction
                                .patient
                                .uid
                            }
                          </div>
                        )}
                      </td>

                      <td
                        style={
                          tdStyle
                        }
                      >
                        {
                          transaction.purpose
                        }
                      </td>

                      <td
                        style={
                          tdStyle
                        }
                      >
                        {label(
                          transaction.service
                        )}
                      </td>

                      <td
                        style={
                          tdStyle
                        }
                      >
                        {(
                          transaction.staff ||
                          []
                        )
                          .map(
                            (
                              person
                            ) =>
                              person.name
                          )
                          .join(
                            ", "
                          ) ||
                          "-"}
                      </td>

                      <td
                        style={
                          tdStyle
                        }
                      >
                        {money(
                          transaction.amount
                        )}
                      </td>

                      <td
                        style={
                          tdStyle
                        }
                      >
                        {money(
                          transaction.cost
                        )}
                      </td>

                      <td
                        style={
                          tdStyle
                        }
                      >
                        {money(
                          transaction.profit
                        )}
                      </td>

                      <td
                        style={
                          tdStyle
                        }
                      >
                        {label(
                          transaction.mode
                        )}
                      </td>

                      <td
                        style={
                          tdStyle
                        }
                      >
                        <span
                          style={{
                            padding:
                              "4px 8px",
                            borderRadius:
                              12,
                            background:
                              "#eee",
                            fontSize:
                              12,
                            fontWeight:
                              600,
                          }}
                        >
                          {label(
                            transaction.status
                          )}
                        </span>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}

        {pagination.pages >
          1 && (
          <div
            style={{
              padding:
                15,
              display:
                "flex",
              justifyContent:
                "center",
              alignItems:
                "center",
              gap: 10,
            }}
          >
            <button
              disabled={
                loading ||
                page <= 1
              }
              onClick={() =>
                loadAudit(
                  page - 1
                )
              }
            >
              Previous
            </button>

            <span>
              Page{" "}
              {page}{" "}
              of{" "}
              {
                pagination.pages
              }
            </span>

            <button
              disabled={
                loading ||
                page >=
                  pagination.pages
              }
              onClick={() =>
                loadAudit(
                  page + 1
                )
              }
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* =================================================
          EXPENSES
      ================================================= */}

      {expenses.length >
        0 && (
        <div
          style={{
            marginTop:
              20,
            background:
              "#fff",
            borderRadius:
              8,
            padding:
              15,
          }}
        >
          <h3>
            Expenses
          </h3>

          <div
            style={{
              overflowX:
                "auto",
            }}
          >
            <table
              style={{
                width:
                  "100%",
                borderCollapse:
                  "collapse",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={
                      thStyle
                    }
                  >
                    TIME
                  </th>

                  <th
                    style={
                      thStyle
                    }
                  >
                    DESCRIPTION
                  </th>

                  <th
                    style={
                      thStyle
                    }
                  >
                    AMOUNT
                  </th>

                  <th
                    style={
                      thStyle
                    }
                  >
                    STAFF
                  </th>
                </tr>
              </thead>

              <tbody>
                {expenses.map(
                  (
                    expense,
                    index
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
                      <tr
                        key={
                          expense._id ||
                          index
                        }
                        style={{
                          borderTop:
                            "1px solid #eee",
                        }}
                      >
                        <td
                          style={
                            tdStyle
                          }
                        >
                          {formatDate(
                            expense.time
                              ? new Date(
                                  Number(
                                    expense.time
                                  )
                                )
                              : expense.createdAt
                          )}
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {expense.name ||
                            expense.description ||
                            expense.title ||
                            "-"}
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {money(
                            amount
                          )}
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {
                            expense.staffID ||
                            expense.staff ||
                            "-"
                          }
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function FilterField({
  label: fieldLabel,
  children,
}) {
  return (
    <label
      style={{
        display:
          "block",
      }}
    >
      <div
        style={{
          fontSize:
            13,
          marginBottom:
            5,
          color:
            "#444",
        }}
      >
        {
          fieldLabel
        }
      </div>

      {React.cloneElement(
        children,
        {
          style: {
            width:
              "100%",
            padding:
              8,
            boxSizing:
              "border-box",
            ...(children.props
              .style ||
              {}),
          },
        }
      )}
    </label>
  );
}

function SummaryCard({
  title,
  value,
}) {
  return (
    <div
      style={{
        background:
          "#fff",
        padding:
          16,
        borderRadius:
          8,
        boxShadow:
          "0 1px 4px rgba(0,0,0,.08)",
      }}
    >
      <div
        style={{
          fontSize:
            13,
          color:
            "#777",
          marginBottom:
            7,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize:
            21,
          fontWeight:
            700,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function CountCard({
  title,
  value,
}) {
  return (
    <div
      style={{
        background:
          "#fff",
        padding:
          14,
        borderRadius:
          8,
        border:
          "1px solid #e5e5e5",
      }}
    >
      <div
        style={{
          fontSize:
            12,
          color:
            "#777",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize:
            21,
          fontWeight:
            700,
          marginTop:
            4,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function BreakdownCard({
  title,
  data,
}) {
  const entries =
    Object.entries(
      data || {}
    ).sort(
      (a, b) =>
        Number(b[1]) -
        Number(a[1])
    );

  return (
    <div
      style={{
        background:
          "#fff",
        padding:
          15,
        borderRadius:
          8,
      }}
    >
      <h3>
        {title}
      </h3>

      {entries.length ===
      0 ? (
        <div
          style={{
            color:
              "#777",
          }}
        >
          No data.
        </div>
      ) : (
        entries.map(
          ([
            key,
            value,
          ]) => (
            <div
              key={
                key
              }
              style={{
                display:
                  "flex",
                justifyContent:
                  "space-between",
                padding:
                  "7px 0",
                borderBottom:
                  "1px solid #eee",
              }}
            >
              <span>
                {label(
                  key
                )}
              </span>

              <strong>
                {money(
                  value
                )}
              </strong>
            </div>
          )
        )
      )}
    </div>
  );
}

const thStyle = {
  padding:
    "11px 10px",
  fontSize:
    12,
  whiteSpace:
    "nowrap",
  textAlign:
    "left",
};

const tdStyle = {
  padding:
    "11px 10px",
  verticalAlign:
    "top",
  fontSize:
    13,
};
