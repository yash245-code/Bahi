// ═══════════════════════════════════════════════════════════
// @bahi/app-crm — Client API Layer
// Self-contained, typed client connecting web views to NestJS API
// ═══════════════════════════════════════════════════════════

const API_BASE =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) ||
  'http://localhost:4000/api/v1';

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
}

export const crmApi = {
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
  },
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
  activities: {
    list: (params?: Record<string, any>) => {
      const q = new URLSearchParams(params).toString();
      return fetcher<any[]>(`/crm/activities${q ? `?${q}` : ''}`);
    },
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
  analytics: {
    getMetrics: () => fetcher<any>('/crm/analytics'),
  },
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
  search: {
    query: (q: string, limit?: number) =>
      fetcher<any[]>(`/crm/search?q=${encodeURIComponent(q)}${limit ? `&limit=${limit}` : ''}`),
  },
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
