@OpenWeather
Feature: Enable retrieving City Weather by Zip and Country Code

  Scenario Outline: Retrieve City weather from Open Weather API using Zip and Country Code
    Given User accesses Open Weather API
    When User retrieves city weather using <zip> and <country>
    Then response code is 200
    And response contains city weather information

    Examples: 
      | zip    | country |
      | 400604 | IN      |
      | SN1    | GB      |
