const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function ingestZip(file, namespace) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('namespace', namespace);

    const response = await fetch(`${BASE_URL}/ingest`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      const detail = body.detail;
      throw new Error(`Request failed (${response.status}): ${detail || response.statusText}`);
    }

    return await response.json();
  } catch (err) {
    if (err.message.startsWith('Request failed')) throw err;
    throw new Error('Network error: unable to reach the server');
  }
}

export async function ingestGithub({ repo_url, namespace, branch }) {
  try {
    const response = await fetch(`${BASE_URL}/ingest/github`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repo_url, namespace, branch }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      const detail = body.detail;
      throw new Error(`Request failed (${response.status}): ${detail || response.statusText}`);
    }

    return await response.json();
  } catch (err) {
    if (err.message.startsWith('Request failed')) throw err;
    throw new Error('Network error: unable to reach the server');
  }
}

export async function queryCodebase({ query, namespace }) {
  try {
    const response = await fetch(`${BASE_URL}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, namespace }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      const detail = body.detail;
      throw new Error(`Request failed (${response.status}): ${detail || response.statusText}`);
    }

    return await response.json();
  } catch (err) {
    if (err.message.startsWith('Request failed')) throw err;
    throw new Error('Network error: unable to reach the server');
  }
}
