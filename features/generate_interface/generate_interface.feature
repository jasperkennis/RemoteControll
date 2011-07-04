Feature: Generate Interface
	In order to allow users to interact with my installation
	As a installation owner
	I want be able to generate interfaces with the TouchOSC editor

	Scenario: Upload valid file
		Given I am on the upload points page
		When I fill in "file" with "/usr/whatever"	
		And I press "Upload"
		Then I should see "The interface was uploaded succesfully."