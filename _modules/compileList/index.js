const compile = require('../compileSingle');
const xcon = require('x-con')
module.exports = (arr, cb) => {
	var done = 0;
	var errors = [];

	var runWhenDone = ()=>{
		if(done + errors.length === arr.length){
			if(errors.length){
				for (i=0; i<errors.length; i++) {
					xcon.post([
						{
							style: [
								'#e80000',
								'bold',
								'bg #000'
							],
							str: errors[i]
						}
					]);
				}
			}
			else{
				cb();
			}

		}

	};

	var comp = (file) => {
		setTimeout(function() {
			compile(file, (file) => {
				done++;

					xcon.post([
						{
							style: [
								'#27cf2f',
								'bold',
								'bg #000'

							],
							str: file
						},
						{
							style: [],
							str: '  =>  '
						},
						{
							style: [
								'#27cf2f',
								'bold',
								'bg #000'

							],
							str: 'css'
						},

					]);
				runWhenDone();
			}, (err)=>{
				errors.push(err);
				runWhenDone();
			});
		}, 0);
	};
	for (i = 0; i < arr.length; i++) {
		comp(arr[i]);
		//TODO: add rety or more detail on failure.
	}
};
