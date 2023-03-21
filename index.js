var http = require("http");

let compteurID = 1;

const handleGet = (request, response) => {  
  console.log("J'ai recu un GET");
  const url = new URL(request.url, 'http://localhost/'); //   /?toto=bonjour&tata=aurevoir
  const params = Object.fromEntries(url.searchParams);   //   { toto: 'bonjour', tata: 'aurevoir' }
  let articleId = (url.pathname.split('/'))
  switch(url.pathname){
    case '/':
      response.end("juste un get normal")
      return;
    case '/articles':
      response.end(JSON.stringify(poolOfArticle))
      return;
    case '/articles/'+ articleId[2]:
      if(poolOfArticle[articleId[2]-1]){
        response.end(JSON.stringify(poolOfArticle.find(elem => elem.id == articleId[2])))
      } else {
        response.end(JSON.stringify("Pas d'article avec cet ID"))
      }
      
  }
}

const handlePost = (request, response) => { 
  const url = new URL(request.url, 'http://localhost/'); //   /?toto=bonjour&tata=aurevoir
  const params = Object.fromEntries(url.searchParams);   //   { toto: 'bonjour', tata: 'aurevoir' }
  let body = [];

  let articleId = (url.pathname.split('/'))
  switch(url.pathname){
    case '/articles':
      console.log("add nodemon")
      request.on('data', (chunk) => {
        body.push(chunk);
      }).on('end', () => {
        body = Buffer.concat(body).toString();
        let lebody = JSON.parse(body)
        let newArt = createNewArticle(
          compteurID,lebody.nom,lebody.description,
          lebody.category,lebody.prix,lebody.promo,
          lebody.note,lebody.quantity,poolOfArticle)
        response.end(JSON.stringify(poolOfArticle))
      });

      return;
  }
}

const handlePut = (request, response) => {  
  const url = new URL(request.url, 'http://localhost/'); //   /?toto=bonjour&tata=aurevoir
  const params = Object.fromEntries(url.searchParams);   //   { toto: 'bonjour', tata: 'aurevoir' }
  let articleId = (url.pathname.split('/'))
  switch(url.pathname){
    case '/articles/'+articleId[2]:
      if(poolOfArticle[articleId[2]-1]){
        poolOfArticle.splice(articleId[2]-1,1,new Article(articleId[2],"cerise","une super cerise","fruit",3.3,0.1,5,7))
        response.end(JSON.stringify(poolOfArticle))
      } else {
        response.end("pas d'article à modifier avec cet ID");
      }
      return;
  }
}

const handleDelete = (request, response) => {  
  const url = new URL(request.url, 'http://localhost/'); //   /?toto=bonjour&tata=aurevoir
  const params = Object.fromEntries(url.searchParams);   //   { toto: 'bonjour', tata: 'aurevoir' }
  let articleId = (url.pathname.split('/'))
  switch(url.pathname){
    case '/articles/'+articleId[2]:
      if(poolOfArticle[articleId[2]-1]){
        poolOfArticle.splice(articleId[2]-1,1)
        response.end(JSON.stringify(poolOfArticle))
      } else {
        response.end("pas d'article à supprimer avec cet ID");
      }
      return;
  }
}

class Article{
  constructor(id,nom,description,category,price,promo,note,quantity){
    this.id = id,
    this.nom = nom,
    this.description = description,
    this.category = category,
    this.price = price,
    this.promo = promo,
    this.note = note,
    this.quantity = quantity
  }
}

let poolOfArticle =[];

function createNewArticle(id,nom,description,category,price,promo,note,quantity,arrayArticle){
  let article = new Article(id,nom,description,category,price,promo,note,quantity)
  compteurID++
  if(arrayArticle){
    poolOfArticle.push(article);
  }
}

let art1 = createNewArticle(compteurID,"pomme","une pomme","fruit",2,0,5,1,poolOfArticle);
let art2 = createNewArticle(compteurID,"poire","une poire","fruit",3,0,5,2,poolOfArticle);

const handleRequests = (request, response) => {
  switch (request.method) {
    case 'GET':
      handleGet(request, response)
      return;

    case 'POST':
      response.writeHead(201);
      handlePost(request,response);
      console.log("J'ai recu un POST")
      return;

    case 'PUT':
      response.writeHead(201);
      handlePut(request,response);
      console.log("J'ai recu un PUT")
      return;

    case 'DELETE':
      handleDelete(request,response);
      console.log("J'ai recu un DELETE")
      return;

    default:
      response.writeHead(404);
      response.end("Error 404 - brain not found :P")
      break;
  }

  response.end();
}

var httpServer = http.createServer(handleRequests)

httpServer.listen(3030, () => {
  console.log("Node server listening on port 3030")
})