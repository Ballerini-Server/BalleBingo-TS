import type { Image } from 'canvas';

declare global {
    var imagesCache: { [key: string]: Image };
}

export {};