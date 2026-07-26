"use client"

import React from "react"

/**
 * One shared stylesheet for the whole ledger. Rendered once by the page
 * component so every child (StatCards, Filters, Table, Drawer) can rely on
 * the same class names and CSS custom properties without repeating <style>
 * blocks in each file.
 */
export default function TransactionStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

      .page {
        --navy: #0E2436;
        --navy-2: #16324A;
        --amber: #E8A33D;
        --amber-dark: #B9761F;
        --amber-bg: #FDF3E2;
        --green: #1F9D6C;
        --green-bg: #E7F7EF;
        --red: #DC4C4C;
        --red-bg: #FCEAEA;
        --bg: #F1F4F8;
        --surface: #FFFFFF;
        --border: #E4E7EC;
        --text: #16212B;
        --muted: #64748B;
        font-family: 'Inter', sans-serif;
        background: var(--bg);
        color: var(--text);
        min-height: 100vh;
      }
      .page .mono { font-family: 'JetBrains Mono', monospace; }

      .topbar {
        background: linear-gradient(135deg, var(--navy), var(--navy-2));
        color: #fff;
        padding: 28px 32px 40px;
      }
      .topbar-inner { max-width: 1180px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
      .brand { display: flex; align-items: center; gap: 14px; }
      .brand-icon {
        width: 44px; height: 44px; border-radius: 12px;
        background: rgba(232,163,61,0.18); color: var(--amber);
        display: flex; align-items: center; justify-content: center;
      }
      .brand h1 { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 700; margin: 0; letter-spacing: -0.01em; }
      .brand p { margin: 2px 0 0; font-size: 13px; color: rgba(255,255,255,0.65); }
      .station-chip {
        display: flex; align-items: center; gap: 8px;
        background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.14);
        padding: 8px 14px; border-radius: 10px; font-size: 13px; font-weight: 500;
      }

      .content { max-width: 1180px; margin: -26px auto 0; padding: 0 32px 48px; }

      .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px; }
      @media (max-width: 900px) { .stat-grid { grid-template-columns: repeat(2, 1fr); } }
      @media (max-width: 560px) { .stat-grid { grid-template-columns: 1fr; } }

      .stat-card {
        background: var(--surface); border: 1px solid var(--border); border-radius: 16px;
        padding: 18px 20px; box-shadow: 0 1px 2px rgba(16,24,40,0.04);
      }
      .stat-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
      .stat-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
      .stat-delta { display: flex; align-items: center; gap: 2px; font-size: 12px; font-weight: 600; }
      .stat-delta.up { color: var(--green); }
      .stat-delta.down { color: var(--red); }
      .stat-value { font-family: 'Space Grotesk', sans-serif; font-size: 24px; font-weight: 700; margin: 0; letter-spacing: -0.01em; }
      .stat-title { font-size: 12.5px; color: var(--muted); margin: 3px 0 0; }

      .gauge-wrap { display: flex; flex-direction: column; align-items: center; margin-top: -6px; }
      .gauge-label { text-align: center; margin-top: -6px; }
      .gauge-value { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-weight: 700; }
      .gauge-sub { font-size: 11.5px; color: var(--muted); }

      .panel { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; box-shadow: 0 1px 2px rgba(16,24,40,0.04); }
      .filters { padding: 18px 20px; display: flex; flex-direction: column; gap: 12px; }
      .filter-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: space-between; }
      .seg-group { display: flex; gap: 6px; flex-wrap: wrap; }
      .seg-btn {
        border: 1px solid var(--border); background: #fff; color: var(--muted);
        font-size: 12.5px; font-weight: 600; padding: 7px 13px; border-radius: 9px; cursor: pointer;
        transition: all .12s ease;
      }
      .seg-btn:hover { border-color: var(--navy-2); }
      .seg-btn.active { background: var(--navy); color: #fff; border-color: var(--navy); }
      .seg-btn.active.pay-PAID { background: var(--green); border-color: var(--green); }
      .seg-btn.active.pay-PARTIAL { background: var(--amber-dark); border-color: var(--amber-dark); }
      .seg-btn.active.pay-UNPAID { background: var(--red); border-color: var(--red); }

      .search-box { position: relative; max-width: 340px; flex: 1; min-width: 220px; }
      .search-box svg { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: var(--muted); }
      .search-box input {
        width: 100%; box-sizing: border-box; padding: 9px 12px 9px 34px; border-radius: 9px;
        border: 1px solid var(--border); font-size: 13.5px; font-family: 'Inter', sans-serif; outline: none;
      }
      .search-box input:focus { border-color: var(--navy-2); box-shadow: 0 0 0 3px rgba(22,50,74,0.08); }

      .select-wrap { position: relative; }
      .select-wrap select {
        appearance: none; border: 1px solid var(--border); background: #fff; color: var(--text);
        font-size: 12.5px; font-weight: 600; padding: 7px 28px 7px 12px; border-radius: 9px; cursor: pointer;
      }
      .select-wrap svg { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); pointer-events: none; color: var(--muted); }

      /* --- redesigned filter bar --- */
      .filters-head {
        display: flex; align-items: center; justify-content: space-between;
        padding: 16px 20px 0;
      }
      .filters-head-left { display: flex; align-items: center; gap: 8px; color: var(--navy); }
      .filters-title { font-family: 'Space Grotesk', sans-serif; font-size: 13.5px; font-weight: 700; }
      .filters-count {
        background: var(--navy); color: #fff; font-size: 11px; font-weight: 700;
        min-width: 18px; height: 18px; padding: 0 5px; border-radius: 999px;
        display: inline-flex; align-items: center; justify-content: center;
      }
      .filters-clear {
        display: flex; align-items: center; gap: 4px; border: none; background: none;
        color: var(--muted); font-size: 12px; font-weight: 600; cursor: pointer;
        padding: 5px 8px; border-radius: 7px; transition: all .12s ease;
      }
      .filters-clear:hover { background: var(--red-bg); color: var(--red); }

      .filters-groups {
        display: flex; flex-wrap: wrap; gap: 18px 24px;
        padding: 14px 20px 16px; border-bottom: 1px solid var(--border);
      }
      .filter-group { display: flex; flex-direction: column; gap: 7px; }
      .filter-group-label {
        font-size: 10.5px; font-weight: 700; text-transform: uppercase;
        letter-spacing: 0.06em; color: var(--muted);
      }

      .select-wrap.icon-select select { padding-left: 30px; }
      .select-wrap.icon-select .select-icon {
        position: absolute; left: 10px; top: 50%; transform: translateY(-50%);
        color: var(--muted); pointer-events: none;
      }
      .select-wrap.icon-select .select-chevron {
        position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
        pointer-events: none; color: var(--muted);
      }

      .filters-search { padding: 14px 20px 0; }
      .search-box .clear-btn {
        position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
        border: none; background: none; cursor: pointer; color: var(--muted);
        display: flex; padding: 2px; border-radius: 5px;
      }
      .search-box .clear-btn:hover { color: var(--red); background: var(--red-bg); }
      .filters-search .search-box input { padding-right: 30px; }

      .active-chips { display: flex; flex-wrap: wrap; gap: 6px; padding: 14px 20px 16px; }
      .chip {
        display: inline-flex; align-items: center; gap: 5px; background: #EEF1F5;
        color: var(--navy); border: 1px solid var(--border); font-size: 11.5px; font-weight: 600;
        padding: 4px 8px 4px 10px; border-radius: 999px; cursor: pointer; transition: all .12s ease;
      }
      .chip:hover { border-color: var(--red); color: var(--red); background: var(--red-bg); }

      .table-wrap { overflow-x: auto; }
      table { width: 100%; border-collapse: collapse; font-size: 13px; min-width: 880px; }
      thead th {
        text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em;
        color: var(--muted); font-weight: 600; padding: 12px 16px; border-bottom: 1px solid var(--border);
        background: #FAFBFC; position: sticky; top: 0;
      }
      tbody td { padding: 13px 16px; border-bottom: 1px solid var(--border); vertical-align: middle; }
      tbody tr { cursor: pointer; transition: background .1s ease; }
      tbody tr:hover { background: #F7F9FB; }
      tbody tr:last-child td { border-bottom: none; }

      .tx-id { font-weight: 600; }
      .tx-sub { font-size: 11.5px; color: var(--muted); margin-top: 1px; }
      .party-main { font-weight: 600; display: flex; align-items: center; gap: 6px; }
      .party-sub { font-size: 11.5px; color: var(--muted); margin-top: 2px; }
      .cell-muted { color: var(--muted); font-size: 12.5px; }
      .amount { font-weight: 700; }

      .pill {
        display: inline-flex; align-items: center; gap: 4px; font-size: 11.5px; font-weight: 700;
        padding: 4px 9px; border-radius: 999px;
      }
      .typetag {
        display: inline-flex; align-items: center; gap: 5px; font-size: 11.5px; font-weight: 600;
        padding: 4px 9px; border-radius: 7px;
      }

      .empty { padding: 64px 20px; text-align: center; }
      .empty h4 { font-family: 'Space Grotesk', sans-serif; font-size: 16px; margin: 12px 0 4px; }
      .empty p { color: var(--muted); font-size: 13.5px; margin: 0; }

      .pagination { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; }
      .pagination p { font-size: 12.5px; color: var(--muted); margin: 0; }
      .page-btns { display: flex; gap: 6px; }
      .icon-btn {
        width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border); background: #fff;
        display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text);
      }
      .icon-btn:disabled { opacity: 0.4; cursor: not-allowed; }
      .icon-btn:hover:not(:disabled) { border-color: var(--navy-2); }

      .drawer-backdrop {
        position: fixed; inset: 0; background: rgba(14,36,54,0.4); backdrop-filter: blur(2px);
        display: flex; justify-content: flex-end; z-index: 50;
      }
      .drawer {
        width: 380px; max-width: 92vw; height: 100%; background: var(--surface);
        display: flex; flex-direction: column; box-shadow: -8px 0 30px rgba(16,24,40,0.15);
        animation: slidein .18s ease;
      }
      @keyframes slidein { from { transform: translateX(24px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      .drawer-head { display: flex; align-items: flex-start; justify-content: space-between; padding: 20px 20px 14px; border-bottom: 1px solid var(--border); }
      .drawer-eyebrow { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); margin: 0 0 2px; }
      .drawer-title { font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 600; margin: 0; }
      .drawer-body { padding: 16px 20px 8px; overflow-y: auto; flex: 1; }
      .drawer-section { margin-bottom: 20px; }
      .drawer-hero { border-radius: 14px; padding: 16px 18px; display: flex; align-items: center; justify-content: space-between; }
      .drawer-hero-label { font-size: 12px; font-weight: 700; margin: 0 0 3px; text-transform: uppercase; letter-spacing: 0.03em; }
      .drawer-hero-amount { font-family: 'Space Grotesk', sans-serif; font-size: 24px; font-weight: 700; margin: 0; color: var(--navy); }
      .section-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); font-weight: 700; margin: 0 0 8px; }
      .kv-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed var(--border); font-size: 13px; }
      .kv-row:last-child { border-bottom: none; }
      .kv-row.total .kv-key, .kv-row.total .kv-val { font-weight: 700; }
      .kv-key { color: var(--muted); display: flex; align-items: center; gap: 6px; }
      .kv-val { font-weight: 500; text-align: right; }
      .drawer-footer { padding: 16px 20px; border-top: 1px solid var(--border); }
      .btn { border: none; border-radius: 10px; padding: 11px 16px; font-size: 13.5px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; }
      .btn-primary { background: var(--navy); color: #fff; }
      .btn-primary:hover { background: var(--navy-2); }
    `}</style>
  )
}