class InterfacesController < ApplicationController
	def new
		@interface = Interface.new

		respond_to do |format|
			format.html
			format.xml  { render :xml => @interface }
		end
	end

	def create

    # Write the received file and save it to tmp/uploads
		name =  params[:interface]["json"].original_filename.gsub('touchosc','zip')
		directory = "tmp/uploads"
		path = File.join(Rails.root, directory, name)
		File.open(path, "wb") { |f| f.write(params[:interface]["json"].read) }

    #Unzip the file to its own name, minus .zip
		unzip_file(path,path.gsub('.zip',''))
    
    # Convert all children to json strings, and push them into the master json string
    @json = '{"interfaces":['
		Dir[File.join(path.gsub('.zip',''), "*.xml")].each{ |l|
			@file = get_file_as_string(l)
			@json << Hash.from_xml(@file).to_json.gsub(/\n/, '') << ','
		}
		@json = @json.chop
		@json << ']}'

    @interface = Interface.new(params[:interface].merge(:json => @json))

		respond_to do |format|
			if @interface.save
				format.html { redirect_to(@interface,
                      :notice => 'The interface was uploaded succesfully.') }
				format.xml  { render :xml => @interface,
                      :status => :created, :location => @interface }
			else
				format.html { render :action => "new" }
				format.xml  { render :xml => @interface.errors,
                      :status => :unprocessable_entity }
			end
		end
	end

	def show
    @interface = Interface.find(params[:id])
   
    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @interface }
    end
end

	def unzip_file (file, destination)
		Zip::ZipFile.open(file) { |zip_file|
			zip_file.each { |f|
				f_path=File.join(destination, f.name)
				FileUtils.mkdir_p(File.dirname(f_path))
				zip_file.extract(f, f_path) unless File.exist?(f_path)
			}
		}
	end

	def get_file_as_string(filename)
		data = ''
		f = File.open(filename, "r")
		f.each_line do |line|
			data += line
		end
		return data
	end
end