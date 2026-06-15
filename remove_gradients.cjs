const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function cleanFile(filePath) {
    if (filePath.endsWith('.jsx') || filePath.endsWith('.js') || filePath.endsWith('.tsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        
        // Remove bg-gradient-to-xxx
        content = content.replace(/bg-gradient-to-[a-z0-9\-]+/g, 'bg-[#0f172a]');
        
        // Remove from-xxx, via-xxx, to-xxx
        content = content.replace(/\bfrom-[a-zA-Z0-9\-\[\]\#\:\/]+\b/g, '');
        content = content.replace(/\bvia-[a-zA-Z0-9\-\[\]\#\:\/]+\b/g, '');
        content = content.replace(/\bto-[a-zA-Z0-9\-\[\]\#\:\/]+\b/g, '');
        
        // Remove text-transparent bg-clip-text
        content = content.replace(/\bbg-clip-text\b/g, '');
        content = content.replace(/\btext-transparent\b/g, 'text-white');
        
        // Clean up excessive spaces on the same line
        content = content.replace(/[ \t]{2,}/g, ' ');
        content = content.replace(/ \}/g, '}').replace(/ "/g, '"').replace(/ '/g, "'");
        
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content);
            console.log(`Cleaned ${filePath}`);
        }
    }
}

function traverseDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverseDir(fullPath);
        } else {
            cleanFile(fullPath);
        }
    }
}

traverseDir(srcDir);
console.log('Done');
