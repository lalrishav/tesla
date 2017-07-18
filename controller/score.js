const mongoose = require('mongoose')
var async = require('async')
const questionModel = mongoose.model('Question')
const contestModel = mongoose.model('Contest')
const scoreModel = mongoose.model('Score')
exports.calculateScore = function(req,callback){
	//console.log(req.body)
	var len = Object.keys(req.body).length
	var tostr = Object.keys(req.body)
		items = []

		for(var i=0;i<len-1;i++){
			items.push(tostr[i])
		}
		var score = 0
		async.each(items,function(item,callback){
			questionModel.findOne({"_id":item},function(err,data){
				if(err)
					throw err
				else{
					console.log("------------------------")
					console.log(data.answer)
					console.log(req["body"][item])
					console.log("@@@@@@@@@@@@@@@@@@@@@@@@@")
					if(data.answer == req["body"][item])
						score = score + 3

				}
				callback()
			})
		},
			function(){
				let newScore = new scoreModel({
					'user' 		    : req.user._id,
					'contest'	    : req.body.cid,
					'score'		    : score,
					'submitTime'    : new Date(),
					
				}).save(function(err,data){
					if(err)
						throw err
					else
						console.log("inserted")
				})
			}
		)


	//}
}

exports.checkSubmission = function(user,contest,callback){
	let searchParameter = {}
	searchParameter.user = user 
	searchParameter.contest = contest 
	//console.log(searchParameter)
	scoreModel.find(searchParameter,function(err,found){
		if(err){
			console.log(err);
			console.log({"res":false})
		}
		else{
			//console.log(found.length)
			callback({"total":found.length,"res":true})
		}
	})
}

exports.showScore = function(key,callback){
	var cid = key
	searchParameter = {}
	searchParameter.contest = cid
	scoreModel.find(searchParameter,(err,data)=>{
	}).populate("user").populate("contest").exec(function(err,found){
		if(err){
			console.log(err);
			callback({"res":false})
		}
		else
			callback({'data':found,"res":true})
	})

}