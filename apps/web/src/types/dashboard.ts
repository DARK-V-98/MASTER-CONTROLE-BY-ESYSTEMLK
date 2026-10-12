export type Business = {
  id: string
  name: string
  kind: string
}

export type ApprovalItem = {
  id: string
  kind: 'reorder' | 'reminder' | 'leave' | 'payroll' | 'reply'
  title: string
  detail: string
  business: string
  amount?: string
  urgent?: boolean
}

export type AlertItem = {
  id: string
  severity: 'critical' | 'warning' | 'info'
  message: string
  business: string
  time: string
}

export type SalesPoint = {
  label: string
  value: number
}

export type ModuleShortcut = {
  id: string
  name: string
  description: string
  stat: string
}
