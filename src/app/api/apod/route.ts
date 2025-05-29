import { NextRequest, NextResponse } from 'next/server';
import { getApodByDate } from '@/lib/apod';
    
export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date');
  if (!date) {
    return NextResponse.json({ error: 'Date is required' }, { status: 400 });
  }

  try {
    const apod = await getApodByDate(date);
    return NextResponse.json(apod);
  } catch (err) {
    return NextResponse.json({ error: 'Could not fetch APOD' }, { status: 500 });
  }
}
