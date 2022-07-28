import { Image, loadImage } from "canvas";

export async function getCanvasImage(image: string): Promise<Image> {
    if(!global.imagesCache) {
        global.imagesCache = {};
    }

    if(global.imagesCache[image]) {
        return global.imagesCache[image];
    }

    const img = await loadImage(image);
    
    global.imagesCache[image] = img;

    return img;
}