@DeleteUser
Feature: Enable Delete operation on REQRES API

  Scenario: User performs Delete Operation
    Given REQRES API with Delete Operation
    When user sends a DELETE request
    Then the response code received is 204
