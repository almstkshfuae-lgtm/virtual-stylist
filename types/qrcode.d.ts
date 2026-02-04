declare module 'qrcode' {
  export interface QRCodeToDataURLOptions {
    margin?: number;
    width?: number;
    [key: string]: unknown;
  }

  export function toDataURL(text: string, options?: QRCodeToDataURLOptions): Promise<string>;
  export function toDataURL(
    text: string,
    callback: (error: Error | null, url: string) => void
  ): void;
  export function toDataURL(
    text: string,
    options: QRCodeToDataURLOptions,
    callback: (error: Error | null, url: string) => void
  ): void;
}

