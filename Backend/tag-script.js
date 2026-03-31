import fs from 'fs';

const files = [
    { path: './routes/PostgreRoutes/productRoutes.js', tag: 'Products' },
    { path: './routes/PostgreRoutes/planRoutes.js', tag: 'Plans' },
    { path: './routes/PostgreRoutes/clientRoutes.js', tag: 'Clients' },
    { path: './routes/PostgreRoutes/AuthRoutes.js', tag: 'Auth' }
];

for (const { path, tag } of files) {
    if (!fs.existsSync(path)) {
        console.log(`Not found: ${path}`);
        continue;
    }
    
    let content = fs.readFileSync(path, 'utf8');
    
    // Match the start of an express router route handler block
    // It captures up to the opening curly brace `{` of the handler function
    const regex = /(router\.(?:get|post|put|patch|delete)\s*\([^{]+\{\s*)(?!\/\/\s*#swagger\.tags)/g;
    
    content = content.replace(regex, `$1// #swagger.tags = ['${tag}']\n    `);
    
    fs.writeFileSync(path, content, 'utf8');
    console.log(`Tagged ${path} with ${tag}`);
}
