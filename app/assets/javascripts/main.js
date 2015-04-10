console.log("app js linked!")


//appointment model class, to generate single instances of a model

var Appointment = Backbone.Model.extend({
	toggleStatus: function(){
		if(this.get('completed') === true){
			this.set({completed: false})
		}else{
			this.set({completed: true})
		}
		this.save()
	},

	urlRoot: '/appointments',

	defaults: function() {
	    return {
	      title: 'Checkup',
	      completed: false
    }
}
});

//create an appointment view class, to generate views, with data for the views provided by models

var AppointmentView = Backbone.View.extend({
	//initialize function, called whenver a new instance of the appointment view class is created
	initialize: function(){
		this.model.on('change', this.render, this);
		this.model.on('destroy', this.remove, this);
		this.model.on('hide', this.remove, this);
	},
	//set events for views
	events: {
		"change input": "toggleStatus"
	},
	toggleStatus: function(){
		this.model.toggleStatus();
	},
	//set html defaults
	tagName: 'article',
	id: 'appointment-view',
	className: 'appointment',
	//use underscore to make a simple template function, and add a checkbox
	template: _.template('<h3 class="<% if(completed === true) print("complete")%>">' + 
		'<input type="checkbox"' +
		'<% if(completed === true) print("checked")%>/>' +

		'<%= title %> </h3>' +
		'<a href=<%="#appointments/" + id %>> single view </a>'
		),
	//define a render function that produces html when called, and assigns that html to the view instance's top level element property
	render: function(){
		//attrs variable from model converted to json object
		var attrs = this.model.toJSON()
		//html variable is result of using template function defined earlier
		var html = this.template(attrs)		
		//use jquery to assign html value of top level element
		this.$el.html(html)
		//append to dom automatically each time function is called
		// $('body').append(this.el)
	},
	//remove, a function to remove the element from the dom if it's destroyed
	remove: function(){
		this.$el.remove();
	}
});



//create a class to manage a collection of appointments

var AppointmentList = Backbone.Collection.extend({
	//tell the collection what kind of model to expect
	initialize: function(){
		this.on('remove', this.hideModel);
	},
	hideModel: function(model){
		model.trigger('hide')
	},
	model: Appointment,
	url: '/appointments',
})


//create a CollectionView class

var AppointmentListView = Backbone.View.extend({
	initialize: function(){
		//this is listening on the collection! not the collectin view!
		this.collection.on('add',this.addOne,this);
		//reset is called by default each time we fetch
		this.collection.on('reset',this.addAll,this);
	},
	//an addOne function we can call each time we want to render the html for a collection
	addOne: function(appt){
		var newView = new AppointmentView({model: appt})
		newView.render()
		var html = newView.el;
		this.$el.append(html)
		$('#app').append(this.$el)
	},
	addAll: function(){
		//when we render, we call addOne on each member of the collection, passing the correct context each time
		this.collection.forEach(this.addOne,this);
	},
	render: function(){
		this.addAll();
	},
})

//create a router



// var AppRouter = Backbone.Router.extend({

// 	// routes: {"appointments/:id": "show"},
// 	routes: {'': 'index', "appointments/:id": "show"},

// 	show: function(id){
// 	  var appointment = new Appointment({id: id});
// 	  var appointmentView = new AppointmentView({model: appointment});
// 	  appointmentView.render(); 
// 	  $('#app').html(appointmentView.el);
// 	  appointment.fetch();
// 	},
// 	index: function(){
//     // var appointmentsView = new AppointmentListView({collection: this.appointmentList});
//     // appointmentsView.render();
//     // $('#app').html(appointmentsView.el);
//     // this.appointmentList.fetch();
//   },

// })


// var router = new AppRouter();


var AptApp = new(Backbone.Router.extend({
	routes: {'': 'index', "appointments/:id": "show"},
	events: {'durr':'addOne'},
	initialize: function(){
		this.apptList = new AppointmentList();
		this.apptListView = new AppointmentListView({collection: this.apptList})
		$("#app").append(this.apptListView.el);
	},
	start: function(){
		Backbone.history.start()
	},
	index: function(){
		this.apptList.fetch()
	},
	show: function(id){
		this.focus(id)
	},

	focus: function(id){	
	  var appointment = new Appointment({id: id});
	  var appointmentView = new AppointmentView({model: appointment});
	  appointmentView.render(); 
	  $('#app').html(appointmentView.el);
	  appointment.fetch();}
	

}))

$(function(){ AptApp.start()
//TODO take user input. create model. add model to collection. render views.
	button = $("button");
	input = $("input");
	button.on('click', function(e){
		var newApt = new Appointment({title: input.val()})
		//save model to db?
		newApt.save();
		AptApp.apptList.add(newApt)
		AptApp.apptList.trigger("durr")
		// var newView = new AppointmentView({model: newApt});
	})
})






// aptList.fetch()

// aptList.on('add', added)
// aptList.on('remove', removed)

// function added(model){
// 	alert(model.get('title') + 'added!')
// }

// function removed(model){
// 	alert(model.get('title') + ' removed!')
// }







