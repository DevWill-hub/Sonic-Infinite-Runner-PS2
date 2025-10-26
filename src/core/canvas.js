export const canvas = {
    init: function() {
        const canvasInit = Screen.getMode();
        canvasInit.width = 640;
        cavasInit.height = 448;
        Screen.setMode(canvasInit);
        Screen.setVSync(true);
//        Screen.setFrameCounter(true);
    },

};
