Feature: Generate Interface
	In order to allow users to interact with my installation
	As a installation owner
	I want be able to generate interfaces with the TouchOSC editor

	Scenario: Upload Valid Interface
		Given I am on the upload interface page
		When I fill in "interface_name" with "A super cool interface"
		And I attach the "touchosc" file at "features/support/test.touchosc" to "interface_json"
		And I press "Upload"
		Then I should see "The interface was uploaded succesfully."