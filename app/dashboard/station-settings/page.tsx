"use client"

import { useState } from "react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

import {
  Save,
  Fuel,
  Settings,
  SlidersHorizontal,
  MapPin,
  ShieldAlert,
  Activity,
  Gauge,
  AlertTriangle,
} from "lucide-react"

export default function StationSettingsPage() {
  const [thresholds, setThresholds] = useState({
    low: 10,
    medium: 25,
  })

  const [manualMode, setManualMode] = useState(false)
  const [manualQueue, setManualQueue] = useState(0)

  const [manualTraffic, setManualTraffic] = useState<
    "low" | "medium" | "high"
  >("low")

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      {/* =======================================================
       HEADER
      ======================================================= */}

      <div className="flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Station Settings
          </h1>

          <p className="mt-1 text-muted-foreground">
            Manage station information, queue intelligence,
            AI fallback systems, and operational controls.
          </p>
        </div>

        <Button size="lg">
          <Save className="mr-2 h-4 w-4" />
          Save All Changes
        </Button>
      </div>

      {/* =======================================================
       OVERVIEW CARDS
      ======================================================= */}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <Fuel className="h-5 w-5 text-primary" />

              <Badge>Active</Badge>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Fuel System
            </p>

            <h3 className="text-2xl font-bold">
              Operational
            </h3>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <Activity className="h-5 w-5 text-primary" />

              <Badge variant="secondary">
                AI Enabled
              </Badge>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Queue Intelligence
            </p>

            <h3 className="text-2xl font-bold">
              Running
            </h3>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <ShieldAlert className="h-5 w-5 text-primary" />

              <Badge
                variant={
                  manualMode ? "destructive" : "outline"
                }
              >
                {manualMode ? "Enabled" : "Disabled"}
              </Badge>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Emergency Override
            </p>

            <h3 className="text-2xl font-bold">
              {manualMode ? "Active" : "Standby"}
            </h3>
          </CardContent>
        </Card>
      </div>

      {/* =======================================================
       TABS
      ======================================================= */}

      <Tabs
        defaultValue="general"
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">
            General
          </TabsTrigger>

          <TabsTrigger value="thresholds">
            Queue Intelligence
          </TabsTrigger>

          <TabsTrigger value="manual">
            Emergency Override
          </TabsTrigger>
        </TabsList>

        {/* =======================================================
         GENERAL SETTINGS
        ======================================================= */}

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Information
              </CardTitle>

              <p className="text-sm text-muted-foreground">
                Configure station identity and
                geographical location.
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Station Name</Label>

                <Input
                  defaultValue="Adama Central Station"
                  placeholder="Station Name"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>City</Label>

                  <Input
                    defaultValue="Adama"
                    placeholder="City"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Region</Label>

                  <Input
                    defaultValue="Oromia"
                    placeholder="Region"
                  />
                </div>
              </div>

              <Separator />

              <div className="rounded-xl border bg-muted/30 p-4">
                <div className="mb-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />

                  <h4 className="font-medium">
                    Location Coordinates
                  </h4>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Latitude</Label>

                    <Input defaultValue="8.541" />
                  </div>

                  <div className="space-y-2">
                    <Label>Longitude</Label>

                    <Input defaultValue="39.269" />
                  </div>
                </div>
              </div>

              <Button className="w-full md:w-auto">
                <Save className="mr-2 h-4 w-4" />
                Save General Information
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* =======================================================
         QUEUE AI
        ======================================================= */}

        <TabsContent value="thresholds">
          <div className="space-y-6">
            {/* Preview Cards */}

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="p-5">
                  <Badge>
                    Low Traffic
                  </Badge>

                  <h3 className="mt-4 text-3xl font-bold">
                    ≤ {thresholds.low}
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Vehicles in queue
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <Badge variant="secondary">
                    Medium Traffic
                  </Badge>

                  <h3 className="mt-4 text-3xl font-bold">
                    ≤ {thresholds.medium}
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Vehicles in queue
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <Badge variant="destructive">
                    High Traffic
                  </Badge>

                  <h3 className="mt-4 text-3xl font-bold">
                    {">"} {thresholds.medium}
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Vehicles in queue
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Threshold Controls */}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5" />
                  Queue Threshold Configuration
                </CardTitle>

                <p className="text-sm text-muted-foreground">
                  Configure how AI classifies queue
                  congestion levels.
                </p>
              </CardHeader>

              <CardContent className="space-y-8">
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Low Traffic Maximum
                    </span>

                    <Badge variant="outline">
                      {thresholds.low}
                    </Badge>
                  </div>

                  <Slider
                    value={[thresholds.low]}
                    max={50}
                    step={1}
                    onValueChange={(v) =>
                      setThresholds((prev) => ({
                        ...prev,
                        low: v[0],
                      }))
                    }
                  />
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Medium Traffic Maximum
                    </span>

                    <Badge variant="outline">
                      {thresholds.medium}
                    </Badge>
                  </div>

                  <Slider
                    value={[thresholds.medium]}
                    max={100}
                    step={1}
                    onValueChange={(v) =>
                      setThresholds((prev) => ({
                        ...prev,
                        medium: v[0],
                      }))
                    }
                  />
                </div>

                <div className="rounded-xl border bg-muted/30 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Gauge className="h-4 w-4" />

                    <span className="font-medium">
                      Classification Preview
                    </span>
                  </div>

                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>
                      Queue ≤ {thresholds.low} →
                      Low Traffic
                    </p>

                    <p>
                      Queue ≤ {thresholds.medium} →
                      Medium Traffic
                    </p>

                    <p>
                      Queue &gt; {thresholds.medium} →
                      High Traffic
                    </p>
                  </div>
                </div>

                <Button className="w-full md:w-auto">
                  <Save className="mr-2 h-4 w-4" />
                  Save Thresholds
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* =======================================================
         MANUAL OVERRIDE
        ======================================================= */}

        <TabsContent value="manual">
          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-orange-500" />
                Emergency Manual Override
              </CardTitle>

              <p className="text-sm text-muted-foreground">
                Use only when AI queue detection,
                cameras, or monitoring systems are
                unavailable.
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 text-orange-500" />

                  <div>
                    <h4 className="font-medium text-orange-700">
                      Emergency Mode Warning
                    </h4>

                    <p className="mt-1 text-sm text-orange-600">
                      Enabling manual mode bypasses
                      AI-generated queue calculations
                      and traffic classification.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border p-4">
                <div>
                  <p className="font-medium">
                    Enable Manual Override
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Activate emergency fallback mode
                  </p>
                </div>

                <Switch
                  checked={manualMode}
                  onCheckedChange={setManualMode}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Manual Queue Count</Label>

                <Input
                  type="number"
                  disabled={!manualMode}
                  value={manualQueue}
                  onChange={(e) =>
                    setManualQueue(
                      Number(e.target.value)
                    )
                  }
                  placeholder="Enter current queue size"
                />
              </div>

              <div className="space-y-2">
                <Label>Traffic Status</Label>

                <select
                  disabled={!manualMode}
                  value={manualTraffic}
                  onChange={(e) =>
                    setManualTraffic(
                      e.target.value as
                        | "low"
                        | "medium"
                        | "high"
                    )
                  }
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                  <option value="low">
                    Low Traffic
                  </option>

                  <option value="medium">
                    Medium Traffic
                  </option>

                  <option value="high">
                    High Traffic
                  </option>
                </select>
              </div>

              <div className="flex items-center justify-between rounded-xl border bg-muted/30 p-4">
                <span className="text-sm font-medium">
                  Current Override Status
                </span>

                <Badge
                  variant={
                    manualMode
                      ? "destructive"
                      : "outline"
                  }
                >
                  {manualMode
                    ? "Manual Mode Active"
                    : "Automatic AI Mode"}
                </Badge>
              </div>

              <Button
                className="w-full"
                disabled={!manualMode}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Manual Override
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}