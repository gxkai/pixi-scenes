import {injectable} from "inversify";
import {Application} from "./renderer";
import * as Cull from 'pixi-cull'
import {Ticker, TilingSprite, SCALE_MODES, Graphics, Rectangle} from 'pixi.js'
import {Viewport} from "pixi-viewport";
import PixiFps from "pixi-fps";

@injectable()
export class App {
  application: Application
  constructor() {
    this.application = new Application({
      transparent: false,
      width: 500,
      height: 500,
      resolution: window.devicePixelRatio,
      // 是否开启自动渲染
      autoStart: true,
      powerPreference: 'high-performance',
      forceCanvas: false,
      antialias: false,
      preserveDrawingBuffer: true,
      autoDensity: false,
      backgroundColor: 0x00ffff,
      clearBeforeRender: true,
    })
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
        .setZoom(1, false)
    // fps
    this.application.stage.addChild(new PixiFps())
    // grid
    const grid = new Graphics();
    grid.lineStyle(1, 0xffffff, 1);
    grid.drawRect(0, 0, 49, 49)
    // area
    const area = new Graphics();
    area.beginFill(0xFFFF00);
    area.lineStyle(2, 0xFF0000, 0);
    area.drawRect(0, 0, 300, 300);
    const tilingSprite = new TilingSprite(this.application
        .renderer.generateTexture(grid, SCALE_MODES.LINEAR, 2), area.width, area.height);
    area.addChild(tilingSprite)


    // center
    const center = new Graphics()
    center.lineStyle(1, 0xff0000)
    center.drawRect(0, 0, 10, 10)
    center.endFill();
    center.position.x = (area.width - center.width) / 2
    center.position.y = (area.height - center.height) / 2
    area.addChild(
        center
    )
    viewport.addChild(area);
    area.position.x = (this.application.view.width - area.width * viewport.scaled)/2
    area.position.y = (this.application.view.height - area.height * viewport.scaled)/2
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
