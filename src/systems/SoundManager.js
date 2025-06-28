let sounds = {};
let currentMusic = null;
let nextSfxSlot = 1;

export const SoundManager = {
  load(path) {
    if (!sounds[path]) {
      sounds[path] = Sound.load(path);
    }
    return sounds[path];
  },

  playEffect(path, volume = 100) {
    const sfx = this.load(path);

    const slot = nextSfxSlot;
    nextSfxSlot = nextSfxSlot >= 7 ? 1 : nextSfxSlot + 1;

    Sound.setVolume(volume, slot);
    Sound.play(sfx, slot);
  },

  playMusic(path, volume = 100, loop = true, slot = 0) {
    if (currentMusic && currentMusic !== sounds[path]) {
      Sound.pause(currentMusic);
    }

    currentMusic = this.load(path);

    Sound.setVolume(volume, slot);
    Sound.repeat(loop);
    Sound.play(currentMusic, slot);
  },

  stopMusic() {
    if (currentMusic) {
      Sound.pause(currentMusic);
      currentMusic = null;
    }
  },

  setMusicVolume(volume, slot = 0) {
    Sound.setVolume(volume, slot);
  },

  stopAll() {
    if (currentMusic) Sound.pause(currentMusic);
    for (let path in sounds) {
      Sound.pause(sounds[path]);
    }
    currentMusic = null;
  },

  free() {
    for (let path in sounds) {
      Sound.free(sounds[path]);
    }
    sounds = {};
    currentMusic = null;
    std.gc();
  }
};