/**
 * Script to update package.json with required dependencies for optimizations
 */
const fs = require('fs');
const path = require('path');

// Path to package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');

// Read the current package.json
let packageJson;
try {
  const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
  packageJson = JSON.parse(packageJsonContent);
} catch (error) {
  console.error('Error reading package.json:', error);
  process.exit(1);
}

// Dependencies to add or update
const dependenciesToAdd = {
  '@angular/service-worker': '^19.2.0', // For PWA support
  'web-animations-js': '^2.3.2', // For animations polyfill
  'idb': '^7.1.1', // For IndexedDB wrapper
  'comlink': '^4.4.1', // For web worker communication
  'dexie': '^3.2.4', // For easier IndexedDB usage
};

// DevDependencies to add or update
const devDependenciesToAdd = {
  'lighthouse': '^11.0.0', // For performance auditing
  'compression-webpack-plugin': '^10.0.0', // For gzip compression
  'webpack-bundle-analyzer': '^4.10.1', // Already exists, but ensuring it's here
  '@angular/pwa': '^19.2.0', // For PWA schematics
};

// Add or update dependencies
packageJson.dependencies = {
  ...packageJson.dependencies,
  ...dependenciesToAdd
};

// Add or update devDependencies
packageJson.devDependencies = {
  ...packageJson.devDependencies,
  ...devDependenciesToAdd
};

// Add or update scripts
const scriptsToAdd = {
  'analyze': 'ng build --stats-json && webpack-bundle-analyzer dist/compliance-classifier-frontend/stats.json',
  'lighthouse': 'lighthouse http://localhost:4200 --view',
  'pwa': 'ng add @angular/pwa --project compliance-classifier-frontend',
  'compress': 'gzip -r dist/compliance-classifier-frontend -k',
  'build:prod:stats': 'ng build --configuration=production --stats-json',
  'analyze:prod': 'npm run build:prod:stats && webpack-bundle-analyzer dist/compliance-classifier-frontend/stats.json',
  'test:coverage': 'ng test --code-coverage',
  'serve:pwa': 'http-server -p 8080 -c-1 dist/compliance-classifier-frontend'
};

packageJson.scripts = {
  ...packageJson.scripts,
  ...scriptsToAdd
};

// Write the updated package.json
try {
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('Successfully updated package.json with optimization dependencies and scripts');
} catch (error) {
  console.error('Error writing package.json:', error);
  process.exit(1);
}