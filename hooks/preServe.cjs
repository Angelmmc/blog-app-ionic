#!/usr/bin/env node
const { execSync } = require('child_process');

console.log('Verificando dependencias...');
execSync('npm install', { stdio: 'inherit' });
