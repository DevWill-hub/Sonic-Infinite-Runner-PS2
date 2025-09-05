export const canvas = {
    init: function() {
        const cavasInit = Screen.getMode();
        cavasInit.width = 640;
        cavasInit.height = 448;
        Screen.setMode(cavasInit);
        Screen.setVSync(true);
        Screen.setFrameCounter(true);
    },
};