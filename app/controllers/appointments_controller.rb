class AppointmentsController < ApplicationController

	def index
		@appointments = Appointment.all
		respond_to do |format|
			format.json {render json: @appointments}
		end
	end


	def show
		@appointment = Appointment.find(params["id"].to_i)
		respond_to do |format|
			format.json {render json: @appointment}
			format.html {render json: @appointment}
		end
	end

	def create
		@appointment = Appointment.create(appointment_params)
		render json: @appointment
	end

	def update
		@appointment = Appointment.find(params[:id].to_i)
		if @appointment.update(appointment_params)
			render json: @appointment
		else
			render status: 400, nothing: true
		end
	end

	def destroy
		Appointment.destroy(params[:id].to_i)
		render json: {}
	end


	private
	#sanitized params for rails 4
	def appointment_params
		params.require(:appointment).permit(:id, :title, :completed, :created_at, :updated_at)
	end
end