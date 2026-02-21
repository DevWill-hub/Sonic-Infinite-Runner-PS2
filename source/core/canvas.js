// === CANVAS INIT - EXPORT ===

export const canvas = (() => {
    const canvasMode = Screen.getMode();

    function init() {
        canvasMode.width = 640;
        canvasMode.height = 448;
        Screen.setMode(canvasMode);
        Screen.setVSync(true);
    };

    return { init, canvasMode };
})();