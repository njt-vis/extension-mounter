export const HTML_TAG_NAME = 'extension-element';

export interface CreateStaticELementOption {
  tag: string;
  attributes: Record<string, string>;
}

const createElement = ({
  tag,
  attributes,
}: CreateStaticELementOption): HTMLElement => {
  const element = document.createElement(tag);
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
  return element;
};

export enum ATTRIBUTES {
  LINK_RESOURCES = 'link-resources',
}

export class HTMLRemoteElement extends HTMLElement {
  linkElements: (HTMLLinkElement | HTMLScriptElement)[] = [];
  remoteContainer: HTMLDivElement;
  loadEvent: CustomEvent;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    /* 创建存放容器 */
    const remoteContainer = document.createElement('div');
    remoteContainer.setAttribute('style', 'height: 100%');
    shadow.appendChild(remoteContainer);

    /* 基础样式 */
    const styleContainer = document.createElement('style');
    styleContainer.innerHTML = `
      :host {
        height: 100%;
      }
    `;
    shadow.appendChild(styleContainer);

    this.remoteContainer = remoteContainer;

    this.loadEvent = new CustomEvent('load', {
      bubbles: true,
      cancelable: false,
    });
  }

  static get observedAttributes() {
    return [ATTRIBUTES.LINK_RESOURCES];
  }

  updateLinkResources = () => {
    const linkResources = this.getAttribute(ATTRIBUTES.LINK_RESOURCES);

    if (!linkResources) return;

    this.linkElements.forEach(element => {
      this.removeChild(element);
    });

    const linkElements = JSON.parse(linkResources as string) ?? [];
    this.linkElements = linkElements.map(item => {
      const element = createElement(item);
      this.shadowRoot?.insertBefore(element, this.remoteContainer);
      return element;
    });
    const promises = this.linkElements
      .filter(item => item.nodeName === 'LINK')
      .map(item => {
        return new Promise((resolve, reject) => {
          item.addEventListener('load', resolve);
          item.addEventListener('error', reject);
        });
      });
    Promise.all(promises).finally(() => {
      this.dispatchEvent(this.loadEvent);
    });
  };

  attributeChangedCallback(name) {
    switch (name) {
      case ATTRIBUTES.LINK_RESOURCES:
        this.updateLinkResources();
        break;
      default:
    }
  }
}

let isDefined = false;

export const register = () => {
  if (isDefined) return;

  try {
    window.customElements.define(HTML_TAG_NAME, HTMLRemoteElement);
    isDefined = true;
  } catch (error) {
    console.log('[ERROR]', error);
  }
};
