"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ShieldAlert,
  Fingerprint,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "../EmptyState";


type DriverRisk = {
  id: string;
  level: "low" | "medium" | "high";
  status: string;
  reason: string | null;
  detectedBy: string | null;
  createdAt: string;
};


type Props = {
  risks: DriverRisk[];

  RISK_CLS: Record<string, string>;

  fmt: (v?: string | null) => string;

  InfoCell: any;

  Pill: any;

  limit?: number;
};



export function DriverRisks({
  risks,
  RISK_CLS,
  fmt,
  InfoCell,
  Pill,
  limit = 5,
}: Props) {


  const [page, setPage] = useState(1);



  const [levelFilter, setLevelFilter] = useState<
    "all" | "low" | "medium" | "high"
  >("all");



  const [statusFilter, setStatusFilter] = useState<
    "all" | string
  >("all");



  /**
   * No risks from API
   */
  if (risks.length === 0) {

    return (
      <EmptyState
        icon={ShieldAlert}
        title="No risk flags found."
      />
    );

  }




  const filteredData = useMemo(() => {

    return risks.filter((risk) => {

      const levelOk =
        levelFilter === "all" ||
        risk.level === levelFilter;



      const statusOk =
        statusFilter === "all" ||
        risk.status === statusFilter;



      return levelOk && statusOk;

    });

  }, [
    risks,
    levelFilter,
    statusFilter,
  ]);




  const total =
    filteredData.length;



  const totalPages =
    Math.max(
      1,
      Math.ceil(total / limit)
    );




  const paginated = useMemo(() => {

    const start =
      (page - 1) * limit;


    return filteredData.slice(
      start,
      start + limit
    );


  }, [
    filteredData,
    page,
    limit,
  ]);





  useEffect(() => {

    setPage(1);

  }, [
    levelFilter,
    statusFilter,
  ]);






  return (

    <div className="space-y-4">


      {/* FILTER */}

      <div className="flex gap-2 flex-wrap">


        <select
          className="border rounded px-2 py-1 text-sm"
          value={levelFilter}
          onChange={(e) =>
            setLevelFilter(
              e.target.value as any
            )
          }
        >

          <option value="all">
            All Levels
          </option>

          <option value="low">
            Low
          </option>

          <option value="medium">
            Medium
          </option>

          <option value="high">
            High
          </option>


        </select>





        <select
          className="border rounded px-2 py-1 text-sm"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
        >

          <option value="all">
            All Status
          </option>



          {[
            ...new Set(
              risks.map(
                (r) => r.status
              )
            ),
          ].map((status) => (

            <option
              key={status}
              value={status}
            >
              {status}
            </option>

          ))}


        </select>






        <Button
          size="sm"
          variant="outline"
          onClick={() => {

            setLevelFilter("all");

            setStatusFilter("all");

          }}
        >
          Reset
        </Button>


      </div>






      {/* FILTER RESULT EMPTY */}

      {paginated.length === 0 && (

        <EmptyState
          icon={ShieldAlert}
          title="No matching risk flags found."
        />

      )}






      {/* LIST */}


      {paginated.map((risk) => (

        <div
          key={risk.id}
          className="bg-background border rounded-xl overflow-hidden"
        >


          <div className="flex items-center justify-between px-5 py-3 border-b bg-muted/30">


            <div className="flex items-center gap-2">

              <ShieldAlert
                className="h-3.5 w-3.5 text-muted-foreground"
              />

              <span className="text-xs font-semibold">
                Risk flag
              </span>


            </div>





            <div className="flex items-center gap-2">


              <Pill
                label={risk.level}
                cls={
                  RISK_CLS[risk.level]
                }
              />



              <Pill
                label={risk.status}
                cls={

                  risk.status === "blocked"

                  ? "bg-red-50 text-red-800 border-red-200"

                  : risk.status === "flagged"

                  ? "bg-amber-50 text-amber-800 border-amber-200"

                  : "bg-gray-100 text-gray-600 border-gray-200"

                }
              />


            </div>


          </div>






          <div className="p-5 space-y-3">


            <div className="text-sm bg-muted/30 border rounded-lg px-4 py-3">

              {risk.reason ?? "No reason provided."}

            </div>






            <div className="grid sm:grid-cols-2 gap-3">


              <InfoCell
                icon={Fingerprint}
                label="Detected by"
                value={
                  risk.detectedBy ?? "System"
                }
              />




              <InfoCell
                icon={Clock}
                label="Flagged on"
                value={
                  fmt(risk.createdAt)
                }
              />


            </div>


          </div>


        </div>

      ))}







      {/* PAGINATION */}

      {total > limit && (

        <div className="flex justify-between items-center pt-2">


          <p className="text-xs text-muted-foreground">

            Page {page} of {totalPages}

          </p>





          <div className="flex gap-2">


            <Button
              size="sm"
              variant="outline"
              disabled={page === 1}
              onClick={() =>
                setPage(
                  (p) => p - 1
                )
              }
            >

              Prev

            </Button>





            <Button
              size="sm"
              variant="outline"
              disabled={page === totalPages}
              onClick={() =>
                setPage(
                  (p) => p + 1
                )
              }
            >

              Next

            </Button>


          </div>


        </div>

      )}



    </div>

  );

}