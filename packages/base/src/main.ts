import './style.css';
import qs from 'qs';
import { register as registerRemoteAdapter } from '@extension-mounter/extension-adapter';

registerRemoteAdapter();

const formatExtensionUrl = () => {};

const formstLibraryUrl = () => {};

const extensionList = [
  {
    name: '@template/extension',
    version: '1.0.0',
    hasCss: false,
    libs: {
      react: 'version=18.2.0&css=0',
      'react-dom': 'version=18.2.0&css=0',
      '@antv/g2': 'version=5.1.15&css=0',
      antd: 'version=4.24.15&css=1',
    },
  },
];

extensionList.forEach(ext => {
  const resources: {
    tag: string;
    attributes: { rel: string; href: string };
  }[] = [];
  Object.entries(ext.libs).forEach(([name, paramsStr]) => {
    const params = qs.parse(paramsStr);
    if (params.css === '1') {
      resources.push({
        tag: 'link',
        attributes: {
          rel: 'stylesheet',
          href: `http://127.0.0.1:94/${name}/${params.version}/main.css`,
        },
      });
    }
  });
  System.import(`http://127.0.0.1:8010/${ext.name}/${ext.version}/main.js`)
    .then(({ default: Remote }) => {
      const container = document.createElement('div');
      const adapter = new Remote({
        container,
        resources,
      });
      adapter.mount();
      document.body.appendChild(container);
    })
    .catch(err => {
      console.log(err);
    });
  // extensionElement.setAttribute(
  //   ATTRIBUTES.LINK_RESOURCES,
  //   JSON.stringify(resources)
  // );
  // document.body.appendChild(extensionElement);
});

// 该常量需动态生成
const importMaps = [
  {
    name: '@antv/g2@5.1.15',
    // 服务器地址
    url: 'http://127.0.0.1:94/@antv/g2/5.1.15/main.js',
    // 客户端地址
    path: '',
  },
  {
    name: 'antd@4.24.15',
    // 服务器地址
    url: 'http://127.0.0.1:94/antd/4.24.15/main.js',
    // 客户端地址
    path: '',
  },
  {
    name: 'react@18.2.0',
    // 服务器地址
    url: 'http://127.0.0.1:94/react/18.2.0/main.js',
    // 客户端地址
    path: '',
  },
  {
    name: 'react-dom@18.2.0',
    // 服务器地址
    url: 'http://127.0.0.1:94/react-dom/18.2.0/main.js',
    // 客户端地址
    path: '',
  },
];

importMaps.forEach(item => {
  System.addImportMap({
    imports: {
      [item.name]: item.url,
    },
  });
});

// System.import('http://127.0.0.1:8010/main.js')
//   .then(m => {
//     console.log(m);
//   })
//   .catch(err => {
//     console.log(err);
//   });

// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
//   <div>
//     <a href="https://vitejs.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://www.typescriptlang.org/" target="_blank">
//       <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
//     </a>
//     <h1>Vite + TypeScript</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite and TypeScript logos to learn more
//     </p>
//   </div>
// `;

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!);
