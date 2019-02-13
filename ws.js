log=console.log

module.exports=(auth,display)=>{
	auth.get('/ws/check_user',display,check_token,(req,res)=>{
		log('this is auth');
	  if (!req.cookies.jwt) res.status(401); 
		log('jwt', req.cookies.jwt);
	  res.send(200); 
	});
}

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
  let token = req.headers['x-access-token'] 
	|| req.headers['authorization']
	|| req.cookies['authorization']; 

  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  if (token) {
    log('found token',token);

    jwt_token.verify(token, secret, (err, decoded) => {
      log(bgRed('err',err));
      log(bgYellow('decoded'),decoded);
      if (err) {
  	log(bgRed('Token is not valid', err.message));
	return res.send(401);
        return res.json({
          success: false,
          message: 'Token is not valid'
        });
      } else {
  	log(bgYellow('Token is ok'),decoded);
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
