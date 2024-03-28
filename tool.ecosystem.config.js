module.exports = {
  apps: [
    {
      name: '@extension-mounter/extension-builder',
      script: 'cd packages/extension-builder && pnpm dev',
    },
    {
      name: '@extension-mounter/lib-builder',
      script: 'cd packages/lib-builder && pnpm dev',
    },
  ],
};
