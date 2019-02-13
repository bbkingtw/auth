var express=require('express')
var bodyParser=require('body-parser');

auth=express();
ws=express()
c4_a4=express()
c4=express()
a4=express()
jwt=express()

init(auth,'auth',5001)
init(ws,'ws',5002)
init(c4_a4,'c4_a4',5003)
init(c4,'c4',5004)
init(a4,'a4',5005)
init(jwt,'jwt',5006)

var log=console.log
let jwt_token = require('jsonwebtoken');
var secret='1234';
var username='bbkingtw';

function provide_jwt(req,res){
	let token = jwt_token.sign({username: username}, secret, { 
		expiresIn: '24h' 
        });

        // return the JWT token for the future API calls
        res.json({
          success: true,
          message: 'Authentication successful!',
          token: token
        });
}

function check_token(req, res, next) {
  let token = req.headers['x-access-token'] || req.headers['authorization']; 

  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  if (token) {
    log('found token',token);

    jwt_token.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Token is not valid'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    })
  } else {
    log('no token is found');
    return res.send(401);
    return res.redirect('http://www.pchome.com.tw/a4');
    return res.send(302);
    return res.json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }
};

function init(eng, reply, port) {
	eng.use(bodyParser.urlencoded({ extended: false }))
	eng.use(bodyParser.json())
 
  eng.get('/'+reply, (req,res)=>{
		log('port:', port, '/'+reply+' is activated');
    res.send(reply)
  });

	eng.use(function(req,res,next){
		req.port=port;
		req.eng='reply';
		next();
	});

	eng.listen(port);
}

function display(req,res,next){
	log(`port=${req.port} eng=${req.eng}`)
	next()
}

if (false) {
auth.get('/auth',display,check_token,(req,res)=>{
	log('this is auth');
  if (!req.cookies.jwt) res.status(401); 
	log('jwt', req.cookies.jwt);
  res.send(200); 
});

auth.post('/auth',display,(req,res)=>{
	return res.send('auth post ok');	
});

ws.get('/ws', (req,res)=>{
  res.status(200).send('date=>'+new Date()+'\n');
});

jwt.get('/jwt', provide_jwt);

a4.get('/a4/login', function(req,res){
	res.send(`
		<form method="post">
			<label>id</label><input name="name" id="id" value="id">
			<label>pass</label><input name="pass" id="pass" value="pass">
			<input type='submit'>
		</form>
	`)	
});

a4.post('/login', (req,res)=>{
	res.send({status:'posted', body:req.body, query:req.query});
});

a4.get('*', function(req,res){
	var obj={
		body:req.body, 
		query:req.query, 
		headers:req.headers, 
		cookies:req.cookies
	}; 
	var rows=[];
	for (var k in obj) {
		v=JSON.stringify(obj[k]);
		rows.push(`<td>${k}</td><td>${v}</td>`);
	}
	var s2=rows.join('</tr><tr>');
	var s=JSON.stringify(obj,"",4);
	return res.send(obj);
	return res.send(`<table><tr>${s2}</tr></table>`);
});
}
