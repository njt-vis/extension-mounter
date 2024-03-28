import './style.css';
import { register as registerRemoteAdapter } from '@extension-mounter/extension-adapter';

registerRemoteAdapter();

const extensionList = [
  {
    name: '@template/extension',
    version: '1.0.0',
    libs: {
      react: '18.2.0',
      'react-dom': '18.2.0',
      '@antv/g2': '5.1.15',
    },
  },
];

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

System.import('http://127.0.0.1:8010/main.js')
  .then(m => {
    console.log(m);
  })
  .catch(err => {
    console.log(err);
  });

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
