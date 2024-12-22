module.exports = {
  apps: [
    {
      name: '@extension-mounter/hosts',
      script: 'cd packages/hosts && pnpm dev',
    },
    {
      name: '@extension-mounter/extension-adapter',
      script: 'cd packages/extension-adapter && pnpm dev',
    },
  ],
};
