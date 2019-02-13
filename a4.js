chalk=require('chalk')
bgRed=chalk.bgRed;
bgYellow=chalk.bgYellow;

uuid=require('uuid');
kv={}

module.exports=(auth,display)=>{
	a4.get('/a4/login', function(req,res){
		res.send(`
			<form method="post">
				<label>user</label><input name="user" id="user" value="user">
				<label>pass</label><input name="pass" id="pass" value="pass">
				<input type='submit'>
			</form>
		`)	
	});
	
	a4.get('/a4/validate_token', (req,res)=>{
		log(bgYellow('kv'), kv);
		var ret=kv[req.query.a4_token];
		log(bgYellow('token', req.query.a4_token), ret); 

		if (!ret) return res.send('fake token or token is expired');
		return res.send(ret);	
	});

	var minutes=60*1000;

	a4.post('/a4/login', (req,res)=>{
		var token=uuid()
		log(bgRed('token is generated', token));

		kv[token]={
			user:req.body.user, 
			pass:req.body.pass, 
			login_time:new Date(),
		};

		res.cookie('a4_token', token, { maxAge: 3*minutes, httpOnly: true })
		res.redirect(url=req.query.forward_url+'?forward_url='+req.query.real_url);
		log(bgYellow('login ok then go url', url));
		//res.send('login ok');//{status:'posted', body:req.body, query:req.query});
	});
}
