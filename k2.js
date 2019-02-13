var express=require('express')
auth=express();
ws=express()
c4_a4=express()
c4=express()
a4=express()
jwt=express()

auth.listen(5001);
ws.listen(5002);
c4_a4.listen(5003);
c4.listen(5004);
a4.listen(5005);
jwt.listen(5006);


let jwt = require('jsonwebtoken');

function check_token(req, res, next) {
  let token = req.headers['x-access-token'] || req.headers['authorization']; 

  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
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
    return res.json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }
};

function init(eng, reply) {
  eng.get('*',(req,res)=>{
    res.send(reply)
  });
}

auth.get('/auth',check_token,(req,res)=>{
  if (!req.cookies.jwt) res.status(401); 
  res.send(200); 
});

a4.get('/a4', (req,res)=>{
  res.send({
})

init(auth,'auth')
init(ws,'ws')
init(c4_a4,'c4_a4')
init(c4,'c4')
init(a4,'a4')
init(jwt,'jwt')
