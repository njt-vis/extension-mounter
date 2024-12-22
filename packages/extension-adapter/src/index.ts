// import { Listener } from '@app-fe/listener';

import {
  ATTRIBUTES,
  CreateStaticELementOption,
  HTMLRemoteElement,
  HTML_TAG_NAME,
  register,
} from './remote-element';

export interface RemoteAdapterResource {
  tag: 'link';
  attributes: {
    rel: string;
    href: string;
  };
}
export interface RemoteAdapterOptions {
  container: HTMLDivElement;
  resources?: RemoteAdapterResource[];
}

class RemoteAdapter {
  constructor(options: RemoteAdapterOptions) {
    this.parentContainer = options.container;
    this.resources = options.resources || [];
  }

  private isDestroy = false;
  private remoteElement?: HTMLRemoteElement;
  private parentContainer?: HTMLDivElement;
  private resources: RemoteAdapterResource[] = [];
  // private listener?: Listener;

  private beforeMount = () => {
    this.remoteElement?.setAttribute(
      ATTRIBUTES.LINK_RESOURCES,
      JSON.stringify(this.resources)
    );
  };

  private beforeDestroy = () => {
    // this.listener?.destroy();
  };

  public publicPath = '';
  public container?: HTMLDivElement;

  public getStaticResources = (): CreateStaticELementOption[] => {
    return [];
  };

  /** 挂载节点 */
  public mount = () => {
    this.remoteElement = document.createElement(
      HTML_TAG_NAME
    ) as HTMLRemoteElement;

    this.beforeMount();

    this.parentContainer?.appendChild(this.remoteElement);
    this.container = this.remoteElement.remoteContainer;

    this.remoteElement.addEventListener('load', () => {
      this.onMounted();
    });
  };

  /** 卸载节点 */
  public unmount = () => {
    if (this.isDestroy) return;

    this.beforeDestroy();
    this.onDestroy();
    this.remoteElement && this.parentContainer?.removeChild(this.remoteElement);
    this.isDestroy = true;
  };

  public onMounted = () => {};

  public onDestroy = () => {};

  /** 重新加载节点 */
  public reload = () => {
    // this.listener?.emit('reload');
  };

  /** 监听重载 */
  public onReload = (_fn: () => void) => {
    // this.listener?.on('reload', fn);
  };
}

export {
  register,
  CreateStaticELementOption,
  HTMLRemoteElement,
  HTML_TAG_NAME,
};

export default RemoteAdapter;
