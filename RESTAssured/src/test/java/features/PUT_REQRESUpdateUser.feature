@UpdateUserPutMethod
Feature: Enable PUT Operation on REQRES API

  Scenario: User account update Request to REQRES API
    Given Update User API on Reqres
    When user sends updated user details to reqres users API
    Then the status code in response is 200
    And response contains the updated user details
