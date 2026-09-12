import React from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

function InventoryPDF({
    inventory = [],
    statistics,
    sort = '',
    batch = '',
    fromDate = '',
    toDate = '',
}) {

    const formatCurrency = (value) => {
        return `NGN ${Number(value || 0).toLocaleString(
            'en-NG',
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        )}`
    }

    const formatDate = (timestamp) => {

        if (!timestamp) return 'N/A'

        const date = new Date(
            Number(timestamp) * 1000
        )

        return date.toLocaleDateString('en-NG', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
    }

    const getServiceName = () => {

        if (!sort) return 'ALL SERVICES'

        if (sort === 'drugs') return 'DRUGS'

        if (sort === 'utils') return 'UTILITY'

        if (sort === 'consumable') return 'CONSUMABLE'

        return sort.toUpperCase()
    }

    const downloadPDF = () => {

        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4',
        })

        /*
        |--------------------------------------------------------------------------
        | TITLE
        |--------------------------------------------------------------------------
        */

        doc.setFontSize(20)

        doc.setFont('helvetica', 'bold')

        doc.text(
            'INVENTORY REPORT',
            14,
            18
        )


        /*
        |--------------------------------------------------------------------------
        | DATE GENERATED
        |--------------------------------------------------------------------------
        */

        doc.setFontSize(9)

        doc.setFont('helvetica', 'normal')

        doc.text(
            `Generated: ${new Date().toLocaleString(
                'en-NG'
            )}`,
            14,
            25
        )


        /*
        |--------------------------------------------------------------------------
        | FILTER INFORMATION
        |--------------------------------------------------------------------------
        */

        doc.setFontSize(10)

        doc.setFont('helvetica', 'bold')

        doc.text(
            'FILTERS',
            14,
            35
        )

        doc.setFont('helvetica', 'normal')

        doc.text(
            `Service: ${getServiceName()}`,
            14,
            42
        )

        doc.text(
            `Batch: ${batch || 'ALL BATCHES'}`,
            14,
            48
        )

        doc.text(
            `From Expiry: ${fromDate || 'ALL'}`,
            80,
            42
        )

        doc.text(
            `To Expiry: ${toDate || 'ALL'}`,
            80,
            48
        )

        doc.text(
            `Products: ${inventory.length}`,
            150,
            42
        )


        /*
        |--------------------------------------------------------------------------
        | FINANCIAL SUMMARY
        |--------------------------------------------------------------------------
        */

        doc.setFontSize(11)

        doc.setFont('helvetica', 'bold')

        doc.text(
            'INVENTORY SUMMARY',
            14,
            61
        )


        const summaryRows = [
            [
                'Products',
                statistics?.totalProducts?.toLocaleString() || '0',

                'Qty Bought',
                statistics?.totalQuantityBought?.toLocaleString() || '0',

                'Qty Sold',
                statistics?.totalQuantitySold?.toLocaleString() || '0',

                'Qty Left',
                statistics?.totalQuantityLeft?.toLocaleString() || '0',
            ],

            [
                'Sales Revenue',
                formatCurrency(
                    statistics?.totalRevenue
                ),

                'Cost of Goods',
                formatCurrency(
                    statistics?.totalCost
                ),

                'Profit',
                formatCurrency(
                    statistics?.totalProfit
                ),

                'Price Loss',
                formatCurrency(
                    statistics?.totalLoss
                ),
            ],

            [
                'Expired Stock Loss',
                formatCurrency(
                    statistics?.totalExpiredLoss
                ),
                'Total Loss',
                formatCurrency(
                    statistics?.totalExpiredLoss +  statistics?.totalLoss
                ),
                'Profit Margin',
                `${Number(
                    statistics?.profitMargin || 0
                ).toFixed(2)}%`,

                'Stock Value',
                formatCurrency(
                    statistics?.remainingStockValue
                ),


                
            ],

            [
                
                'Potential Revenue',
                formatCurrency(
                    statistics?.potentialRevenue
                ),
                'Potential Profit',
                formatCurrency(
                    statistics?.potentialProfit
                ),
            ],
        ]


        autoTable(doc, {
            startY: 66,

            body: summaryRows,

            theme: 'grid',

            styles: {
                fontSize: 8,
                cellPadding: 3,
            },

            columnStyles: {
                0: {
                    fontStyle: 'bold',
                },

                2: {
                    fontStyle: 'bold',
                },

                4: {
                    fontStyle: 'bold',
                },

                6: {
                    fontStyle: 'bold',
                },
            },
        })


        /*
        |--------------------------------------------------------------------------
        | INVENTORY TABLE
        |--------------------------------------------------------------------------
        */

        const tableStart =
            doc.lastAutoTable.finalY + 10


        const tableData = inventory.map((item) => {

            const originalPrice =
                Number(item?.originalPrice) || 0

            const sellingPrice =
                Number(item?.sellingPrice) || 0

            const originalQuantity =
                Number(item?.originalQuantity) || 0

            const quantityLeft =
                Number(item?.quantity) || 0


            // ============================================================
            // QTY SOLD
            // ============================================================

            const quantitySold =
                Math.max(
                    originalQuantity - quantityLeft,
                    0
                )


            // ============================================================
            // SALES
            // ============================================================

            const salesRevenue =
                sellingPrice * quantitySold


            const costOfGoodsSold =
                originalPrice * quantitySold


            const profit =
                salesRevenue - costOfGoodsSold


            // ============================================================
            // NORMAL SALE LOSS
            // ============================================================

            const saleLoss =
                profit < 0
                    ? Math.abs(profit)
                    : 0


            // ============================================================
            // EXPIRY
            // ============================================================

            const expireTimestamp =
                Number(item?.expireDate) || 0

            const expiryDate =
                expireTimestamp > 0
                    ? new Date(expireTimestamp * 1000)
                    : null


            const now = new Date()

            const startOfToday =
                new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate()
                )


            const isExpired =
                expiryDate &&
                !Number.isNaN(
                    expiryDate.getTime()
                ) &&
                expiryDate < startOfToday


            // ============================================================
            // EXPIRED STOCK LOSS
            // ============================================================

            const expiredStockLoss =
                isExpired
                    ? originalPrice * quantityLeft
                    : 0


            // ============================================================
            // TOTAL LOSS
            // ============================================================

            const loss =
                saleLoss + expiredStockLoss


            return [

                // EXPIRES
                formatDate(
                    item?.expireDate
                ),


                // PRODUCT
                item?.name || 'N/A',


                // BUY PRICE
                formatCurrency(
                    originalPrice
                ),


                // SELL PRICE
                formatCurrency(
                    sellingPrice
                ),


                // QTY BOUGHT
                originalQuantity.toLocaleString(),


                // QTY LEFT
                quantityLeft.toLocaleString(),


                // QTY SOLD
                quantitySold.toLocaleString(),


                // REVENUE
                formatCurrency(
                    salesRevenue
                ),


                // COGS
                formatCurrency(
                    costOfGoodsSold
                ),


                // PROFIT
                formatCurrency(
                    profit
                ),


                // LOSS
                formatCurrency(
                    loss
                ),


                // BATCH
                item?.batch || 'N/A',
            ]
        })


        autoTable(doc, {

            startY: tableStart,

            head: [[
                'EXPIRES',
                'PRODUCT',
                'BUY / UNIT',
                'SELL / UNIT',
                'QTY BOUGHT',
                'QTY LEFT',
                'QTY SOLD',
                'REVENUE',
                'COGS',
                'PROFIT',
                'LOSS',
                'BATCH',
            ]],

            body: tableData,

            theme: 'grid',

            styles: {
                fontSize: 6.5,
                cellPadding: 2,
                overflow: 'linebreak',
                valign: 'middle',
            },

            headStyles: {
                fontStyle: 'bold',
                fontSize: 7,
            },

            columnStyles: {
                0: {
                    cellWidth: 20,
                },

                1: {
                    cellWidth: 38,
                },

                2: {
                    cellWidth: 23,
                },

                3: {
                    cellWidth: 23,
                },

                4: {
                    cellWidth: 19,
                },

                5: {
                    cellWidth: 17,
                },

                6: {
                    cellWidth: 17,
                },

                7: {
                    cellWidth: 27,
                },

                8: {
                    cellWidth: 27,
                },

                9: {
                    cellWidth: 25,
                },

                10: {
                    cellWidth: 25,
                },

                11: {
                    cellWidth: 25,
                },
            },

            didParseCell: (data) => {

                /*
                |--------------------------------------------------------------------------
                | PROFIT COLUMN
                |--------------------------------------------------------------------------
                */

                if (
                    data.section === 'body' &&
                    data.column.index === 9
                ) {

                    data.cell.styles.fontStyle =
                        'bold'
                }


                /*
                |--------------------------------------------------------------------------
                | LOSS COLUMN
                |--------------------------------------------------------------------------
                */

                if (
                    data.section === 'body' &&
                    data.column.index === 10
                ) {

                    data.cell.styles.fontStyle =
                        'bold'
                }

            },

        })


        /*
        |--------------------------------------------------------------------------
        | FOOTER
        |--------------------------------------------------------------------------
        */

        const pageCount =
            doc.internal.getNumberOfPages()


        for (
            let page = 1;
            page <= pageCount;
            page++
        ) {

            doc.setPage(page)

            const pageHeight =
                doc.internal.pageSize.height

            doc.setFontSize(8)

            doc.setFont(
                'helvetica',
                'normal'
            )

            doc.text(
                `Inventory Report • Page ${page} of ${pageCount}`,
                14,
                pageHeight - 8
            )

        }


        /*
        |--------------------------------------------------------------------------
        | DOWNLOAD
        |--------------------------------------------------------------------------
        */

        const fileName =
            `inventory-report-${new Date()
                .toISOString()
                .slice(0, 10)}.pdf`

        doc.save(fileName)
    }


    return (

        <button
            type="button"
            onClick={downloadPDF}
            style={{
                height: '42px',
                padding: '0 18px',
                border: 'none',
                borderRadius: '6px',
                background: '#111827',
                color: '#ffffff',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '700',
            }}
        >
            DOWNLOAD PDF
        </button>

    )
}

export default InventoryPDF
