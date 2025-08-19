/* eslint-disable no-console */
import { promises as fs } from 'fs';
import path from 'path';

const API_URL = 'https://h4x9jncmwd.execute-api.sa-east-1.amazonaws.com/meals';
const TOKEN = 'eyJraWQiOiJWWEp1WEpKU3dNVUpMRXF4SUF0VEtLQW0wckJ2bTR1UUVUanBxR1ZMUlwvcz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhM2FjZmE0YS0yMDUxLTcwOWMtNWYzZC1lODVmOWE5Mjg5OGUiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuc2EtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3NhLWVhc3QtMV9SWlVid1ZZekkiLCJjbGllbnRfaWQiOiI1N2szZmduZ2trMDhmNDZrMWptMW4zdjRnNiIsIm9yaWdpbl9qdGkiOiI3YTMwMDBmZS0xZmViLTRhZDAtYTI2OC1kZTc0YTA3ZjRmMzAiLCJpbnRlcm5hbElkIjoiMnpZSDdHUkdFbWZDbk5LM21VZ0RSbkQ0eHkzIiwiZXZlbnRfaWQiOiI3NGVjYzYzNS00M2I3LTQ2ZWItOTVmOC02YmVkZWNlZDk1NWQiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNzU1NjEzMzY5LCJleHAiOjE3NTU2NTY1NjksImlhdCI6MTc1NTYxMzM2OSwianRpIjoiNjcwMTA0ZjQtZDk5Ni00MGU3LWIxZDUtZWViN2NkZmM0MGFkIiwidXNlcm5hbWUiOiJhM2FjZmE0YS0yMDUxLTcwOWMtNWYzZC1lODVmOWE5Mjg5OGUifQ.p2AmhAfmjQrypdA7zIFvHylRUuC-NDrjXg6RJh0s6-rvM6Gn1PJeHs6gKbwfL9S0ORdPfMwvBafRakUgxD6OsDVufTeui3SSKp_NlaRpnRqCysV0tYquVpAqlPrJT_t2UxaiORbBi7FOAtvOOYJE4laPifc2BaVIxZj4WTEKVEq4q_Pn3qyERCOZIhs7qs66QU5NFXN4xcSKS5ZjXmDAvItXktyiP9_rIIeNQmP4cvTBCsv_ET1IV9WHHcAtZLIW3PHre8INz-GRzjF17EScnu3iGxwMv1guAsCT7IM_gu6A-1C1usNbPBR2Mimomlh3By-fxjA5JY9oenPJx7fNBw';

interface IPresignResponse {
  uploadSignature: string;
}

interface IPresignDecoded {
  url: string;
  fields: Record<string, string>;
}

async function readImageFile(filePath: string): Promise<{
  data: Buffer;
  size: number;
  type: string;
}> {
  console.log(`🔍 Reading file from disk: ${filePath}`);
  const data = await fs.readFile(filePath);
  return {
    data,
    size: data.length,
    type: 'image/jpeg',
  };
}

async function createMeal(
  fileType: string,
  fileSize: number,
): Promise<IPresignDecoded> {
  console.log(`🚀 Requesting presigned POST for ${fileSize} bytes of type ${fileType}`);
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ file: { type: fileType, size: fileSize } }),
  });

  if (!res.ok) {
    throw new Error(`Failed to get presigned POST: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as IPresignResponse;
  const decoded = JSON.parse(
    Buffer.from(json.uploadSignature, 'base64').toString('utf-8'),
  ) as IPresignDecoded;

  console.log('✅ Received presigned POST data');
  return decoded;
}

function buildFormData(
  fields: Record<string, string>,
  fileData: Buffer,
  filename: string,
  fileType: string,
): FormData {
  console.log(`📦 Building FormData with ${Object.keys(fields).length} fields and file ${filename}`);
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    form.append(key, value);
  }
  const blob = new Blob([fileData], { type: fileType });
  form.append('file', blob, filename);
  return form;
}

async function uploadToS3(url: string, form: FormData): Promise<void> {
  console.log(`📤 Uploading to S3 at ${url}`);
  const res = await fetch(url, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`S3 upload failed: ${res.status} ${res.statusText} — ${text}`);
  }

  console.log('🎉 Upload completed successfully');
}

async function uploadMealImage(filePath: string): Promise<void> {
  try {
    const { data, size, type } = await readImageFile(filePath);
    const { url, fields } = await createMeal(type, size);
    const form = buildFormData(fields, data, path.basename(filePath), type);
    await uploadToS3(url, form);
  } catch (err) {
    console.error('❌ Error during uploadMealImage:', err);
    throw err;
  }
}

uploadMealImage(
  path.resolve(__dirname, 'assets', 'usina.png'),
).catch(() => process.exit(1));
