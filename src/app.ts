import { TYPES } from "./containers/types";
import { injectable, inject } from "inversify";
import {Application} from "./renderer";
import * as Cull from 'pixi-cull'
import {Ticker, Sprite, Texture, Graphics, FillStyle, TilingSprite} from 'pixi.js'
import {Viewport} from "pixi-viewport";
import PixiFps from "pixi-fps";
@injectable()
export class App {
  constructor(
    @inject(TYPES.Application) private application: Application,
  ) {
  }
  async load() {
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
        .decelerate({minSpeed: 0, friction: 0, bounce: 0})
        .setZoom(0.08, false)
    // fps
    this.application.stage.addChild(new PixiFps())
    //
    const rectangle = Sprite.from(Texture.WHITE);
    rectangle.width = 300;
    rectangle.height = 300;
    rectangle.tint = 0xFF0000;
    viewport.addChild(rectangle);
      rectangle.position.x = (this.application.view.width - rectangle.width * viewport.scaled)/2
      rectangle.position.y = (this.application.view.height - rectangle.height * viewport.scaled)/2
    //
      rectangle.addChild(new TilingSprite(
          this.application.renderer.generateTexture(new Graphics().lineStyle(1, 0xffffff).
          drawRect(0, 0, 49, 49).endFill(), 1, 1),
          rectangle.width,
          rectangle.height
      ))
    //
    const cull = new Cull.Simple();
    cull.addList(viewport.children);
    cull.cull(viewport.getVisibleBounds());
    Ticker.shared.add(() =>
    {
      if (viewport.dirty)
      {
        cull.cull(viewport.getVisibleBounds());
        viewport.dirty = false;
      }
    });
  }
}
