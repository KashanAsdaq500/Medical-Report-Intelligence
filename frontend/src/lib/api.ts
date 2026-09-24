import {
  PatientInput,
  AssessmentResponse,
  HistoryResponse,
  GuidelineCitation,
} from "@/types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://medical-report-intelligence-bfsk.vercel.app/api/v1";

type GetToken = () => Promise<string | null>;

async function getAuthHeaders(getToken: GetToken) {
  const token = await getToken();

  if (!token) {
    throw new Error("Authentication session not available.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function submitAssessment(
  data: PatientInput,
  getToken: GetToken
): Promise<AssessmentResponse> {
  const res = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    headers: await getAuthHeaders(getToken),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ detail: res.statusText }));

    throw new Error(
      errorData.detail || `Server returned error status ${res.status}`
    );
  }

  return res.json();
}

export async function fetchHistory(
  skip: number = 0,
  limit: number = 20,
  getToken: GetToken
): Promise<HistoryResponse> {
  const res = await fetch(
    `${API_BASE}/history?skip=${skip}&limit=${limit}`,
    {
      method: "GET",
      headers: await getAuthHeaders(getToken),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(
      `Failed to retrieve assessment history (status ${res.status})`
    );
  }

  return res.json();
}

export async function fetchGuidelines(
  biomarker?: string
): Promise<GuidelineCitation[]> {
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
    throw new Error(
      `Failed to retrieve medical guidelines (status ${res.status})`
    );
  }

  return res.json();
}

export async function checkApiHealth(): Promise<{
  online: boolean;
  environment?: string;
}> {
  try {
    const res = await fetch(`${API_BASE}/health`, {
      method: "GET",
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      return {
        online: true,
        environment: data.environment,
      };
    }

    return { online: false };
  } catch {
    return { online: false };
  }
}