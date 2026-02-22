import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';
import { copyFileSync, mkdirSync, existsSync } from 'node:fs';

// Vite plugin that copies icon PNGs into the build output
function copyIconsPlugin() {
  return {
    name: 'copy-icons',
    closeBundle() {
      const sizes = [16, 32, 48, 128];
      for (const size of sizes) {
        const src = resolve(__dirname, `public/icon/${size}.png`);
        const destDir = resolve(__dirname, '.output/chrome-mv3/icon');
        if (existsSync(src)) {
          mkdirSync(destDir, { recursive: true });
          copyFileSync(src, `${destDir}/${size}.png`);
        }
      }
    },
  };
}

export default defineConfig({
  srcDir: 'src',
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
  vite: () => ({
    plugins: [tailwindcss(), copyIconsPlugin()],
  }),
  manifest: {
    name: 'Readster',
    description: 'A beautiful local-first reading list manager',
    version: '1.0.0',
    permissions: ['storage', 'tabs', 'activeTab', 'contextMenus'],
    action: {
      default_popup: 'popup.html',
      default_title: 'Readster',
      default_icon: {
        '16': 'icon/16.png',
        '32': 'icon/32.png',
        '48': 'icon/48.png',
        '128': 'icon/128.png',
      },
    },
    icons: {
      '16': 'icon/16.png',
      '32': 'icon/32.png',
      '48': 'icon/48.png',
      '128': 'icon/128.png',
    },
  },
});
