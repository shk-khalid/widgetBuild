#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const CLASSNAME_REGEX = /class(Name)?=["'`]([^"'`]+)["'`]/g;
const TW_PREFIX = 'tw-';

// Utility to add prefix to each class in a className string
function prefixClasses(classString) {
  return classString
    .split(/\s+/)
    .map(cls => {
      if (cls.startsWith(TW_PREFIX) || cls.startsWith('group-hover:') || cls.startsWith('hover:')) {
        return cls.replace(/\b(hover:|group-hover:)?([^\s]+)/g, (m, pre = '', base) => {
          return pre + (base.startsWith(TW_PREFIX) ? base : TW_PREFIX + base);
        });
      }
      return cls.startsWith(TW_PREFIX) ? cls : TW_PREFIX + cls;
    })
    .join(' ');
}

// Recursively walk directory
function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

// Process one file
function processFile(filePath) {
  if (!filePath.match(/\.(js|jsx|ts|tsx)$/)) return;

  const content = fs.readFileSync(filePath, 'utf8');
  const updatedContent = content.replace(CLASSNAME_REGEX, (match, _name, classList) => {
    const newClasses = prefixClasses(classList);
    return match.replace(classList, newClasses);
  });

  if (updatedContent !== content) {
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`✅ Updated: ${filePath}`);
  }
}

// MAIN
const targetDir = process.argv[2];
if (!targetDir) {
  console.error('❌ Please provide a directory. Example: node tw-prefixer.js ./src');
  process.exit(1);
}

walkDir(path.resolve(targetDir), processFile);
