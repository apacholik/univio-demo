import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const token = req.nextUrl.searchParams.get('token');

  if (token !== process.env.CACHE_INVALIDATION_SECRET_TOKEN) {
    return NextResponse.json({ status: 401, body: { error: 'Invalid Token' } });
  }

  try {
    revalidateTag('datocms');

    await new Promise((ok) => {
      setTimeout(() => {
        ok(undefined)
      }, 500)
    })

    await fetch('https://webhooks.datocms.com/4VJw0I4dU8/deploy-results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "status": "success" })
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      body: { message: 'Failed to clear the cache', error },
    });
  }

  return NextResponse.json({ status: 200, body: { status: 'Cache Cleared' } });
}
