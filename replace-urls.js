const fs = require('fs');
const path = require('path');

const dir = 'd:/Downloads/backend project/frontend/src';

function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}

walkSync(dir, (filePath) => {
    if(filePath.endsWith('.jsx') || filePath.endsWith('.js')){
        let content = fs.readFileSync(filePath, 'utf8');
        if(content.includes('http://127.0.0.1:5000')){
            console.log('Updating: ' + filePath);
            
            // To be purely generic: import.meta.env.VITE_API_URL or fallback
            // But we can't easily replace inside quotes without doing AST.
            // A much easier way: just search for 'http://127.0.0.1:5000/api' and replace it!
            
            // Wait, if it's currently: axios.get('http://127.0.0.1:5000/api/cars', {
            // we want it to be: axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/cars`, {
            
            // Regex to match: 'http://127.0.0.1:5000/api...'
            let replaced = content.replace(/'http:\/\/127\.0\.0\.1:5000([^']*)'/g, "`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}$1`");
            
            // Match `http://127.0.0.1:5000...` inside backticks (already a template string)
            // e.g. `http://127.0.0.1:5000/api/admin/cars/${id}`
            replaced = replaced.replace(/`http:\/\/127\.0\.0\.1:5000([^`]+)`/g, "`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}$1`");

            fs.writeFileSync(filePath, replaced, 'utf8');
        }
    }
});
console.log('URL replacement completed.');
