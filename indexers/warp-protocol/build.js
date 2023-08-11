require('esbuild')
  .build({
    entryPoints: [
      'src/collectors/events/index.ts',
      'src/indexers/analytics/index.ts',
      'src/indexers/jobs/index.ts',
      'src/indexers/jobs-tx-history/index.ts',
    ],
    bundle: true,
    minify: true,
    sourcemap: true,
    platform: 'node',
    format: 'cjs',
    target: ['node14'],
    outdir: 'dist',
    outbase: 'src',
  })
  .catch(() => process.exit(1));
