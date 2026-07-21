"use client"

import { useState, useEffect } from "react"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import type { SystemSettings } from "@/services/settings.service"
import {
  useSystemSettings,
  useUpdateSystemSettings,
} from "@/hooks/settings/useSettings"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

/* -----------------------------
   DEFAULT FALLBACK
------------------------------*/
const DEFAULT_SETTINGS: SystemSettings = {
  maxTrafficLow: 20,
  maxTrafficMedium: 50,
  maxTrafficHigh: 80,
  maxTrafficCritical: 100,

  aiEnabled: true,
  aiMinConfidence: 0.6,
  aiRefreshSeconds: 5,

  autoRiskDetection: true,
  maxQueueCapacityGlobal: 100,
  maxRequestDistanceKm: 10,

  maxActiveCamerasPerStation: 3,

  systemActive: true,
}

export default function SettingsPage() {
  const { data, isLoading } = useSystemSettings()
  const { mutate: saveSettings, isPending } = useUpdateSystemSettings()

  const [settings, setSettings] =
    useState<SystemSettings>(DEFAULT_SETTINGS)

  /* -----------------------------
     SYNC FROM API
  ------------------------------*/
  useEffect(() => {
    if (data) setSettings(data)
  }, [data])

  const update = <K extends keyof SystemSettings>(
    key: K,
    value: SystemSettings[K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Loading system settings...
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">
          System Control Center
        </h1>
        <p className="text-sm text-muted-foreground">
          Global AI, traffic, and infrastructure control rules
        </p>
      </div>

      <Tabs defaultValue="traffic">

        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="ai">AI Engine</TabsTrigger>
          <TabsTrigger value="pricing">Pricing Rule</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* ================= TRAFFIC ================= */}
        <TabsContent value="traffic">
          <Card className="p-6 space-y-6">

            <h2 className="font-medium text-lg">
              Traffic Threshold Limits
            </h2>

            <div className="grid grid-cols-2 gap-4">

              <div>
                <Label>Max Low Traffic</Label>
                <Input
                  type="number"
                  value={settings.maxTrafficLow}
                  onChange={(e) =>
                    update("maxTrafficLow", Number(e.target.value))
                  }
                />
              </div>

              <div>
                <Label>Max Medium Traffic</Label>
                <Input
                  type="number"
                  value={settings.maxTrafficMedium}
                  onChange={(e) =>
                    update("maxTrafficMedium", Number(e.target.value))
                  }
                />
              </div>

              <div>
                <Label>Max High Traffic</Label>
                <Input
                  type="number"
                  value={settings.maxTrafficHigh}
                  onChange={(e) =>
                    update("maxTrafficHigh", Number(e.target.value))
                  }
                />
              </div>

              <div>
                <Label>Max Critical Traffic</Label>
                <Input
                  type="number"
                  value={settings.maxTrafficCritical}
                  onChange={(e) =>
                    update("maxTrafficCritical", Number(e.target.value))
                  }
                />
              </div>

            </div>

          </Card>
        </TabsContent>

        {/* ================= AI ================= */}
        <TabsContent value="ai">
          <Card className="p-6 space-y-5">

            <h2 className="font-medium text-lg">
              AI Engine Control
            </h2>

            <div className="flex justify-between items-center">
              <Label>Enable AI System</Label>
              <Switch
                checked={settings.aiEnabled}
                onCheckedChange={(v) =>
                  update("aiEnabled", v)
                }
              />
            </div>

            <Separator />

            <div>
              <Label>Minimum Confidence Score</Label>
              <Input
                type="number"
                step="0.01"
                value={settings.aiMinConfidence}
                onChange={(e) =>
                  update("aiMinConfidence", Number(e.target.value))
                }
              />
            </div>

            <div>
              <Label>AI Refresh Interval (seconds)</Label>
              <Input
                type="number"
                value={settings.aiRefreshSeconds}
                onChange={(e) =>
                  update("aiRefreshSeconds", Number(e.target.value))
                }
              />
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <Label>Auto Risk Detection</Label>
              <Switch
                checked={settings.autoRiskDetection}
                onCheckedChange={(v) =>
                  update("autoRiskDetection", v)
                }
              />
            </div>

          </Card>
        </TabsContent>

         {/* ================= SYSTEM ================= */}
         <TabsContent value="pricing">
          <Card className="p-6 space-y-5">

            <h2 className="font-medium text-lg">
              Fuel Pricing Rule
            </h2>

            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sellect Price Controlling Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="FIXED">FIXED</SelectItem>
                  <SelectItem value="OVERRIDE">OVERRIDE</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>


          </Card>
        </TabsContent>

        {/* ================= SYSTEM ================= */}
        <TabsContent value="system">
          <Card className="p-6 space-y-5">

            <h2 className="font-medium text-lg">
              System & Infrastructure
            </h2>

            <div>
              <Label>Max Queue Capacity</Label>
              <Input
                type="number"
                value={settings.maxQueueCapacityGlobal}
                onChange={(e) =>
                  update("maxQueueCapacityGlobal", Number(e.target.value))
                }
              />
            </div>

            <div>
              <Label>Max Request Distance (KM)</Label>
              <Input
                type="number"
                value={settings.maxRequestDistanceKm}
                onChange={(e) =>
                  update("maxRequestDistanceKm", Number(e.target.value))
                }
              />
            </div>

            <div>
              <Label>Max Active Cameras Per Station</Label>
              <Input
                type="number"
                value={settings.maxActiveCamerasPerStation}
                onChange={(e) =>
                  update(
                    "maxActiveCamerasPerStation",
                    Number(e.target.value)
                  )
                }
              />
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <Label>System Active</Label>
              <Switch
                checked={settings.systemActive}
                onCheckedChange={(v) =>
                  update("systemActive", v)
                }
              />
            </div>

          </Card>
        </TabsContent>

      </Tabs>

      {/* SAVE */}
      <Button
        className="w-full h-11 text-sm font-medium"
        disabled={isPending}
        onClick={() => saveSettings(settings)}
      >
        Save System Configuration
      </Button>

    </div>
  )
}