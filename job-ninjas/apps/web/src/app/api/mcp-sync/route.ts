import { NextResponse } from 'next/server';

// In-memory store for development (this resets on server reload, but that's fine for a demo)
let commands: any[] = [];

export async function GET() {
  const pendingCommands = [...commands];
  // Clear the queue once read
  commands = [];
  return NextResponse.json({ commands: pendingCommands });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    commands.push({
      id: Date.now().toString(),
      ...body
    });
    return NextResponse.json({ success: true, count: commands.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
