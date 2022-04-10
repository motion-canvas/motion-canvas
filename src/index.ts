import type { Player } from "@motion-canvas/core/player/Player";
import { render } from "preact";
import { App } from "./App";

export function setup(player: Player, container: HTMLElement) {
  render(App(), container);
  player.project.container(
    <HTMLDivElement>document.getElementById("container2")
  );
}
