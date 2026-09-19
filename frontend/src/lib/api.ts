import {
  PatientInput,
  AssessmentResponse,
  HistoryResponse,
  GuidelineCitation,
} from "@/types";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8002/api/v1";

export async function submitAssessment(data: PatientInput): Promise<AssessmentResponse> {
  const res = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(errorData.detail || `Server returned error status ${res.status}`);
  }

  return res.json();
}

export async function fetchHistory(skip: number = 0, limit: number = 20): Promise<HistoryResponse> {
  const res = await fetch(`${API_BASE}/history?skip=${skip}&limit=${limit}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to retrieve assessment history (status ${res.status})`);
  }

  return res.json();
}

export async function fetchGuidelines(biomarker?: string): Promise<GuidelineCitation[]> {
  const url = biomarker
    ? `${API_BASE}/rag/guidelines?biomarker=${encodeURIComponent(biomarker)}`
    : `${API_BASE}/rag/guidelines`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to retrieve medical guidelines (status ${res.status})`);
  }

  return res.json();
}

export async function checkApiHealth(): Promise<{ online: boolean; environment?: string }> {
  try {
const res = await fetch(`${API_BASE}/health`, {
      method: "GET",
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      return { online: true, environment: data.environment };
    }
    return { online: false };
  } catch {
    return { online: false };
  }
}
