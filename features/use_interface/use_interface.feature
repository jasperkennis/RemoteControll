Feature: Use Interface
	In order to interact with my a public installation
	As a visitor
	I want be able to send input to that installation trough an interface

	Scenario: Voting Green
		Given I am on an interface page
		And I press "Green"
		Then I should see "Thanks for voting."