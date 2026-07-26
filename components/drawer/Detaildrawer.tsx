"use client"

import React, { useEffect } from "react"
import {
  X,
  Hash,
  Building2,
  User as UserIcon,
  Car,
  MapPin,
  Droplets,
  Fuel as NozzleIcon,
  CalendarClock,
  CreditCard,
} from "lucide-react"
import type { StationTransactionResource } from "@/types/station-transaction"
import { fmtDate, fmtTime, getPaymentMeta, liters, money } from "@/lib/utils"
import { TypeTag } from "../badges/Pill"

export default function DetailDrawer({
  tx,
  onClose,
  onMarkPaid,
}: {
  tx: StationTransactionResource | null
  onClose: () => void
  onMarkPaid: (id: string) => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  if (!tx) return null
  const meta = getPaymentMeta(tx.payment?.status)
  const isOrg = tx.type === "ORGANIZATION"

  return (
    <div className="drawer-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="drawer">
        <div className="drawer-head">
          <div>
            <p className="drawer-eyebrow">Transaction</p>
            <h3 className="drawer-title">{tx.transactionNumber ?? tx.id}</h3>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="drawer-body">
          <section className="drawer-section">
            <div className="drawer-hero" style={{ background: meta.bg }}>
              <div>
                <p className="drawer-hero-label" style={{ color: meta.color }}>
                  {meta.label}
                </p>
                <p className="drawer-hero-amount">{money(tx.dispensing.totalAmount)}</p>
              </div>
              <meta.Icon size={28} style={{ color: meta.color }} />
            </div>
          </section>

          <section className="drawer-section">
            <p className="section-label">Request</p>
            <div className="kv-row">
              <span className="kv-key">
                <Hash size={14} /> Fuel request
              </span>
              <span className="kv-val mono">{tx.request?.id ?? "— walk-in —"}</span>
            </div>
            {tx.request && (
              <>
                <div className="kv-row">
                  <span className="kv-key">Requested</span>
                  <span className="kv-val mono">{liters(tx.request.requestedLiters)}</span>
                </div>
                <div className="kv-row">
                  <span className="kv-key">Approved</span>
                  <span className="kv-val mono">
                    {tx.request.approvedLiters != null ? liters(tx.request.approvedLiters) : "—"}
                  </span>
                </div>
              </>
            )}
            <div className="kv-row">
              <span className="kv-key">Type</span>
              <span className="kv-val">
                <TypeTag type={tx.type} />
              </span>
            </div>
            <div className="kv-row">
              <span className="kv-key">Status</span>
              <span className="kv-val">{tx.status}</span>
            </div>
          </section>

          <section className="drawer-section">
            <p className="section-label">Party</p>
            <div className="kv-row">
              <span className="kv-key">
                {isOrg ? <Building2 size={14} /> : <UserIcon size={14} />} {isOrg ? "Organization" : "Customer"}
              </span>
              <span className="kv-val">{tx.customer.name}</span>
            </div>
            {tx.customer.phone && (
              <div className="kv-row">
                <span className="kv-key">Phone</span>
                <span className="kv-val mono">{tx.customer.phone}</span>
              </div>
            )}
            {tx.vehicle && (
              <>
                <div className="kv-row">
                  <span className="kv-key">
                    <Car size={14} /> Vehicle
                  </span>
                  <span className="kv-val mono">{tx.vehicle.plateNumber}</span>
                </div>
                {tx.vehicle.model && (
                  <div className="kv-row">
                    <span className="kv-key">Model</span>
                    <span className="kv-val">{tx.vehicle.model}</span>
                  </div>
                )}
              </>
            )}
            {tx.dispensing.attendant && (
              <div className="kv-row">
                <span className="kv-key">
                  <UserIcon size={14} /> Attendant
                </span>
                <span className="kv-val">{tx.dispensing.attendant.name}</span>
              </div>
            )}
          </section>

          <section className="drawer-section">
            <p className="section-label">Station & fuel</p>
            <div className="kv-row">
              <span className="kv-key">
                <MapPin size={14} /> Station
              </span>
              <span className="kv-val">{tx.station.name}</span>
            </div>
            <div className="kv-row">
              <span className="kv-key">
                <Droplets size={14} /> Fuel type
              </span>
              <span className="kv-val">{tx.dispensing.fuelType.name}</span>
            </div>
            {tx.dispensing.nozzle && (
              <div className="kv-row">
                <span className="kv-key">
                  <NozzleIcon size={14} /> Nozzle
                </span>
                <span className="kv-val">
                  {tx.dispensing.nozzle.name}
                  {tx.dispensing.nozzle.number ? ` (#${tx.dispensing.nozzle.number})` : ""}
                </span>
              </div>
            )}
            <div className="kv-row">
              <span className="kv-key">Liters given</span>
              <span className="kv-val mono">{liters(tx.dispensing.liters)}</span>
            </div>
            <div className="kv-row">
              <span className="kv-key">Price / liter</span>
              <span className="kv-val mono">Br {tx.dispensing.pricePerLiter.toFixed(2)}</span>
            </div>
            <div className="kv-row total">
              <span className="kv-key">Total cost</span>
              <span className="kv-val mono">{money(tx.dispensing.totalAmount)}</span>
            </div>
          </section>

          <section className="drawer-section">
            <p className="section-label">Timeline</p>
            <div className="kv-row">
              <span className="kv-key">
                <CalendarClock size={14} /> Created
              </span>
              <span className="kv-val">
                {fmtDate(tx.createdAt)} · {fmtTime(tx.createdAt)}
              </span>
            </div>
            {tx.timeline.verifiedAt && (
              <div className="kv-row">
                <span className="kv-key">Verified</span>
                <span className="kv-val">
                  {fmtDate(tx.timeline.verifiedAt)} · {fmtTime(tx.timeline.verifiedAt)}
                </span>
              </div>
            )}
            {tx.timeline.approvedAt && (
              <div className="kv-row">
                <span className="kv-key">Approved</span>
                <span className="kv-val">
                  {fmtDate(tx.timeline.approvedAt)} · {fmtTime(tx.timeline.approvedAt)}
                </span>
              </div>
            )}
            {tx.timeline.completedAt && (
              <div className="kv-row">
                <span className="kv-key">Completed</span>
                <span className="kv-val">
                  {fmtDate(tx.timeline.completedAt)} · {fmtTime(tx.timeline.completedAt)}
                </span>
              </div>
            )}
            {tx.timeline.cancelledAt && (
              <div className="kv-row">
                <span className="kv-key">Cancelled</span>
                <span className="kv-val">
                  {fmtDate(tx.timeline.cancelledAt)} · {fmtTime(tx.timeline.cancelledAt)}
                </span>
              </div>
            )}
          </section>
        </div>

        {tx.payment.status?.toUpperCase() !== "PAID" && (
          <div className="drawer-footer">
            <button className="btn btn-primary" onClick={() => onMarkPaid(tx.id)}>
              <CreditCard size={15} />
              Mark as paid
            </button>
          </div>
        )}
      </div>
    </div>
  )
}