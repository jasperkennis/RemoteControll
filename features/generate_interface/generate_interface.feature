Feature: Generate Interface
	In order to allow users to interact with my installation
	As a installation owner
	I want be able to generate interfaces with the TouchOSC editor

	Scenario: Upload valid file
		Given I am on upload-interface
		When I upload the TouchOSC file
		Then I should see a message confirming the upload was successfully transfered