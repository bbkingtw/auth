var log=console.log
var chalk=require('chalk');
var bgRed=chalk.bgRed;
setImmediate(()=>log('\n'),5000);
log(chalk.bgRed('============',new Date(),'==========='));

var express=require('express')
var bodyParser=require('body-parser');
var cookieParser = require('cookie-parser')

auth=express();
ws=express()
c4_a4=express()
c4=express()
a4=express()
jwt=express()

morgan=require('morgan')

var iws=0;

function init(eng, title, port, include_js){
	eng.use(morgan('dev'));
	eng.use(cookieParser());
	// parse application/x-www-form-urlencoded
	eng.use(bodyParser.urlencoded({ extended: false }))
	 
	// parse application/json
	eng.use(bodyParser.json())


	eng.use((req,res,next)=>{
		iws++;
		req.port=port;
		req.title=title;
		req.eng=title;
		log('===========', new Date(),'==============');
		log(iws, title, port, 'method=', req.method);
		log(iws, title, port, 'title=', title);
		log(iws, title, port, 'url=', req.url);
		log(iws, title, port, 'query=', req.query);
		log(iws, title, port, 'body=', req.body);
		log(iws, title, port, 'cookies=', req.cookies);
		//log(iws, title, port, 'headers=', req.headers);
		next();
  });

  eng.get('/'+title, (req,res)=>{
		log(title,'url=',req.url);
		res.send('/'+title);
  });
	
	if (include_js) require(`./${title}.js`)(eng, display);

	eng.get('*', wdisplay);
	eng.post('*', wdisplay);
	
	function wdisplay(req,res){
		log(bgRed('============================'));
		log(bgRed(`${req.url} need to be config`));
		log(bgRed('============================'));
		res.send(`title=${title} port=${port} url=${req.url}`);
	};

  eng.listen(port)
};

init(auth, 'auth', 5001, true)
init(a4, 'a4', 5005, true)
init(jwt,'jwt',5006, true)

init(ws,'ws',5002)
init(c4_a4,'c4_a4',5003)
init(c4,'c4',5004)

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

function display(req,res,next){
	log(`port=${req.port} eng=${req.eng}`)
	next()
}


