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
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f9fafb',
                    padding: '40px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        backgroundColor: 'white',
                        borderRadius: '40px',
                        overflow: 'hidden',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        width: '1000px',
                        height: '500px',
                        border: '1px solid #f3f4f6',
                    }}
                >
                    {/* Badge */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '30px',
                            left: '30px',
                            backgroundColor: '#dc2626',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: 900,
                            padding: '6px 16px',
                            borderRadius: '20px',
                            zIndex: 10,
                            textTransform: 'uppercase',
                        }}
                    >
                        Highlight
                    </div>

                    {/* Left: Image Area */}
                    <div
                        style={{
                            display: 'flex',
                            width: '500px',
                            height: '500px',
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

                    {/* Right: Content Area */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '40px',
                            width: '500px',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div
                                style={{
                                    fontSize: '36px',
                                    fontWeight: 900,
                                    color: '#111827',
                                    lineHeight: '1.1',
                                    marginBottom: '15px',
                                }}
                            >
                                {product.name}
                            </div>
                            <div
                                style={{
                                    fontSize: '18px',
                                    color: '#6b7280',
                                    lineHeight: '1.4',
                                }}
                            >
                                {product.desc}
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                                <span style={{ fontSize: '56px', fontWeight: 900, color: '#16a34a' }}>
                                    {product.price}
                                </span>
                                <span style={{ fontSize: '24px', fontWeight: 900, color: '#16a34a' }}>
                                    บาท
                                </span>
                            </div>

                            <div style={{ display: 'flex', gap: '8px' }}>
                                {product.shopeeUrl && (
                                    <div style={{ background: '#EE4D2D', padding: '10px 20px', borderRadius: '30px', color: 'white', fontSize: '14px', fontWeight: 900 }}>Shopee</div>
                                )}
                                {product.lazadaUrl && (
                                    <div style={{ background: '#101566', padding: '10px 20px', borderRadius: '30px', color: 'white', fontSize: '14px', fontWeight: 900 }}>Lazada</div>
                                )}
                                {product.tiktokUrl && (
                                    <div style={{ background: 'black', padding: '10px 20px', borderRadius: '30px', color: 'white', fontSize: '14px', fontWeight: 900 }}>TikTok</div>
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
