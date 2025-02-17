import CoreComponent, { ICoreComponentProps } from "./Core.component";
import { memeList, IMeme, eventType } from "../collection/Memes.collection";
import config from "../collection/Config.collection.json";

interface IEphemeralComponentProps extends ICoreComponentProps {
  icon: "goblin" | "pogvid" | "random";
  event: eventType.click;
}

const styleTemplate: string = `
    img {
        max-width: 50px;
        max-height: 50px;
    }
`;

class EphemeralComponent extends CoreComponent {
  props: IEphemeralComponentProps;
  wrapper: any;

  constructor(props: IEphemeralComponentProps) {
    super(props);

    this.wrapper = this.createChildren(
      "div",
      `<img src="${this.getSprite(props.icon)}" />`
    );
    this.wrapper.className += "ephemeral-content";
    this.render(this.wrapper);
    document.body.appendChild(this);
    this.setStyle();
    this.kill();
  }

  getSprite(name: string): string {
    let sprite: any = name;
    if (name === "random") {
      let list: IMeme[] = memeList;
      if (this.props.event) {
        list = list.filter(mem => mem.event.includes(this.props.event));
      }
      sprite = list[Math.floor(Math.random() * list.length)];
      return `./static/img/${sprite.path}.${sprite.extension}`;
    }
    return `./static/img/${sprite}.png`;
  }

  setStyle(): void {
    const style: HTMLStyleElement = document.createElement("style");
    style.textContent = styleTemplate;
    this.shadowRoot.appendChild(style);
    this.setClass("ephemeral");
    const min: number = this.offsetWidth;
    const max: number = window.innerWidth - min;
    const left: number = Math.floor(Math.random() * (max - min / 2));
    this.style.left = left.toString();
    this.style.animationDuration = this.randomizeDuration();
  }

  kill(): void {
    setTimeout(() => {
      this.parentNode.removeChild(this);
    }, Number(this.style.animationDuration.slice(0, -2)));
  }

  randomizeDuration(): string {
    const duration: number = config.visual.ephemeralTimer;
    const factor: number = 1;
    return `${(duration + (Math.random() * (duration / factor) - (duration / (factor * 2)))).toFixed(2)}ms`;
  }
}

customElements.define("game-ephemeral", EphemeralComponent as any);

export default EphemeralComponent;
