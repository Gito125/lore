import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title') || 'Lore';
    const summary = searchParams.get('summary') || 'Wikipedia as a Social Experience';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0A0A0F',
            color: '#F0F0F5',
            padding: '80px',
            fontFamily: 'serif',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', letterSpacing: '0.2em', opacity: 0.5, marginBottom: '64px' }}>
              READ ON LORE
            </div>
            <h1 style={{ fontSize: '80px', fontWeight: 'bold', marginBottom: '40px', color: '#8B85FF' }}>
              {title}
            </h1>
            <p style={{ fontSize: '40px', color: '#A0A0B0', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 6, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {summary}
            </p>
          </div>
        </div>
      ),
      {
        width: 1080,
        height: 1920,
      }
    );
  } catch (e) {
    console.error(e instanceof Error ? e.message : e);
    return new Response('Failed to generate story image', { status: 500 });
  }
}
