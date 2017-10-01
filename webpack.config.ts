import * as path from 'path';
import { Configuration } from 'webpack';

const config: Configuration = {
  entry: {
    'examples/MDN_Form_validation/App': './examples/MDN_Form_validation/App.tsx',
    'examples/Bootstrap4/App': './examples/Bootstrap4/App.jsx',
    'examples/NativeFormWidgets/App': './examples/NativeFormWidgets/App.tsx',
    'examples/Password/App': './examples/Password/App.tsx',
    'examples/PasswordNoState/App': './examples/PasswordNoState/App.tsx',
    'examples/HttpStatusCode/App': './examples/HttpStatusCode/App.tsx',
    'examples/WizardForm/App': './examples/WizardForm/App.tsx',
    'examples/NoFramework/App': './examples/NoFramework/App.tsx',
    'examples/HTML5Constraints/App': './examples/HTML5Constraints/App.tsx',
    'examples/SignUp/App': './examples/SignUp/App.tsx'
  },

  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js'
  },

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },

  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader', options: {compilerOptions: {module: 'esnext', declaration: false}} },
      { test: /\.jsx?$/, loader: 'babel-loader', options: {presets: ['react']} },
      { test: /\.(html|css|png)$/, loader: 'file-loader', options: {name: '[path][name].[ext]'} }
    ]
  }
};

export = config;
