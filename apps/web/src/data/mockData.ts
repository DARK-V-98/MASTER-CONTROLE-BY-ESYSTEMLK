import type {
  AlertItem,
  ApprovalItem,
  Business,
  ModuleShortcut,
  SalesPoint,
} from '../types/dashboard'

export const businesses: Business[] = [
  { id: 'all', name: 'All Businesses', kind: 'Holding view' },
  { id: 'retail', name: 'Lanka Mart (Retail)', kind: '6 branches' },
  { id: 'trading', name: 'Vishwa Trading Co.', kind: 'Import / export' },
  { id: 'factory', name: 'Nova Foods Factory', kind: 'Manufacturing' },
]

export const approvals: ApprovalItem[] = [
  {
    id: 'a1',
    kind: 'reorder',
    title: 'Reorder: 500 units of Basmati Rice 5kg',
    detail: 'Gemini drafted this after stock fell below reorder point at Branch 3.',
    business: 'Lanka Mart',
    amount: 'LKR 185,000',
    urgent: true,
  },
  {
    id: 'a2',
    kind: 'reminder',
    title: 'Send payment reminder to Colombo Hardware',
    detail: 'Invoice #INV-2291 is 14 days overdue — second reminder drafted.',
    business: 'Vishwa Trading',
    amount: 'LKR 420,500',
  },
  {
    id: 'a3',
    kind: 'leave',
    title: 'Approve leave request — K. Perera',
    detail: '3 days annual leave, 18–20 Oct, no roster conflict detected.',
    business: 'Nova Foods',
  },
  {
    id: 'a4',
    kind: 'payroll',
    title: 'Monthly payroll run ready for review',
    detail: '42 employees, statutory deductions calculated, ready to submit.',
    business: 'Nova Foods',
    amount: 'LKR 3,120,000',
    urgent: true,
  },
  {
    id: 'a5',
    kind: 'reply',
    title: 'Reply to customer complaint — order #88213',
    detail: 'Gemini drafted a response after detecting negative sentiment.',
    business: 'Lanka Mart',
  },
]

export const alerts: AlertItem[] = [
  {
    id: 'al1',
    severity: 'critical',
    message: 'Branch 3 cash drawer variance of LKR 12,400 at close',
    business: 'Lanka Mart',
    time: '18 min ago',
  },
  {
    id: 'al2',
    severity: 'warning',
    message: '7 SKUs below reorder point across 3 branches',
    business: 'Lanka Mart',
    time: '1 hr ago',
  },
  {
    id: 'al3',
    severity: 'warning',
    message: 'Raw material wastage 9% above weekly average',
    business: 'Nova Foods',
    time: '2 hr ago',
  },
  {
    id: 'al4',
    severity: 'info',
    message: '3 employees not clocked in by opening time',
    business: 'Lanka Mart',
    time: '3 hr ago',
  },
]

export const salesTrend: SalesPoint[] = [
  { label: 'Mon', value: 420000 },
  { label: 'Tue', value: 388000 },
  { label: 'Wed', value: 455000 },
  { label: 'Thu', value: 410000 },
  { label: 'Fri', value: 512000 },
  { label: 'Sat', value: 601000 },
  { label: 'Sun', value: 467000 },
]

export const moduleShortcuts: ModuleShortcut[] = [
  { id: 'inventory', name: 'Inventory', description: 'Stock, warehouses, transfers', stat: '1,284 SKUs' },
  { id: 'crm', name: 'CRM', description: 'Leads, pipeline, support', stat: '38 open leads' },
  { id: 'hr', name: 'HR & Payroll', description: 'Attendance, payroll, leave', stat: '126 employees' },
  { id: 'accounting', name: 'Accounting', description: 'Ledger, invoices, tax', stat: 'LKR 2.1M receivable' },
  { id: 'automation', name: 'Automation', description: 'Workflows & rules', stat: '14 active rules' },
]

export const aiBriefing =
  'Sales are up 9% vs last week across all businesses, led by Lanka Mart’s weekend promotion. Cash position is healthy, but Branch 3’s drawer variance and Nova Foods’ payroll run both need a decision from you today.'
