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
            <h1 style={{ fontSize: '64px', fontWeight: 'bold', marginBottom: '24px', color: '#8B85FF' }}>
              {title}
            </h1>
            <p style={{ fontSize: '32px', color: '#A0A0B0', maxWidth: '800px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {summary}
            </p>
          </div>
          <div style={{ position: 'absolute', bottom: '40px', fontSize: '24px', letterSpacing: '0.2em', opacity: 0.5 }}>
            LORE ARCHIVE
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error(e instanceof Error ? e.message : e);
    return new Response('Failed to generate image', { status: 500 });
  }
}
