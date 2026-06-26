import QRCode from 'qrcode';

export async function generateQRCode(data) {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(data, {
      width: 300,
      margin: 2,
      color: {
        dark: '#10B981', // Green for FarmLink
        light: '#FFFFFF',
      },
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('QR code generation failed:', error);
    throw error;
  }
}

export function generatePassportId() {
  return `FLG-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

export function generateBlockchainHash(data) {
  // Simulated blockchain hash
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return `0x${Math.abs(hash).toString(16).padStart(64, '0')}`;
}
