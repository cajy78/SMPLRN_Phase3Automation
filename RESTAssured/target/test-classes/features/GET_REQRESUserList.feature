@RetrieveUserListGetMethod
Feature: Enable GET operation on REQRES API

  Scenario: User gets user-list from REQRES
    Given List of users in Page 2
    When user requests user list via GET request
    Then site should provide response code 200
    And response from Page should contain the following user details
      | id | email                      | firstname | lastname |
      |  7 | michael.lawson@reqres.in   | Michael   | Lawson   |
      |  8 | lindsay.ferguson@reqres.in | Lindsay   | Ferguson |
