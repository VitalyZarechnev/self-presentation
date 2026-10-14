import path from 'node:path';
import { NextConfig } from 'next';

type WebpackConfiguration = Parameters<NonNullable<NextConfig['webpack']>>[0];

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  sassOptions: {
    includePaths: [path.join(process.cwd(), 'src')],
  },
  webpack(config: WebpackConfiguration) {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...(config.resolve.alias as Record<string, string> | undefined),
      '@assets': path.join(process.cwd(), 'src/assets'),
    };

    return config;
  },
  turbopack: {
    root: process.cwd(),
    resolveAlias: {
      '@assets': './src/assets',
    },
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              svgoConfig: {
                plugins: [
                  {
                    name: 'preset-default',
                    params: {
                      overrides: {
                        removeViewBox: false,
                      },
                    },
                  },
                  'removeDimensions',
                ],
              },
            },
          },
        ],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
