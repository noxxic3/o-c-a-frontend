// vue.config.js
module.exports = {
	publicPath: process.env.NODE_ENV === 'production'             // If the project is going to be exported in local server directory       
		? '/8_TFG/ObesityControlFrontApp/'                      
		: '/'                                                   
}
