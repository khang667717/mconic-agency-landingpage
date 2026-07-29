const esbuild = require('esbuild');
const fs = require('fs');

// Ensure dist directories exist
const distDirs = ['dist', 'dist/js', 'dist/css'];
distDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const isProduction = process.env.NODE_ENV === 'production';
const isWatch = process.argv.includes('--watch');

console.log(`🔨 Building with esbuild (${isProduction ? 'production' : 'development'} mode)...`);

const jsConfig = {
  entryPoints: {
    'main': 'js/script.js',
    'insurance': 'js/insurance.js'
  },
  bundle: true,
  minify: isProduction,
  sourcemap: true,
  outdir: 'dist/js',
  loader: {
    '.js': 'jsx',
    '.png': 'dataurl',
    '.webp': 'dataurl',
    '.woff2': 'dataurl'
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  },
  logLevel: 'info'
};

const cssConfig = {
  entryPoints: {
    'main': 'css/base.css',
    'insurance': 'css/insurance.css'
  },
  bundle: true,
  minify: isProduction,
  sourcemap: true,
  outdir: 'dist/css',
  loader: {
    '.woff2': 'dataurl',
    '.webp': 'dataurl',
    '.png': 'dataurl'
  },
  logLevel: 'info'
};

async function build() {
  try {
    if (isWatch) {
      // Watch mode: use incremental rebuild
      const jsCtx = await esbuild.context(jsConfig);
      const cssCtx = await esbuild.context(cssConfig);
      
      await jsCtx.watch();
      await cssCtx.watch();
      
      console.log('👀 Watching for changes...');
    } else {
      // One-time build
      await esbuild.build(jsConfig);
      await esbuild.build(cssConfig);
      console.log('✓ Build complete!');
      console.log('📦 Output: dist/js/ and dist/css/');
    }
  } catch (err) {
    console.error('❌ Build failed:', err);
    process.exit(1);
  }
}

build();
