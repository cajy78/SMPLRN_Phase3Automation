@OpenWeatherCityID
Feature: Retrieve City weather data

  Scenario Outline: Get City Weather Data from OpenWeather API using City ID
    Given Open Weather API
    When User retrieves city weather using city <id>
    Then response contains weather of city <cityName>
    And response code equals 200

    Examples: 
      | id      | cityName |
      | 2172797 | Cairns   |
      | 1275339 | Mumbai   |
      | 2643743 | London   |
      | 5128638 | New York |
