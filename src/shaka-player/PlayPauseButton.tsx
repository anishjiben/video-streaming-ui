import shaka from "shaka-player/dist/shaka-player.ui";

const VerticalVolume = class extends shaka.ui.Element {
  constructor(parent: any, controls: any) {
    super(parent, controls);
    console.log();
    // const player = controls.getPlayer();
    const button = document.createElement("button");
    button.textContent = this.player?.isInProgress() ? "Play" : "Pause";
    button.addEventListener("click", () => {
      button.textContent = this.player?.isInProgress() ? "Play" : "Pause";
      console.log(this.player?.isInProgress());
      if (this.player?.isInProgress()) {
        // this.player.pause();
        this.player.getMediaElement()?.pause();
        // controls.getPlayer().videoElement.pause();
        //   this.controls?.getLocalPlayer().
      } else {
        // this.player?.play();
        this.player?.getMediaElement()?.play();
      }
    });
    // The actual button that will be displayed
    // const container_ = document.createElement("div");
    // container_.classList.add("shaka-vertical-volume-container");
    // new shaka.ui.MuteButton(container_, controls);
    // new shaka.ui.VolumeBar(container_, controls);
    parent.appendChild(button);

    // Listen for clicks on the container
    // this.eventManager?.listen(container_, "click", () => {});
  }
};

// Factory that will create a button at run time.
export class VerticalVolumeFactory {
  create(rootElement: any, controls: any) {
    return new VerticalVolume(rootElement, controls);
  }
}

export default VerticalVolumeFactory;
