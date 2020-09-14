import {register,login,addStory,getEmail,getStory,listStory} from '../controllers/controller'

export const routes=(app)=>{
	app.route('/register')
		.post(register);
	app.route('/login')
		.post(login);
	app.route('/new-story')
		.post(addStory);
	app.route('/get-story')
		.post(getEmail,getStory);
	app.route('/get-story-list')
		.get(listStory);
}	