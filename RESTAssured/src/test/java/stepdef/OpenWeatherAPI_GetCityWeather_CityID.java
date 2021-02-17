package stepdef;

import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import domain.ProjectLogger;
import io.restassured.RestAssured;
import io.restassured.response.Response;
import io.restassured.response.ValidatableResponse;
import io.restassured.specification.RequestSpecification;
import static org.hamcrest.Matchers.equalTo;

public class OpenWeatherAPI_GetCityWeather_CityID
{
	RequestSpecification httpRequest = null;
	Response response = null;
	ValidatableResponse json = null;
	
	@Given("^Open Weather API$")
	public void open_Weather_API() throws Exception {
	    // Write code here that turns the phrase above into concrete actions
	    //throw new PendingException();
		System.out.println("");
		ProjectLogger.setLoggerConfiguration();
        ProjectLogger.logger.info("***** STARTING OPENWEATHER API GET CITY WEATHER WITH ID TEST *****");
		RestAssured.baseURI = "https://api.openweathermap.org";
    	httpRequest = RestAssured.given();
	}
	
	@When("^User retrieves city weather using city (\\d+)$")
	public void user_retrieves_city_weather_using_city(int arg1) throws Exception {
	    // Write code here that turns the phrase above into concrete actions
	    //throw new PendingException();
		response = httpRequest.when().
    			queryParam("id", arg1).
    			queryParam("appid","2043a4b6bf924c620ecbb8332f822583").
    			get("/data/2.5/weather");
	}
	
	@Then("^response contains weather of city ([^\\\"]*)$")
	public void response_contains_weather_their_respective_city_weather_data(String cityName) throws Exception {
	    // Write code here that turns the phrase above into concrete actions
	    // For automatic transformation, change DataTable to one of
	    // List<YourType>, List<List<E>>, List<Map<K,V>> or Map<K,V>.
	    // E,K,V must be a scalar (String, Integer, Date, enum etc)
	    //throw new PendingException();
//		Iterator<String> cityIterator = cityNames.iterator();
//		while(cityIterator.hasNext())
//			System.out.println("City Name from Datatable: "+cityIterator.next())
		
		//System.out.println("City Name from Datatable: "+cityName);
		json = response.then().assertThat().
				body("name", equalTo(cityName));
	}
	
	@Then("^response code equals (\\d+)$")
	public void response_code_equals(int arg1) throws Exception {
	    // Write code here that turns the phrase above into concrete actions
	    //throw new PendingException();
		json = response.then().assertThat().statusCode(200);
		ProjectLogger.logger.info("***** OPENWEATHER API GET CITY WEATHER WITH ID TEST "
    			+ "COMPLETED WITH STATUS CODE: " +response.getStatusCode()+" *****");
    	ProjectLogger.resetLoggerConfiguration();
    	System.out.println("");
	}
}
