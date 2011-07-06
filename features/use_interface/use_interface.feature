Feature: Use Interface
	In order to interact with my a public installation
	As a visitor
	I want be able to send input to that installation trough an interface

	@javascript
	Scenario: Viewing an Interface
		Given I am on an interface page
		Then I should see a green button
		And I should see a red button

	@javascript
	Scenario: Voting Green
		Given I am on an interface page
		When I press "Green"
		Then I should see "Thanks for voting!"