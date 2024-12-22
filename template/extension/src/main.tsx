import { Root, createRoot } from 'react-dom/client';
import RemoteAdapter from '@extension-mounter/extension-adapter';

import App from './App';

export default class RemoteEntry extends RemoteAdapter {
  private root?: Root;

  private beforeRender = () => {
  };
  private beforeUnmout = () => {
  };

  /** 容器完成挂载 */
  override onMounted = (): void => {
    if (!this.container) {
      console.log('[ERROR]', 'Lost container');
      return;
    }
    this.beforeRender();

    const root = createRoot(this.container);

    root.render(<App />);

    this.root = root;
  };

  /** 容器销毁 */
  override onDestroy = (): void => {
    this.beforeUnmout();
    this.root?.unmount();
  };
}
