import React, { useEffect, useMemo, useState } from 'react'
import AdminBar from '../../components/AdminBar'
import { FaSearch, FaTimes } from 'react-icons/fa'
import axios from 'axios'
import ManageMentBar from '../pharmacy/ManageMentBar'
import { useSelector } from 'react-redux'
import { selectinfo } from '../../features/infoSlice'
import InventoryAudit from './InventoryAudit'
import InventoryPDF from './InventoryAudit'

function DrugDate() {
  const info = useSelector(selectinfo)

  const [utils, setutils] = useState([])

  const [sort, setsort] = useState('')
  const [batch, setbatch] = useState('')

  const [search, setsearch] = useState([])
  const [getsearch, setgetsearch] = useState('')

  // Date filters
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  // Quick date preset
  const [datePreset, setDatePreset] = useState('')

  const cip = window.location.hostname

  /*
  |--------------------------------------------------------------------------
  | FETCH INVENTORY
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const controller = new AbortController()

    const func = async () => {
      try {
        const response = await axios.post(
          `http://${cip || 'localhost'}:7700/getUtils`,
          {},
          {
            signal: controller.signal,
          }
        )

        if (response.data.status === 'success') {
          setutils(response.data.utils || [])
        }
      } catch (error) {
        if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
          console.log(error)
        }
      }
    }

    func()

    return () => controller.abort()
  }, [cip])

  /*
  |--------------------------------------------------------------------------
  | SEARCH
  |--------------------------------------------------------------------------
  */

  const handleSearch = async (e) => {
    e.preventDefault()

    const searchQuery = e.target.value

    setgetsearch(searchQuery)

    if (searchQuery.length > 0) {
      try {
        const value = {
          search: searchQuery,
        }

        const response = await axios.post(
          `http://${cip || 'localhost'}:7700/searchutils`,
          value
        )

        if (response.data.status === 'success') {
          setsearch(response.data.utils || [])
        } else {
          setsearch([])
        }
      } catch (err) {
        console.error('Error fetching search results', err)
        setsearch([])
      }
    } else {
      setsearch([])
    }
  }

  /*
  |--------------------------------------------------------------------------
  | BASE DATA
  |--------------------------------------------------------------------------
  |
  | If the user is searching, use search results.
  | Otherwise use the complete inventory.
  |
  */

  const baseUtils = useMemo(() => {
    return getsearch.trim().length > 0 ? search : utils
  }, [getsearch, search, utils])

  /*
  |--------------------------------------------------------------------------
  | DATE HELPERS
  |--------------------------------------------------------------------------
  */

  const formatInputDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  const getDateRange = (preset) => {
    const now = new Date()

    let from = ''
    let to = ''

    switch (preset) {
      case 'today': {
        from = formatInputDate(now)
        to = formatInputDate(now)
        break
      }

      case 'yesterday': {
        const yesterday = new Date(now)
        yesterday.setDate(now.getDate() - 1)

        from = formatInputDate(yesterday)
        to = formatInputDate(yesterday)

        break
      }

      case 'thisWeek': {
        const current = new Date(now)

        const day = current.getDay()

        const diffToMonday = day === 0 ? -6 : 1 - day

        const monday = new Date(current)
        monday.setDate(current.getDate() + diffToMonday)

        const sunday = new Date(monday)
        sunday.setDate(monday.getDate() + 6)

        from = formatInputDate(monday)
        to = formatInputDate(sunday)

        break
      }

      case 'thisMonth': {
        const firstDay = new Date(
          now.getFullYear(),
          now.getMonth(),
          1
        )

        const lastDay = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0
        )

        from = formatInputDate(firstDay)
        to = formatInputDate(lastDay)

        break
      }

      case 'lastMonth': {
        const firstDay = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1
        )

        const lastDay = new Date(
          now.getFullYear(),
          now.getMonth(),
          0
        )

        from = formatInputDate(firstDay)
        to = formatInputDate(lastDay)

        break
      }

      case 'thisYear': {
        const firstDay = new Date(
          now.getFullYear(),
          0,
          1
        )

        const lastDay = new Date(
          now.getFullYear(),
          11,
          31
        )

        from = formatInputDate(firstDay)
        to = formatInputDate(lastDay)

        break
      }

      case 'lastYear': {
        const firstDay = new Date(
          now.getFullYear() - 1,
          0,
          1
        )

        const lastDay = new Date(
          now.getFullYear() - 1,
          11,
          31
        )

        from = formatInputDate(firstDay)
        to = formatInputDate(lastDay)

        break
      }

      default:
        from = ''
        to = ''
    }

    setFromDate(from)
    setToDate(to)
  }

  const handleDatePreset = (e) => {
    const value = e.target.value

    setDatePreset(value)

    if (value === '') {
      setFromDate('')
      setToDate('')
      return
    }

    getDateRange(value)
  }

  /*
  |--------------------------------------------------------------------------
  | FILTER INVENTORY
  |--------------------------------------------------------------------------
  */

  const filteredUtils = useMemo(() => {
    return (
      baseUtils?.filter((item) => {
        /*
        |--------------------------------------------------------------------------
        | SERVICE / TYPE
        |--------------------------------------------------------------------------
        */

        const matchesService =
          sort === '' || sort === item?.type

        /*
        |--------------------------------------------------------------------------
        | BATCH
        |--------------------------------------------------------------------------
        */

        const matchesBatch =
          batch === '' || batch === item?.batch

        /*
        |--------------------------------------------------------------------------
        | EXPIRY DATE
        |--------------------------------------------------------------------------
        */

        const expiryTimestamp =
          Number(item?.expireDate) || 0

        const itemDate = new Date(
          expiryTimestamp * 1000
        )

        const itemDay = new Date(
          itemDate.getFullYear(),
          itemDate.getMonth(),
          itemDate.getDate()
        )

        const from = fromDate
          ? new Date(`${fromDate}T00:00:00`)
          : null

        const to = toDate
          ? new Date(`${toDate}T23:59:59.999`)
          : null

        const matchesFromDate =
          !from || itemDay >= from

        const matchesToDate =
          !to || itemDay <= to

        return (
          matchesService &&
          matchesBatch &&
          matchesFromDate &&
          matchesToDate
        )
      }) || []
    )
  }, [
    baseUtils,
    sort,
    batch,
    fromDate,
    toDate,
  ])

  /*
  |--------------------------------------------------------------------------
  | SORT BY EXPIRY DATE
  |--------------------------------------------------------------------------
  */

  const categoryOrder = {
    drugs: 1,
    utils: 2,
    consumable: 3,
}

 const sortedUtils = useMemo(() => {

    return [...filteredUtils].sort((a, b) => {

        const categoryA =
            categoryOrder[
                String(a?.type || '').toLowerCase()
            ] || 999

        const categoryB =
            categoryOrder[
                String(b?.type || '').toLowerCase()
            ] || 999


        // First sort by category
        if (categoryA !== categoryB) {
            return categoryA - categoryB
        }


        // Then sort by expiry date
        const dateA =
            Number(a?.expireDate) || 0

        const dateB =
            Number(b?.expireDate) || 0


        return dateA - dateB

    })

}, [filteredUtils])

  /*
  |--------------------------------------------------------------------------
  | FINANCIAL / INVENTORY SUMMARY
  |--------------------------------------------------------------------------
  */

  const statistics = useMemo(() => {
  let totalProducts = 0
  let totalQuantityBought = 0
  let totalQuantitySold = 0
  let totalQuantityLeft = 0

  let totalRevenue = 0
  let totalCost = 0
  let totalProfit = 0

  let totalLoss = 0
  let totalExpiredLoss = 0

  let remainingStockValue = 0
  let potentialRevenue = 0
  let potentialProfit = 0

  // Start of today
  const now = new Date()

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  )

  filteredUtils.forEach((item) => {
    const originalPrice =
      Number(item?.originalPrice) || 0

    const sellingPrice =
      Number(item?.sellingPrice) || 0

    const originalQuantity =
      Number(item?.originalQuantity) || 0

    const quantityLeft =
      Number(item?.quantity) || 0

    // ============================================================
    // QUANTITY SOLD
    // ============================================================

    const quantitySold = Math.max(
      originalQuantity - quantityLeft,
      0
    )

    // ============================================================
    // SALES
    // ============================================================

    const revenue =
      sellingPrice * quantitySold

    const cost =
      originalPrice * quantitySold

    const profit =
      revenue - cost

    // Loss from selling below cost
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

    const isExpired =
      expiryDate &&
      !Number.isNaN(expiryDate.getTime()) &&
      expiryDate < startOfToday

    // ============================================================
    // EXPIRED STOCK LOSS
    // ============================================================

    // If there are units left and they have expired,
    // their purchase cost becomes a loss.

    const expiredLoss =
      isExpired
        ? originalPrice * quantityLeft
        : 0

    // ============================================================
    // TOTAL LOSS
    // ============================================================

    const itemLoss =
      saleLoss

    // ============================================================
    // REMAINING STOCK
    // ============================================================

    // Expired stock is no longer considered usable stock.

    const usableQuantityLeft =
      isExpired
        ? 0
        : quantityLeft

    const stockValue =
      originalPrice * usableQuantityLeft

    const possibleRevenue =
      sellingPrice * usableQuantityLeft

    const possibleProfit =
      possibleRevenue - stockValue

    // ============================================================
    // TOTALS
    // ============================================================

    totalProducts += 1

    totalQuantityBought += originalQuantity

    totalQuantitySold += quantitySold

    totalQuantityLeft += quantityLeft

    totalRevenue += revenue

    totalCost += cost

    totalProfit += profit

    totalLoss += itemLoss

    totalExpiredLoss += expiredLoss

    remainingStockValue += stockValue

    potentialRevenue += possibleRevenue

    potentialProfit += possibleProfit
  })

  // ============================================================
  // PROFIT MARGIN
  // ============================================================

  const profitMargin =
    totalRevenue > 0
      ? (totalProfit / totalRevenue) * 100
      : 0

  return {
    totalProducts,

    totalQuantityBought,

    totalQuantitySold,

    totalQuantityLeft,

    totalRevenue,

    totalCost,

    totalProfit,

    totalLoss,

    totalExpiredLoss,

    remainingStockValue,

    potentialRevenue,

    potentialProfit,

    profitMargin,
  }
}, [filteredUtils])

  /*
  |--------------------------------------------------------------------------
  | FORMAT CURRENCY
  |--------------------------------------------------------------------------
  */

  const formatCurrency = (value) => {
    return `₦${Number(value || 0).toLocaleString(
      'en-NG',
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`
  }

  /*
  |--------------------------------------------------------------------------
  | CLEAR FILTERS
  |--------------------------------------------------------------------------
  */

  const clearFilters = () => {
    setsort('')
    setbatch('')

    setFromDate('')
    setToDate('')
    setDatePreset('')

    setgetsearch('')
    setsearch([])
  }

  /*
  |--------------------------------------------------------------------------
  | DATE FILTER STATUS
  |--------------------------------------------------------------------------
  */

  const hasFilters =
    sort !== '' ||
    batch !== '' ||
    fromDate !== '' ||
    toDate !== '' ||
    getsearch !== ''

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  

  return (
    <div className="dashboard_container">

      <AdminBar info={info} />

      <div className="dashboard_body">

        {/* ============================================================
            HEADER
        ============================================================ */}

        <div className="patient_details_header">
          <div>
            <h2>Inventory Management</h2>

            <p>
              Monitor stock levels, expiry dates,
              sales, revenue and profit.
            </p>
          </div>
        </div>



        {/* ============================================================
            FILTER SECTION
        ============================================================ */}

        <div
          className="patient_details_input"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            gap: '10px',
            marginBottom: '20px',
          }}
        >

          {/* SEARCH */}
        <h4>SEARCH PRODUCT</h4>

          <div
            className="dashboard_body_header"
            style={{ margin: '0 5px' }}
          >

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
              }}
              className="dashboard_body_header_search"
            >

              <input
                type="text"
                placeholder="Search product..."
                value={getsearch}
                onChange={handleSearch}
                style={{outlineWidth: 0, outline:'none'}}
              />

              <FaSearch
                style={{
                  position: 'absolute',
                  right: '12px',
                  opacity: 0.5,
                }}
              />

            </div>
          </div>

          <div
            className="patient_details_input_field1_"
            style={{ margin: '0 5px' }}
          >

            <h4>CATEGORIES</h4>


            <select
                value={sort}
                onChange={(e) => setsort(e.target.value)}
            >
                <option value="">
                    ALL CATEGORIES
                </option>

                <option value="drugs">
                    Drugs
                </option>

                <option value="utils">
                    Utils
                </option>

                <option value="consumable">
                    Consumables
                </option>
            </select>
          </div>

          {/* SERVICE / TYPE */}

          <div
            className="patient_details_input_field1_"
            style={{ margin: '0 5px' }}
          >

            <h4>SERVICE TYPE</h4>

            <select
              value={sort}
              onChange={(e) =>
                setsort(e.target.value)
              }
            >

              <option value="">
                ALL SERVICES
              </option>

              <option value="drugs">
                DRUGS
              </option>

              <option value="utils">
                UTILITY
              </option>

              <option value="consumable">
                CONSUMABLE
              </option>

            </select>

          </div>


          {/* BATCH */}

          <div
            className="patient_details_input_field1_"
            style={{ margin: '0 5px' }}
          >

            <h4>BATCH</h4>

            <input
              type="text"
              placeholder="Batch..."
              value={batch}
              onChange={(e) =>
                setbatch(e.target.value)
              }
            />

          </div>


          {/* QUICK DATE */}

          <div
            className="patient_details_input_field1_"
            style={{ margin: '0 5px' }}
          >

            <h4>QUICK DATE</h4>

            <select
              value={datePreset}
              onChange={handleDatePreset}
            >

              <option value="">
                ALL DATES
              </option>

              <option value="today">
                TODAY
              </option>

              <option value="yesterday">
                YESTERDAY
              </option>

              <option value="thisWeek">
                THIS WEEK
              </option>

              <option value="thisMonth">
                THIS MONTH
              </option>

              <option value="lastMonth">
                LAST MONTH
              </option>

              <option value="thisYear">
                THIS YEAR
              </option>

              <option value="lastYear">
                LAST YEAR
              </option>

            </select>

          </div>


          {/* FROM DATE */}

          <div
            className="patient_details_input_field1_"
            style={{ margin: '0 5px' }}
          >

            <h4>FROM EXPIRY DATE</h4>

            <input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value)
                setDatePreset('')
              }}
            />

          </div>


          {/* TO DATE */}

          <div
            className="patient_details_input_field1_"
            style={{ margin: '0 5px' }}
          >

            <h4>TO EXPIRY DATE</h4>

            <input
              type="date"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value)
                setDatePreset('')
              }}
            />

          </div>


          {/* CLEAR */}

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                height: '42px',
                padding: '0 15px',
                cursor: 'pointer',
              }}
            >
              <FaTimes />

              CLEAR FILTERS
            </button>
          )}

            <InventoryPDF
                inventory={sortedUtils}
                statistics={statistics}
                sort={sort}
                batch={batch}
                fromDate={fromDate}
                toDate={toDate}
            />
        </div>


        {/* ============================================================
            ACTIVE FILTER MESSAGE
        ============================================================ */}

        <div
          style={{
            marginBottom: '20px',
            fontSize: '14px',
            opacity: 0.7,
          }}
        >

          Showing{' '}

          <strong>
            {filteredUtils.length}
          </strong>{' '}

          of{' '}

          <strong>
            {utils.length}
          </strong>{' '}

          inventory items.

          {(fromDate || toDate) && (
            <span>
              {' '}
              Filtered by expiry date
              {fromDate && ` from ${fromDate}`}
              {toDate && ` to ${toDate}`}.
            </span>
          )}

        </div>


        {/* ============================================================
            FINANCIAL SUMMARY
        ============================================================ */}

        <div className="management_summary">

          {/* PRODUCTS */}

          <div className="management_summary_card">

            <h4>PRODUCTS</h4>

            <h2>
              {statistics.totalProducts.toLocaleString()}
            </h2>

            <p>
              Products in current filter
            </p>

          </div>


          {/* QTY BOUGHT */}

          <div className="management_summary_card">

            <h4>QTY BOUGHT</h4>

            <h2>
              {statistics.totalQuantityBought.toLocaleString()}
            </h2>

            <p>
              Total units purchased
            </p>

          </div>


          {/* QTY SOLD */}

          <div className="management_summary_card">

            <h4>QTY SOLD</h4>

            <h2>
              {statistics.totalQuantitySold.toLocaleString()}
            </h2>

            <p>
              Total units sold
            </p>

          </div>


          {/* QTY LEFT */}

          <div className="management_summary_card">

            <h4>QTY LEFT</h4>

            <h2>
              {statistics.totalQuantityLeft.toLocaleString()}
            </h2>

            <p>
              Units remaining
            </p>

          </div>


          {/* REVENUE */}

          <div className="management_summary_card">

            <h4>SALES REVENUE</h4>

            <h2>
              {formatCurrency(
                statistics.totalRevenue
              )}
            </h2>

            <p>
              Revenue from sold stock
            </p>

          </div>


          {/* COST */}

          <div className="management_summary_card">

            <h4>COST OF GOODS SOLD</h4>

            <h2>
              {formatCurrency(
                statistics.totalCost
              )}
            </h2>

            <p>
              Purchase cost of sold units
            </p>

          </div>


          {/* PROFIT */}

          <div className="management_summary_card">

            <h4>PROFIT</h4>

            <h2>
              {formatCurrency(
                statistics.totalProfit
              )}
            </h2>

            <p>
              Gross profit from sold units
            </p>

          </div>


          {/* LOSS */}

          <div className="management_summary_card">

            <h4>Price Loss</h4>

            <h2>
              {formatCurrency(
                statistics.totalLoss
              )}
            </h2>

            <p>
              Sales losses + expired stock
            </p>

          </div>

          <div className="management_summary_card">

            <h4>Expiry Loss</h4>

            <h2>
              {formatCurrency(
                statistics.totalExpiredLoss
              )}
            </h2>

            <p>
              Sales losses + expired stock
            </p>

          </div>

          <div className="management_summary_card">

            <h4>Total Loss</h4>

            <h2>
              {formatCurrency(
                statistics.totalExpiredLoss + statistics.totalLoss
              )}
            </h2>

            <p>
              Sales losses + expired stock
            </p>

          </div>


          {/* PROFIT MARGIN */}

          <div className="management_summary_card">

            <h4>PROFIT MARGIN</h4>

            <h2>
              {statistics.profitMargin.toFixed(2)}%
            </h2>

            <p>
              Gross profit / revenue
            </p>

          </div>


          {/* STOCK VALUE */}

          <div className="management_summary_card">

            <h4>REMAINING STOCK VALUE</h4>

            <h2>
              {formatCurrency(
                statistics.remainingStockValue
              )}
            </h2>

            <p>
              Current purchase value
            </p>

          </div>


          {/* POTENTIAL REVENUE */}

          <div className="management_summary_card">

            <h4>POTENTIAL REVENUE</h4>

            <h2>
              {formatCurrency(
                statistics.potentialRevenue
              )}
            </h2>

            <p>
              If remaining stock is sold
            </p>

          </div>


          {/* POTENTIAL PROFIT */}

          <div className="management_summary_card">

            <h4>POTENTIAL PROFIT</h4>

            <h2>
              {formatCurrency(
                statistics.potentialProfit
              )}
            </h2>

            <p>
              Expected profit from remaining stock
            </p>

          </div>

        </div>


        {/* ============================================================
            FINANCIAL SUMMARY SENTENCE
        ============================================================ */}

        <div
          style={{
            padding: '18px',
            margin: '20px 0',
            border: '1px solid #ddd',
            borderRadius: '8px',
            lineHeight: '1.7',
          }}

        >

          <strong>Inventory summary:</strong>{' '}

          You purchased{' '}

          <strong>
            {statistics.totalQuantityBought.toLocaleString()}
          </strong>{' '}

          units across{' '}

          <strong>
            {statistics.totalProducts.toLocaleString()}
          </strong>{' '}

          products.

          So far,{' '}

          <strong>
            {statistics.totalQuantitySold.toLocaleString()}
          </strong>{' '}

          units have been sold, generating{' '}

          <strong>
            {formatCurrency(
              statistics.totalRevenue
            )}
          </strong>{' '}

          in sales revenue.

          Your cost for those sold units is{' '}

          <strong>
            {formatCurrency(
              statistics.totalCost
            )}
          </strong>{' '}

          giving you a gross{' '}

          <strong>
            {formatCurrency(
              statistics.totalProfit
            )}
          </strong>{' '}

          profit.

          There are currently{' '}

          <strong>
            {statistics.totalQuantityLeft.toLocaleString()}
          </strong>{' '}

          units remaining, with a purchase value of{' '}

          <strong>
            {formatCurrency(
              statistics.remainingStockValue
            )}
          </strong>{' '}

          and potential selling revenue of{' '}

          <strong>
            {formatCurrency(
              statistics.potentialRevenue
            )}
          </strong>.

        </div>


        {/* ============================================================
            INVENTORY TABLE
        ============================================================ */}

        <div
          className="management_table_container"
          style={{
            overflowX: 'auto',
          }}
        >

          <div
            className="management_table"
            style={{
              minWidth: '1500px',
            }}
          >

            {/* TABLE HEADER */}

            <div className="drug_top_label">

              <h5 style={{ width: '8.33%', textAlign: 'center' }} >
                EXPIRES ON
              </h5>

              <h5 style={{ width: '8.33%', textAlign: 'center' }} >
                PRODUCT
              </h5>

              <h5 style={{ width: '8.33%', textAlign: 'center' }} >
                BUY PRICE / UNIT
              </h5>

              <h5 style={{ width: '8.33%', textAlign: 'center' }} >
                SELL PRICE / UNIT
              </h5>

              <h5 style={{ width: '8.33%', textAlign: 'center' }} >
                QTY BOUGHT
              </h5>

              <h5 style={{ width: '8.33%', textAlign: 'center' }} >
                QTY LEFT
              </h5>

              <h5 style={{ width: '8.33%', textAlign: 'center' }} >
                QTY SOLD
              </h5>

              <h5 style={{ width: '8.33%', textAlign: 'center' }} >
                SALES REVENUE
              </h5>

              <h5 style={{ width: '8.33%', textAlign: 'center' }} >
                COST OF GOODS SOLD
              </h5>

              <h5 style={{ width: '8.33%', textAlign: 'center' }} >
                PROFIT
              </h5>

              <h5 style={{ width: '8.33%', textAlign: 'center' }} >
                LOSS
              </h5>

              <h5 style={{ width: '8.33%', textAlign: 'center' }} >
                BATCH
              </h5>

            </div>


            {/* TABLE BODY */}

            {sortedUtils.length > 0 ? (

              sortedUtils.map((item, index) => (

                <ManageMentBar
                  key={
                    item?._id ||
                    item?.id ||
                    `${item?.name}-${index}`
                  }
                  item={item}
                  sort={sort}
                  batch={batch}
                  fromDate={fromDate}
                  toDate={toDate}
                />

              ))

            ) : (

              <div
                style={{
                  padding: '50px 20px',
                  textAlign: 'center',
                  opacity: 0.6,
                }}
              >

                <h3>
                  No inventory found
                </h3>

                <p>
                  Try changing your search or
                  filter settings.
                </p>

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  )
}

export default DrugDate
