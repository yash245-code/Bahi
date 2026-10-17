// ═══════════════════════════════════════════════════════════
// Bahi CRM — API Client Layer
// Typed client for connecting Next.js UI to NestJS Backend
// ═══════════════════════════════════════════════════════════

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

async function fetcher<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('bahi_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE}${endpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || errorData.error || `HTTP error! status: ${res.status}`,
      );
    }

    return await res.json();
  } catch (err: any) {
    console.warn(`[API Client] Error on ${endpoint}:`, err.message);
    throw err;
  }
}

export const crmApi = {
  // ─── Pipelines & Deals Kanban ──────────────────────────────
  pipelines: {
    getBoard: (pipelineId?: string) =>
      fetcher<{ pipeline: any; stages: any[] }>(
        `/crm/opportunities/board${pipelineId ? `?pipelineId=${pipelineId}` : ''}`,
      ),
    list: () => fetcher<any[]>('/crm/pipelines'),
    create: (data: any) =>
      fetcher<any>('/crm/pipelines', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    updateStage: (stageId: string, data: any) =>
      fetcher<any>(`/crm/pipelines/stages/${stageId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  },

  // ─── Opportunities (Deals) ─────────────────────────────────
  deals: {
    list: (params?: Record<string, any>) => {
      const q = new URLSearchParams(params).toString();
      return fetcher<any[]>(`/crm/opportunities${q ? `?${q}` : ''}`);
    },
    get: (id: string) => fetcher<any>(`/crm/opportunities/${id}`),
    create: (data: any) =>
      fetcher<any>('/crm/opportunities', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      fetcher<any>(`/crm/opportunities/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    updateStage: (id: string, stageId: string) =>
      fetcher<any>(`/crm/opportunities/${id}/stage`, {
        method: 'PATCH',
        body: JSON.stringify({ stageId }),
      }),
    markWon: (id: string, reason?: string) =>
      fetcher<any>(`/crm/opportunities/${id}/won`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      }),
    markLost: (id: string, reason: string) =>
      fetcher<any>(`/crm/opportunities/${id}/lost`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      }),
    delete: (id: string) =>
      fetcher<any>(`/crm/opportunities/${id}`, {
        method: 'DELETE',
      }),
  },

  // ─── Leads ─────────────────────────────────────────────────
  leads: {
    list: (params?: Record<string, any>) => {
      const q = new URLSearchParams(params).toString();
      return fetcher<any[]>(`/crm/leads${q ? `?${q}` : ''}`);
    },
    get: (id: string) => fetcher<any>(`/crm/leads/${id}`),
    create: (data: any) =>
      fetcher<any>('/crm/leads', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      fetcher<any>(`/crm/leads/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    convert: (id: string, data?: any) =>
      fetcher<any>(`/crm/leads/${id}/convert`, {
        method: 'POST',
        body: JSON.stringify(data || {}),
      }),
    disqualify: (id: string, reason: string) =>
      fetcher<any>(`/crm/leads/${id}/disqualify`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      }),
    recycle: (id: string) =>
      fetcher<any>(`/crm/leads/${id}/recycle`, {
        method: 'POST',
      }),
    delete: (id: string) =>
      fetcher<any>(`/crm/leads/${id}`, {
        method: 'DELETE',
      }),
    bulkAssign: (ids: string[], ownerId: string) =>
      fetcher<any>('/crm/leads/bulk/assign', {
        method: 'POST',
        body: JSON.stringify({ ids, ownerId }),
      }),
    bulkStatus: (ids: string[], status: string) =>
      fetcher<any>('/crm/leads/bulk/status', {
        method: 'POST',
        body: JSON.stringify({ ids, status }),
      }),
  },

  // ─── Corporate Accounts (Companies) ───────────────────────
  companies: {
    list: (params?: Record<string, any>) => {
      const q = new URLSearchParams(params).toString();
      return fetcher<any[]>(`/crm/companies${q ? `?${q}` : ''}`);
    },
    get: (id: string) => fetcher<any>(`/crm/companies/${id}`),
    create: (data: any) =>
      fetcher<any>('/crm/companies', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      fetcher<any>(`/crm/companies/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetcher<any>(`/crm/companies/${id}`, {
        method: 'DELETE',
      }),
  },

  // ─── Contacts Directory ────────────────────────────────────
  contacts: {
    list: (params?: Record<string, any>) => {
      const q = new URLSearchParams(params).toString();
      return fetcher<any[]>(`/crm/contacts${q ? `?${q}` : ''}`);
    },
    get: (id: string) => fetcher<any>(`/crm/contacts/${id}`),
    create: (data: any) =>
      fetcher<any>('/crm/contacts', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      fetcher<any>(`/crm/contacts/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetcher<any>(`/crm/contacts/${id}`, {
        method: 'DELETE',
      }),
  },

  // ─── Activities & Unified Queue ────────────────────────────
  activities: {
    list: (params?: Record<string, any>) => {
      const q = new URLSearchParams(params).toString();
      return fetcher<any[]>(`/crm/activities${q ? `?${q}` : ''}`);
    },
    get: (id: string) => fetcher<any>(`/crm/activities/${id}`),
    create: (data: any) =>
      fetcher<any>('/crm/activities', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    complete: (id: string, outcome?: string) =>
      fetcher<any>(`/crm/activities/${id}/complete`, {
        method: 'PATCH',
        body: JSON.stringify({ outcome }),
      }),
    delete: (id: string) =>
      fetcher<any>(`/crm/activities/${id}`, {
        method: 'DELETE',
      }),
  },

  // ─── Executive Telemetry & Forecasting ─────────────────────
  analytics: {
    getMetrics: () => fetcher<any>('/crm/analytics'),
  },

  // ─── Custom Fields ─────────────────────────────────────────
  customFields: {
    list: (entityType?: string) =>
      fetcher<any[]>(
        `/crm/custom-fields${entityType ? `?entityType=${entityType}` : ''}`,
      ),
    create: (data: any) =>
      fetcher<any>('/crm/custom-fields', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetcher<any>(`/crm/custom-fields/${id}`, {
        method: 'DELETE',
      }),
  },

  // ─── Automation Rules & Sequences ──────────────────────────
  automations: {
    list: () => fetcher<any[]>('/crm/automations'),
    create: (data: any) =>
      fetcher<any>('/crm/automations', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      fetcher<any>(`/crm/automations/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetcher<any>(`/crm/automations/${id}`, {
        method: 'DELETE',
      }),
    test: (id: string, payload: any) =>
      fetcher<any>(`/crm/automations/${id}/test`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  },
  sequences: {
    list: () => fetcher<any[]>('/crm/sequences'),
    create: (data: any) =>
      fetcher<any>('/crm/sequences', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetcher<any>(`/crm/sequences/${id}`, {
        method: 'DELETE',
      }),
  },

  // ─── Lead Scoring & Distribution ───────────────────────────
  scoring: {
    calculate: (leadId: string) =>
      fetcher<any>(`/crm/scoring/leads/${leadId}/calculate`, {
        method: 'POST',
      }),
    assign: (leadId: string, strategy?: string) =>
      fetcher<any>(`/crm/scoring/leads/${leadId}/assign${strategy ? `?strategy=${strategy}` : ''}`, {
        method: 'POST',
      }),
    reassignUntouched: (days?: number) =>
      fetcher<any>(`/crm/scoring/reassign-untouched${days ? `?days=${days}` : ''}`, {
        method: 'POST',
      }),
  },

  // ─── Data Import, Export & Deduplication ───────────────────
  impex: {
    preview: (data: { entityType: string; csvContent: string }) =>
      fetcher<any>('/crm/data/import/preview', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    execute: (data: any) =>
      fetcher<any>('/crm/data/import/execute', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    export: (entity: string, columns?: string[]) =>
      fetcher<{ csv: string; totalRows: number }>(
        `/crm/data/export/${entity}${columns ? `?columns=${columns.join(',')}` : ''}`,
      ),
    scanDuplicates: (entity: 'contact' | 'company') =>
      fetcher<any[]>(`/crm/data/duplicates/${entity}`),
    mergeDuplicates: (data: any) =>
      fetcher<any>('/crm/data/duplicates/merge', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // ─── Quotations & Customer Portal ──────────────────────────
  quotes: {
    list: () => fetcher<any[]>('/crm/quotes'),
    get: (id: string) => fetcher<any>(`/crm/quotes/${id}`),
    create: (data: any) =>
      fetcher<any>('/crm/quotes', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    generateFromDeal: (dealId: string) =>
      fetcher<any>(`/crm/deals/${dealId}/generate-quote`, {
        method: 'POST',
      }),
    getPublic: (id: string) => fetcher<any>(`/crm/portal/quotes/${id}`),
    acceptOnline: (id: string, data: { signerName: string; signatureData: string }) =>
      fetcher<any>(`/crm/portal/quotes/${id}/accept`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // ─── Omnibar Global Search ─────────────────────────────────
  search: {
    query: (q: string, limit?: number) =>
      fetcher<any[]>(`/crm/search?q=${encodeURIComponent(q)}${limit ? `&limit=${limit}` : ''}`),
  },

  // ─── Deal Approvals & Sales Goals ──────────────────────────
  approvals: {
    list: (status?: string) =>
      fetcher<any[]>(`/crm/approvals${status ? `?status=${status}` : ''}`),
    create: (data: any) =>
      fetcher<any>('/crm/approvals', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    decide: (id: string, data: { status: 'APPROVED' | 'REJECTED'; comments?: string }) =>
      fetcher<any>(`/crm/approvals/${id}/decide`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
  goals: {
    list: () => fetcher<any[]>('/crm/goals'),
    create: (data: any) =>
      fetcher<any>('/crm/goals', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    recalculate: (id: string) =>
      fetcher<any>(`/crm/goals/${id}/recalculate`, {
        method: 'POST',
      }),
  },
};
