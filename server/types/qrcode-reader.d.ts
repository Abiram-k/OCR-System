declare module 'qrcode-reader' {
  import { Bitmap } from 'jimp';

  interface QrCodeResult {
    result: string;
  }

  type QRCallback = (error: Error | null, value: QrCodeResult) => void;

  class QrCode {
    callback: QRCallback;
    decode(image: Bitmap): void;
  }

  export = QrCode;
}
