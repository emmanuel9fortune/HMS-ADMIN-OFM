import React from 'react'

function ManageMentBar({ item }) {

    const formatted = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })


    /*
    |--------------------------------------------------------------------------
    | NORMALIZE NUMBERS
    |--------------------------------------------------------------------------
    */

    const originalPrice =
        Number(item?.originalPrice) || 0

    const sellingPrice =
        Number(item?.sellingPrice) || 0

    const originalQuantity =
        Number(item?.originalQuantity) || 0

    const quantityRemaining =
        Number(item?.quantity) || 0


    /*
    |--------------------------------------------------------------------------
    | QUANTITY SOLD
    |--------------------------------------------------------------------------
    */

    const sold = Math.max(
        originalQuantity - quantityRemaining,
        0
    )


    /*
    |--------------------------------------------------------------------------
    | EXPIRATION DATE
    |--------------------------------------------------------------------------
    */

    const expireTimestamp =
        Number(item?.expireDate) || 0

    const hasExpiryDate =
        expireTimestamp > 0

    const expiryDate = hasExpiryDate
        ? new Date(expireTimestamp * 1000)
        : null


    /*
    |--------------------------------------------------------------------------
    | TODAY
    |--------------------------------------------------------------------------
    */

    const now = new Date()

    const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    )

    const startOfTomorrow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
    )


    /*
    |--------------------------------------------------------------------------
    | EXPIRATION STATUS
    |--------------------------------------------------------------------------
    */

    const isExpired =
        hasExpiryDate &&
        expiryDate < startOfToday

    const expiresToday =
        hasExpiryDate &&
        expiryDate >= startOfToday &&
        expiryDate < startOfTomorrow


    /*
    |--------------------------------------------------------------------------
    | SALES REVENUE
    |--------------------------------------------------------------------------
    */

    const totalRevenue =
        sellingPrice * sold


    /*
    |--------------------------------------------------------------------------
    | COST OF GOODS SOLD
    |--------------------------------------------------------------------------
    */

    const totalCost =
        originalPrice * sold


    /*
    |--------------------------------------------------------------------------
    | NORMAL PROFIT
    |--------------------------------------------------------------------------
    */

    const profit =
        totalRevenue - totalCost


    /*
    |--------------------------------------------------------------------------
    | EXPIRED STOCK LOSS
    |--------------------------------------------------------------------------
    |
    | If the product has expired, every remaining unit is now a loss.
    |
    | Example:
    |
    | Buy price = ₦170
    | Qty left = 17
    |
    | Expired loss = ₦170 × 17
    |
    */

    const expiredStockLoss =
        isExpired
            ? originalPrice * quantityRemaining
            : 0


    /*
    |--------------------------------------------------------------------------
    | TOTAL LOSS
    |--------------------------------------------------------------------------
    |
    | There are two possible sources of loss:
    |
    | 1. A normal sale made below cost.
    | 2. Remaining stock that has expired.
    |
    */

    const normalSaleLoss =
        profit < 0
            ? Math.abs(profit)
            : 0

    const totalLoss =
        normalSaleLoss + expiredStockLoss


    /*
    |--------------------------------------------------------------------------
    | DISPLAYED PROFIT
    |--------------------------------------------------------------------------
    |
    | If stock has expired, its expired-stock cost is no longer
    | potential profit.
    |
    */

    const displayedProfit =
        profit > 0
            ? profit
            : 0


    /*
    |--------------------------------------------------------------------------
    | PROFIT MARGIN
    |--------------------------------------------------------------------------
    */

    const profitMargin =
        totalRevenue > 0
            ? (profit / totalRevenue) * 100
            : 0


    /*
    |--------------------------------------------------------------------------
    | REMAINING STOCK VALUE
    |--------------------------------------------------------------------------
    |
    | For expired stock, we don't treat it as usable inventory.
    |
    */

    const remainingCostValue =
        isExpired
            ? 0
            : originalPrice * quantityRemaining


    /*
    |--------------------------------------------------------------------------
    | POTENTIAL REVENUE
    |--------------------------------------------------------------------------
    */

    const remainingPotentialRevenue =
        isExpired
            ? 0
            : sellingPrice * quantityRemaining


    /*
    |--------------------------------------------------------------------------
    | POTENTIAL PROFIT
    |--------------------------------------------------------------------------
    */

    const remainingPotentialProfit =
        isExpired
            ? 0
            : remainingPotentialRevenue -
              remainingCostValue


    /*
    |--------------------------------------------------------------------------
    | FORMAT EXPIRY DATE
    |--------------------------------------------------------------------------
    */

    const formattedExpiryDate =
        expiryDate &&
        !Number.isNaN(expiryDate.getTime())
            ? new Intl.DateTimeFormat('en-NG', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            }).format(expiryDate)
            : '-'


    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (

        <div className="recentpatientdashcard">

            {/* EXPIRY */}

            <div
                className="recentpatientdashcard_desc"
                style={{
                    width: '25%',
                    textAlign: 'center',
                }}
            >

                <h4>
                    {formattedExpiryDate}
                </h4>

                {isExpired ? (

                    <p style={{ color: 'red' }}>
                        Expired
                    </p>

                ) : expiresToday ? (

                    <p style={{ color: 'orange' }}>
                        Expires Today
                    </p>

                ) : (

                    <p style={{ color: 'green' }}>
                        Active
                    </p>

                )}

            </div>


            {/* PRODUCT */}

            <div
                className="recentpatientdashcard_desc"
                style={{
                    width: '25%',
                    textAlign: 'center',
                }}
            >

                <h4>
                    {item?.name || '-'}
                </h4>

            </div>


            {/* BUY PRICE */}

            <div
                className="recentpatientdashcard_desc"
                style={{
                    width: '25%',
                    textAlign: 'center',
                }}
            >

                <h4>
                    {formatted.format(originalPrice)}
                </h4>

            </div>


            {/* SELL PRICE */}

            <div
                className="recentpatientdashcard_desc"
                style={{
                    width: '25%',
                    textAlign: 'center',
                }}
            >

                <h4>
                    {formatted.format(sellingPrice)}
                </h4>

            </div>


            {/* QTY BOUGHT */}

            <div
                className="recentpatientdashcard_desc"
                style={{
                    width: '25%',
                    textAlign: 'center',
                }}
            >

                <h4>
                    {originalQuantity}
                </h4>

            </div>


            {/* QTY LEFT */}

            <div
                className="recentpatientdashcard_desc"
                style={{
                    width: '25%',
                    textAlign: 'center',
                }}
            >

                <h4>
                    {quantityRemaining}
                </h4>

            </div>


            {/* QTY SOLD */}

            <div
                className="recentpatientdashcard_desc"
                style={{
                    width: '25%',
                    textAlign: 'center',
                }}
            >

                <h4>
                    {sold}
                </h4>

            </div>


            {/* REVENUE */}

            <div
                className="recentpatientdashcard_desc"
                style={{
                    width: '25%',
                    textAlign: 'center',
                }}
            >

                <h4 style={{ color: 'blue' }}>
                    {formatted.format(totalRevenue)}
                </h4>

            </div>


            {/* COST */}

            <div
                className="recentpatientdashcard_desc"
                style={{
                    width: '25%',
                    textAlign: 'center',
                }}
            >

                <h4 style={{ color: 'orange' }}>
                    {formatted.format(totalCost)}
                </h4>

            </div>


            {/* PROFIT */}

            <div
                className="recentpatientdashcard_desc"
                style={{
                    width: '25%',
                    textAlign: 'center',
                }}
            >

                <h4
                    style={{
                        color:
                            displayedProfit > 0
                                ? 'green'
                                : 'black',
                    }}
                >

                    {displayedProfit > 0
                        ? formatted.format(displayedProfit)
                        : '-'
                    }

                </h4>

            </div>


            {/* LOSS */}

            <div
                className="recentpatientdashcard_desc"
                style={{
                    width: '25%',
                    textAlign: 'center',
                }}
            >

                <h4
                    style={{
                        color:
                            totalLoss > 0
                                ? 'red'
                                : 'black',
                    }}
                >

                    {totalLoss > 0
                        ? formatted.format(totalLoss)
                        : '-'
                    }

                </h4>

            </div>


            {/* BATCH */}

            <div
                className="recentpatientdashcard_desc"
                style={{
                    width: '25%',
                    textAlign: 'center',
                }}
            >

                <h4>
                    {item?.batch || '-'}
                </h4>

            </div>

        </div>
    )
}

export default ManageMentBar
