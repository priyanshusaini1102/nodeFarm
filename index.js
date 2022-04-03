const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');

const putCard = require('./modules/putCard');

//"slugify": "^1.6.5" : 1->denotes the major version, 6->denotes the minor version and 5->denotes the patch which is only for bug fixes.
//TODO: clear confusion between './file_name' and `${__dirname/file_name}`

// const textIn = fs.readFileSync('./txt/input.txt','utf-8');

// const textOut = `This is what we changes know about the avocado. ${textIn} \n Create on ${Date.now().toLocaleString()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File has been written successfully.");


// // This is called callback hell. 
// fs.readFile('./txt/input.txt','utf-8',(err,data1) => {
//     fs.readFile('./txt/append.txt','utf-8',(err,data2) => {
//         fs.writeFile('./txt/appended.txt',`${data1} \n ${data2}`, err => console.log('Done append check your file now.'));
//     })
// })

//Read data from file as string(as module like url,fs,etc technically) or text(with synchronization).
const overview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const temp = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');

//Read Data from JSON file and parse it to javascript object.
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const list = JSON.parse(data);

//make slugs array from list
const slugs = list.map(item => slugify(item.productName,{ lower:true })); 

//only to use package.
console.log(slugs);

//Replace all product data with template and join and save in overviewList variable.
const overviewList = list.map((product, index) =>putCard(temp,product)).join('');
//Replace overviewList with overview template and save in overviewWithData variable.
const overviewWithData = overview.replace('{%OVERVIEWLIST%}',overviewList);


//////////////~~~~~~SERVER~~~~~////////////////////
const server = http.createServer((req, res) => {
    // console.log(url.parse(req.url, true));        //true for making query as object query = {id:'0'}
   
    const {pathname, query} = url.parse(req.url, true);

    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(overviewWithData);
      }
      else if(pathname === '/product'){
        const product = list[query.id];
        const productHtml = putCard(tempProduct, product);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(productHtml);
      }else if(pathname === '/api'){
        res.writeHead(200, { 'Content-Type': 'application/json' }); 
        res.end(data);
      }
      else {
          res.writeHead(404,'not found ');
        res.end(`<h1>Page Not Found</h1>`);
      }
})

const port = 8080;

server.listen(port,'localhost',()=> {
    console.log(`Server listening on http://localhost:${port}`);
});

