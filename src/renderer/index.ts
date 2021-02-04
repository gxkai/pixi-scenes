import { Container, Renderer as PixiRenderer,Application as PixiApplication, Graphics,Point } from "pixi.js";
import {injectable} from "inversify";
@injectable()
export class Application extends PixiApplication {}

@injectable()
export class Stage  {

}
