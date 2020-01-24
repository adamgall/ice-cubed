import QRCode from 'qrcode';

export const generateQR = string => {
  return QRCode.toString(string, { type: 'terminal' });
};
