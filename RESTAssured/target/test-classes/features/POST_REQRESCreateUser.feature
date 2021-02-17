@CreateUser
Feature: Enable POST Operation on REQRES API

  Scenario Outline: User account creation Request to REQRES API
    Given POST API on Reqres
    When user posts <name> and <job> details to users API
    Then status code in response is 201
    And response contains the same user details

    Examples: 
      | name     | job    |
      | morpheus | leader |
