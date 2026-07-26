"use client"

import React from "react"
import { Search, Building2, User as UserIcon, ChevronLeft, ChevronRight } from "lucide-react"
import type { StationTransactionResource } from "@/types/station-transaction"
import { Pill, TypeTag } from "../badges/Pill"
import { fmtDate, fmtTime, liters, money } from "@/lib/utils"

const PAGE_SIZE = 9

export default function TransactionsTable({
  transactions,
  loading,
  page,
  total,
  totalPages,
  onPageChange,
  onSelect,
}: {
  transactions: StationTransactionResource[]
  loading: boolean
  page: number
  total: number
  totalPages: number
  onPageChange: (p: number) => void
  onSelect: (tx: StationTransactionResource) => void
}) {
  return (
    <div className="panel">
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Transaction</th>
              <th>Type</th>
              <th>Party</th>
              <th>Station</th>
              <th>Fuel</th>
              <th>Liters</th>
              <th>Price / L</th>
              <th>Total</th>
              <th>Payment</th>
              <th>When</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10}>
                  <div className="empty">
                    <p>Loading transactions…</p>
                  </div>
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={10}>
                  <div className="empty">
                    <Search size={26} style={{ color: "var(--muted)" }} />
                    <h4>No transactions match these filters</h4>
                    <p>Try clearing the search or switching the payment filter back to “All”.</p>
                  </div>
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id} onClick={() => onSelect(tx)}>
                  <td>
                    <p className="tx-id mono">{tx.transactionNumber ?? tx.id}</p>
                    <p className="tx-sub mono">{tx.request?.id ?? "walk-in"}</p>
                  </td>
                  <td>
                    <TypeTag type={tx.type} />
                  </td>
                  <td>
                    <div className="party-main">
                      {tx.customer.type === "ORGANIZATION" ? <Building2 size={13} /> : <UserIcon size={13} />}
                      {tx.customer.name}
                    </div>
                    {tx.vehicle && <p className="party-sub mono">{tx.vehicle.plateNumber}</p>}
                  </td>
                  <td className="cell-muted">{tx.station.name}</td>
                  <td className="cell-muted">{tx.dispensing.fuelType.name}</td>
                  <td className="mono">{liters(tx.dispensing.liters)}</td>
                  <td className="mono cell-muted">Br {tx.dispensing.pricePerLiter.toFixed(2)}</td>
                  <td className="amount mono">{money(tx.dispensing.totalAmount)}</td>
                  <td>
                    <Pill status={tx.payment.status} />
                  </td>
                  <td className="cell-muted">
                    {fmtDate(tx.createdAt)}
                    <br />
                    <span style={{ fontSize: 11 }}>{fmtTime(tx.createdAt)}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <p>
          Showing {transactions.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
          {Math.min(page * PAGE_SIZE, total)} of {total}
        </p>
        <div className="page-btns">
          <button className="icon-btn" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
            <ChevronLeft size={16} />
          </button>
          <button className="icon-btn" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export { PAGE_SIZE }