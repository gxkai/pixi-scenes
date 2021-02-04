import { TYPES } from "./containers/types";
import { injectable, inject } from "inversify";
import {Application} from "./renderer";
import * as Cull from 'pixi-cull'
import {Ticker, Sprite, Texture, Graphics, FillStyle} from 'pixi.js'
import {Viewport} from "pixi-viewport";
@injectable()
export class App {
  constructor(
    @inject(TYPES.Application) private application: Application,
  ) {
  }
  async load() {
    this.application.view.style.width = '500px'
    this.application.view.style.height = '500px'

    document.body.appendChild(this.application.view);
    const viewport = this.application.stage.addChild(new Viewport(
        {
          interaction: this.application.renderer.plugins.interaction,
          passiveWheel: false,
          stopPropagation: true,
          disableOnContextMenu: true
        }))
    viewport
        .drag({ clampWheel: true })
        .wheel({ smooth: 3 })
        .pinch()
        .decelerate()
        .setZoom(0.5, false)
    const rectangle = Sprite.from(Texture.WHITE);
    rectangle.width = 300;
    rectangle.height = 300;
    rectangle.tint = 0xFF0000;
    viewport.addChild(rectangle);
      rectangle.position.x = (this.application.view.width - rectangle.width * viewport.scaled)
      rectangle.position.y = (this.application.view.height - rectangle.height * viewport.scaled)
      console.log(rectangle)
      const rectangle1 = Sprite.from(Texture.WHITE);
      rectangle1.width = 1;
      rectangle1.height = 1;
      rectangle1.tint = 0xFFFFFF;
      rectangle.addChild(rectangle1)
  }
}
