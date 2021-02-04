import { Container } from "inversify";
import { TYPES } from "./types";




import {Application, Stage} from "../renderer";
import { App } from "../app";

const container = new Container();
container.bind(TYPES.Application).toConstantValue(new Application({ transparent: false, width: 200, height: 200, resolution: window.devicePixelRatio }));

container.bind(TYPES.Stage).toConstantValue(new Stage(
));
container.bind(TYPES.App).to(App).inSingletonScope();

export { container };
