const app = require('./app');

app.listen(process.env.PORT, () => {
	console.log('App server is up');
});
