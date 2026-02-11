import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export default async function Image(props: { searchParams: { data?: string } }) {
    const data = props.searchParams.data;

    if (!data) {
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
                        backgroundColor: '#f9fafb',
                    }}
                >
                    <div style={{ fontSize: 40, fontWeight: 'bold', color: '#1f2937' }}>ไม่พบข้อมูลสินค้า</div>
                </div>
            ),
            { width: 1200, height: 630 }
        );
    }

    let product: any = null;
    try {
        product = JSON.parse(Buffer.from(data, 'base64').toString('utf8'));
    } catch (e) {
        console.error('OG Image decoding failed', e);
    }

    if (!product) {
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
                        backgroundColor: '#f9fafb',
                    }}
                >
                    <div style={{ fontSize: 40, fontWeight: 'bold', color: '#1f2937' }}>ข้อมูลสินค้าไม่ถูกต้อง</div>
                </div>
            ),
            { width: 1200, height: 630 }
        );
    }

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
                    backgroundColor: '#f9fafb',
                    padding: '20px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: 'white',
                        borderRadius: '48px',
                        overflow: 'hidden',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        width: '420px',
                        height: '590px',
                        border: '1px solid #f3f4f6',
                        position: 'relative',
                    }}
                >
                    {/* Image Area */}
                    <div
                        style={{
                            display: 'flex',
                            width: '420px',
                            height: '320px',
                            backgroundColor: '#f9fafb',
                        }}
                    >
                        <img
                            src={product.image}
                            alt={product.name}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    </div>

                    {/* Content Area */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '24px 28px',
                            flex: 1,
                        }}
                    >
                        <div
                            style={{
                                fontSize: '28px',
                                fontWeight: 900,
                                color: '#111827',
                                lineHeight: '1.2',
                                marginBottom: '8px',
                                display: 'flex',
                            }}
                        >
                            {product.name}
                        </div>
                        <div
                            style={{
                                fontSize: '14px',
                                color: '#6b7280',
                                lineHeight: '1.4',
                                marginBottom: '15px',
                                display: 'flex',
                            }}
                        >
                            {product.desc}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '15px' }}>
                                <span style={{ fontSize: '42px', fontWeight: 900, color: '#4ade80' }}>
                                    {product.price}
                                </span>
                                <span style={{ fontSize: '20px', fontWeight: 900, color: '#4ade80' }}>
                                    บาท
                                </span>
                            </div>

                            <div style={{ display: 'flex', gap: '8px' }}>
                                {product.shopeeUrl && (
                                    <div style={{ background: '#EE4D2D', padding: '6px 16px', borderRadius: '30px', color: 'white', fontSize: '11px', fontWeight: 900, fontStyle: 'italic' }}>Shopee</div>
                                )}
                                {product.lazadaUrl && (
                                    <div style={{ background: '#101566', padding: '6px 16px', borderRadius: '30px', color: 'white', fontSize: '11px', fontWeight: 900, fontStyle: 'italic' }}>Lazada</div>
                                )}
                                {product.tiktokUrl && (
                                    <div style={{ background: 'black', padding: '6px 16px', borderRadius: '30px', color: 'white', fontSize: '11px', fontWeight: 900, fontStyle: 'italic' }}>TikTok</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ),
        { width: 1200, height: 630 }
    );
}
