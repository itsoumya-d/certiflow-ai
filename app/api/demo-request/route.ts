import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    console.log('Received demo request:', formData);

    // Optional: Save to a file for persistence
    const logDir = path.join(process.cwd(), 'logs');
    await fs.mkdir(logDir, { recursive: true });
    const logFilePath = path.join(logDir, 'demo-requests.jsonl');
    await fs.appendFile(logFilePath, JSON.stringify(formData) + '\n');

    return NextResponse.json({ message: 'Demo request received successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error handling demo request:', error);
    return NextResponse.json({ message: 'Error processing demo request.' }, { status: 500 });
  }
}
