package stepdef;

import static org.hamcrest.Matchers.equalTo;

import cucumber.api.java.en.And;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import domain.ProjectLogger;
import io.restassured.RestAssured;
import io.restassured.response.Response;
import io.restassured.response.ValidatableResponse;
import io.restassured.specification.RequestSpecification;

public class OpenWeatherAPI_GetCityWeather_ZipandCountry
{
	RequestSpecification httpRequest = null;
	Response response = null;
	ValidatableResponse json = null;
	private String countryCode;
	
    @Given("^User accesses Open Weather API$")
    public void user_accesses_open_weather_api() throws Throwable {
    	System.out.println("");
    	ProjectLogger.setLoggerConfiguration();
        ProjectLogger.logger.info("***** STARTING OPENWEATHER API GET CITY WEATHER WITH ZIP AND COUNTRY CODE TEST *****");
    	//throw new PendingException();
    	//api.openweathermap.org/data/2.5/weather?zip={zip code},{country code}&appid={API key}
    	RestAssured.baseURI = "https://api.openweathermap.org";
    	httpRequest = RestAssured.given();
    }

    @When("^User retrieves city weather using ([^\\\"]*) and ([^\\\"]*)$")
    public void user_retrieves_city_weather_using_and(String zip, String country) throws Throwable {
        //throw new PendingException();
    	//System.out.println("The values being passed are: "+zip + " "+country);
    	this.countryCode = country;
    	response = httpRequest.when().
    			queryParam("zip",zip+","+country).
    			queryParam("appid","2043a4b6bf924c620ecbb8332f822583").
    			get("/data/2.5/weather");
    }

    @Then("^response code is 200$")
    public void response_code_is_200() throws Throwable {
        //throw new PendingException();
    	json = response.then().assertThat().statusCode(200);
    }

    @And("^response contains city weather information$")
    public void response_contains_city_weather_information() throws Throwable {
        //throw new PendingException();
    	if(countryCode.equals("IN"))
    	{
    		json = response.then().assertThat().
    				body("name", equalTo("Wagle I.E.")).and().
    				body("sys.country", equalTo("IN"));
    	}
    	else if(countryCode.equals("GB"))
    	{
    		json = response.then().assertThat().
    				body("name", equalTo("Swindon")).and().
    				body("sys.country", equalTo("GB"));
    	}
    	ProjectLogger.logger.info("***** OPENWEATHER API GET CITY WEATHER WITH ZIP AND COUNTRY CODE TEST "
    			+ "COMPLETED WITH STATUS CODE: " +response.getStatusCode()+" *****");
    	ProjectLogger.resetLoggerConfiguration();
    	System.out.println("");
    }
}
