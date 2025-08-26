#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Publishing Apex Framework packages to npm...\n');

try {
  // Check if we're on the master branch
  const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
  if (currentBranch !== 'master') {
    console.warn(`⚠️  Warning: You are on branch '${currentBranch}', not 'master'.`);
    console.warn(`   Consider switching to master before publishing.\n`);
  }

  // Check if working directory is clean
  const status = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
  if (status) {
    console.warn('⚠️  Warning: You have uncommitted changes.');
    console.warn('   Consider committing or stashing them before publishing.\n');
  }

  // Build all packages first
  console.log('🔨 Building all packages...');
  execSync('pnpm build', { stdio: 'inherit' });
  console.log('✅ All packages built successfully!\n');

  // Publish all @apex-framework packages
  console.log('📦 Publishing packages to npm...');
  execSync('pnpm --filter "@apex-framework/*" publish --access public', { stdio: 'inherit' });
  
  console.log('\n🎉 All packages published successfully!');
  console.log('\n📝 Next steps:');
  console.log('   1. Verify the published packages at https://www.npmjs.com/org/apex-framework');
  console.log('   2. Consider creating a GitHub release to document this version');
  console.log('   3. Update documentation if needed\n');

} catch (error) {
  console.error('\n❌ Publishing failed!');
  console.error(error.message);
  process.exit(1);
}