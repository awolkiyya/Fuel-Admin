import { Badge } from "@/components/ui/badge"


interface Props {
  status:string
}


export function EquipmentBadge({
  status
}:Props){

  const active =
    status === "ACTIVE"


  return (
    <Badge
      variant={
        active
        ? "default"
        : "secondary"
      }
    >
      {status}
    </Badge>
  )
}