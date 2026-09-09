import {mkdir,cp,readFile,writeFile} from 'node:fs/promises';
const pkg=JSON.parse(await readFile('node_modules/pixi.js/package.json','utf8'));
if(pkg.version!=='8.7.0')throw Error('Unexpected Pixi runtime version');
await mkdir('dist/vendor',{recursive:true});
for(const file of ['index.html','composition.html','composition.js','layout.js','review.css','scene.js','manifest.js','assets'])await cp(file,`dist/${file}`,{recursive:true});
await cp('node_modules/pixi.js/dist/pixi.min.mjs','dist/vendor/pixi.min.mjs');
await cp('node_modules/pixi.js/LICENSE','dist/vendor/PIXI-LICENSE');
await writeFile('dist/build.json',JSON.stringify({gate:'A',runtime:pkg.version,static:true,production:false}));
