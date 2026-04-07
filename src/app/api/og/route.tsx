import { ImageResponse } from 'next/og';

// Removed edge runtime constraint

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const name = searchParams.get('name') || 'NN';
    const date = searchParams.get('date') || new Date().toLocaleDateString('es-AR');
    const phrase = searchParams.get('phrase') || 'Mufa Indeterminada';
    const stage = searchParams.get('stage') || 'Fase No Especificada';
    const severity = searchParams.get('severity') || 'Severidad Máxima';
    const challenge = searchParams.get('challenge') || 'Reto Obligatorio No Definido';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#E6E2D3', 
            padding: '40px',
            position: 'relative',
            fontFamily: 'monospace',
            color: '#2a2a2a', 
            border: '12px solid #D1CDC0',
          }}
        >
          {/* Sello de Infracción */}
          <div
            style={{
              position: 'absolute',
              top: '120px',
              right: '60px',
              color: 'rgba(180, 20, 20, 0.25)',
              fontSize: '110px',
              fontWeight: 900,
              fontFamily: 'sans-serif',
              transform: 'rotate(-15deg)',
              border: '12px solid rgba(180, 20, 20, 0.25)',
              padding: '10px 40px',
              borderRadius: '16px',
              letterSpacing: '12px',
              textTransform: 'uppercase',
            }}
          >
            INFRACCION
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #333', paddingBottom: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '34px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Policía Federal de la Scaloneta</span>
                <span style={{ fontSize: '18px', marginTop: '6px', opacity: 0.8 }}>Departamento de Prevención de Mufa y Mística</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: '18px' }}>
                <span>ACTA DE COMPROBACION N.º {Math.floor(Math.random() * 90000) + 10000}</span>
                <span style={{ marginTop: '6px', fontWeight: 'bold' }}>FECHA: {date}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '24px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <span style={{ fontWeight: 'bold', width: '300px' }}>IMPUTADO/A:</span>
                <span style={{ borderBottom: '2px dashed #555', paddingBottom: '4px', flex: 1, color: '#111' }}>{name.toUpperCase()}</span>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <span style={{ fontWeight: 'bold', width: '300px' }}>ALEGATO DENUNCIADO:</span>
                <span style={{ borderBottom: '2px dashed #555', paddingBottom: '4px', flex: 1, color: '#111', flexWrap: 'wrap' }}>&quot;{phrase.toUpperCase()}&quot;</span>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <span style={{ fontWeight: 'bold', width: '300px' }}>INSTANCIA DEL TORNEO:</span>
                <span style={{ borderBottom: '2px dashed #555', paddingBottom: '4px', flex: 1, color: '#111' }}>{stage.toUpperCase()}</span>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <span style={{ fontWeight: 'bold', width: '300px' }}>NIVEL DE TOXICIDAD:</span>
                <span style={{ borderBottom: '2px dashed #555', paddingBottom: '4px', flex: 1, color: '#111', fontWeight: 'bold' }}>{severity.toUpperCase()}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                <span style={{ fontWeight: 'bold', marginBottom: '8px' }}>ARTÍCULO / RETO OBLIGATORIO PARA ANULAR:</span>
                <div style={{ display: 'flex', backgroundColor: 'rgba(0,0,0,0.05)', padding: '12px 16px', border: '2px dashed #666', borderRadius: '8px' }}>
                  <span style={{ fontSize: '24px', lineHeight: 1.4, color: '#111' }}>{challenge.toUpperCase()}</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ width: '220px', borderBottom: '2px solid #555', marginBottom: '8px' }}></div>
                <span style={{ fontSize: '16px' }}>Firma del Inspector de Turno</span>
                <span style={{ fontSize: '13px', opacity: 0.6, fontWeight: 'bold', marginTop: '16px' }}>
                  IMPRESO EN PAPEL OFICIAL - PROHIBIDA SU REPRODUCCIÓN
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginBottom: '4px' }}>
                   <span style={{ fontSize: '16px', fontWeight: 'bold', letterSpacing: '1px' }}>¿ALGUIEN MUFÓ?</span>
                   <span style={{ fontSize: '12px', opacity: 0.8, marginTop: '2px' }}>ESCANEÁ PARA DENUNCIAR</span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://detectormufa.vercel.app" 
                  alt="QR Code" 
                  width="80" 
                  height="80" 
                  style={{ border: '3px solid #333', borderRadius: '4px', backgroundColor: 'white' }}
                />
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
