import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: './index.ts',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      http: false,
      https: false,
      crypto: false,
      fs: false,
      zlib: false,
      path: false,
      querystring: false,
      url: false,
      stream: false,
      os: false,
      timers:false,
      tls:false,
      net:false,
      util:false,
      assert:false,
      buffer:false,
      async_hooks: false
    },
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
