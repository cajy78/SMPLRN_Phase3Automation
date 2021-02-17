package stepdef;

import static org.hamcrest.Matchers.equalTo;

import java.util.HashMap;

import org.json.simple.JSONObject;

import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import domain.ProjectLogger;
import io.restassured.RestAssured;
import io.restassured.response.Response;
import io.restassured.response.ValidatableResponse;
import io.restassured.specification.RequestSpecification;

public class REQRESCreateUser
{
	RequestSpecification httpRequest = null;
	Response response = null;
	ValidatableResponse json = null;
	
	@Given("^POST API on Reqres$")
	public void post_API_on_Reqres() throws Exception
	{
		//BasicConfigurator.configure();
		System.out.println("");
		ProjectLogger.setLoggerConfiguration();
		ProjectLogger.logger.info("***** STARTING REQRES API CREATE USER OPERATION TEST *****");
    	RestAssured.baseURI = "https://reqres.in";
    	httpRequest = RestAssured.given();
    	httpRequest.given();
	}

	@When("^user posts morpheus and leader details to users API$")
	public void user_posts_morpheus_and_leader_details_to_users_API() throws Exception {
		System.out.println("Entered Create when Condition");
		HashMap<String, String> parameters = new HashMap<String, String>();
		parameters.put("name", "morpheus");
		parameters.put("job", "leader");
		JSONObject requestParams = new JSONObject(parameters);
		httpRequest.header("Content-Type","application/json");
		response = httpRequest.when().body((requestParams).toJSONString()).post("/api/users");
	}

	@Then("^status code in response is (\\d+)$")
	public void status_code_in_response_is(int arg1) throws Exception {
		System.out.println("Entered Create Status Code check");
		json = response.then().assertThat().statusCode(201);
	}

	@Then("^response contains the same user details$")
	public void response_contains_the_same_user_details() throws Exception {
	    // Write code here that turns the phrase above into concrete actions
	    //throw new PendingException();
		System.out.println("Entered Create response body check");
		json = response.then().assertThat().body("name", equalTo("morpheus")).and().
				body("job", equalTo("leader"));
		ProjectLogger.logger.info("***** REQRES API CREATE OPERATION TEST COMPLETED WITH STATUS CODE: "+response.statusCode()+" *****");
		ProjectLogger.resetLoggerConfiguration();
		System.out.println("");
	}
}
