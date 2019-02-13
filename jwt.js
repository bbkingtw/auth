chalk=require('chalk')
bgRed=chalk.bgRed;
bgYellow=chalk.bgYellow;
request=require('request');
secret='1234';

uuid=require('uuid');
kv={}

module.exports=(eng, display)=>{
	eng.get('/jwt/logout', check_token, (req,res,next)=>{
		if (req.jwt_status!='ok') return res.send(req.jwt_status);
		var user=req.jwt_token.user
		res.clearCookie('authorization','');
		res.send(`${user} logout`);
		req.init_ws=true;
		next();
	});

	eng.get('/jwt/a4_jwt',(req,res)=>{
		var a4_token=req.cookies['a4_token'];
		log(bgYellow('get a4_token', a4_token));
		var url=`http://localhost/a4/validate_token?a4_token=${a4_token}`;
		request(url, {json:true}, (err,resp,data)=>{
			if (err||resp.statusCode!=200) 
				return res.send('a4 dead or a4 time_out or wrong pass');

			log(bgYellow('a4 token is correct==>', req.query.forward_url));
			log(bgYellow('a4 token content'), data);
			var app=req.query.ap_name;
			if (!app) {
				log(bgRed('unknown app is restricted'));
				//return res.send('unknown app is restricted');
			}

			let jwt_token = lib_jwt_token.sign(data, secret, { expiresIn: '1m'});
			log(`generate jwt ${jwt_token} and send via cookie`);

			res.cookie('authorization','Bearer '+jwt_token);
			res.redirect(req.query.forward_url);
		});	
	});

	var minutes=60*1000;
}
log=console.log

let lib_jwt_token = require('jsonwebtoken');
var username='bbkingtw';


var secret='1234';
var username='bbkingtw';

function check_token(req, res, next) {
  let token = req.headers['x-access-token'] 
	|| req.headers['authorization']
	|| req.cookies['authorization']; 

  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  if (token) {
    log('found token',token);

    lib_jwt_token.verify(token, secret, (err, decoded) => {
      log(bgRed('err',err));
      log(bgYellow('decoded'),decoded);
      if (err) {
  	log(bgRed('Token is not valid', err.message));
	req.jwt_status='token error:'+err.message;
	return next();

	return res.send(401);
        return res.json({
          success: false,
          message: 'Token is not valid'
        });
      } else {
	req.jwt_status='ok';	
        req.jwt_token = decoded;
  	log(bgYellow('Token is ok'),decoded);
	return next();

        next();
      }
    })
  } else {
    req.jwt_status='you are not logging yet';
    return next();

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
