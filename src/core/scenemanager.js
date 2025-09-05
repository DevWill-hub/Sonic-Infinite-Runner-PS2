export const SceneManager = {
    currentScene: null,
    scenes: {},

    register(name, sceneObject) {
        this.scenes[name] = sceneObject;
    },

    change(sceneName, params = {}) {
        const newScene = this.scenes[sceneName];
  
        if (this.currentScene && this.currentScene.exit) {
            this.currentScene.exit();
        }

        this.currentScene = newScene;

        if (this.currentScene.init) {
            this.currentScene.init(params);
        }
    },

    update() {
        if (this.currentScene && this.currentScene.update) {
            this.currentScene.update();
        }
    },

    render() {
        if (this.currentScene && this.currentScene.render) {
            this.currentScene.render();
        }
    }
};