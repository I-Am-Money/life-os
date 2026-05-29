import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const { score, label } = await req.json();

    // Define the path to the local file in the project root
    const filePath = path.join(process.cwd(), 'health-status.json');

    // Write to the file synchronously (since this is for local dev/dashboard updates)
    fs.writeFileSync(filePath, JSON.stringify(score));

    return NextResponse.json({ success: true, score });
  } catch (error) {
    console.error('Failed to write health score to file:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
