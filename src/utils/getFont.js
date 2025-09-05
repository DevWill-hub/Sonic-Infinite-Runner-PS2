// credits: 

export let font = new Font("assets/fonts/mania.ttf");

export function getText(text, x, y, options) {
    const originalScale = font.scale;

    if (options.scale !== undefined) font.scale = options.scale;

    const size = font.getTextSize(text);
    font.print(x, y, text);

    font.scale = originalScale;

    return size;
}