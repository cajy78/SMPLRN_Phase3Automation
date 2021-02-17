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

public class REQRESUpdateUser
{
	RequestSpecification httpRequest = null;
	Response response = null;
	ValidatableResponse json = null;
	
	@Given("^Update User API on Reqres$")
	public void update_User_API_on_Reqres() throws Exception {
		ProjectLogger.setLoggerConfiguration();
		System.out.println("");
		ProjectLogger.logger.info("***** STARTING REQRES API UPDATE USER OPERATION TEST *****");
	    // Write code here that turns the phrase above into concrete actions
	    // throw new PendingException();
		//System.out.println("Entered Update Given Condition");
    	RestAssured.baseURI = "https://reqres.in";
    	httpRequest = RestAssured.given();
    	httpRequest.given();
	}

	@When("^user sends updated user details to reqres users API$")
	public void user_sends_updated_user_details_to_reqres_users_API() throws Exception {
	    // Write code here that turns the phrase above into concrete actions
	    // throw new PendingException();
		//System.out.println("Entered Update when Condition");
		HashMap<String, String> parameters = new HashMap<String, String>();
		parameters.put("name", "morpheus");
		parameters.put("job", "zion resident");
		JSONObject requestParams = new JSONObject(parameters);
		httpRequest.header("Content-Type","application/json");
		response = httpRequest.when().body((requestParams).toJSONString()).put("/api/users/2");
	}

	@Then("^the status code in response is (\\d+)$")
	public void the_status_code_in_response_is(int arg1) throws Exception {
	    // Write code here that turns the phrase above into concrete actions
	    //throw new PendingException();
		//System.out.println("Entered Update Status Code check");
		json = response.then().assertThat().statusCode(200);
	}

	@Then("^response contains the updated user details$")
	public void response_contains_the_updated_user_details() throws Exception {
	    // Write code here that turns the phrase above into concrete actions
	    //throw new PendingException();
		//System.out.println("Entered Update response body check");
		json = response.then().assertThat().body("name", equalTo("morpheus")).and().
				body("job", equalTo("zion resident"));
		ProjectLogger.logger.info("***** REQRES API UPDATE OPERATION TEST COMPLETED WITH STATUS CODE: "+response.statusCode()+" *****");
		ProjectLogger.resetLoggerConfiguration();
		System.out.println("");
	}
}
