package stepdef;

import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import domain.ProjectLogger;
import io.restassured.RestAssured;
import io.restassured.response.Response;
import io.restassured.response.ValidatableResponse;
import io.restassured.specification.RequestSpecification;

public class REQRESDeleteUser
{
	RequestSpecification httpRequest = null;
	Response response = null;
	ValidatableResponse json = null;
	
	@Given("^REQRES API with Delete Operation$")
	public void reqres_API_with_Delete_Operation() throws Exception
	{
		//BasicConfigurator.configure();
		System.out.println("");
		ProjectLogger.setLoggerConfiguration();
		ProjectLogger.logger.info("***** Starting REQRES API DELETE OPERATION TEST *****");
		
	    // Write code here that turns the phrase above into concrete actions
	    //throw new PendingException();
		//logger.info("Entered DELETE Method Given Condition");
    	RestAssured.baseURI = "https://reqres.in";
    	httpRequest = RestAssured.given();
    	httpRequest.given();
	}

	@When("^user sends a DELETE request$")
	public void user_sends_a_DELETE_request() throws Exception {
	    // Write code here that turns the phrase above into concrete actions
	    //throw new PendingException();
		//logger.info("Entered Delete when Condition");
    	response = httpRequest.when().delete("/api/users/2");
	}

	@Then("^the response code received is (\\d+)$")
	public void the_response_code_received_is(int arg1) throws Exception {
	    // Write code here that turns the phrase above into concrete actions
	    //throw new PendingException();
		//logger.debug("Entered Delete Status Code check");
		json = response.then().assertThat().statusCode(arg1);
		ProjectLogger.logger.info("***** REQRES API DELETE OPERATION TEST COMPLETED WITH STATUS CODE: "+arg1+" *****");
		ProjectLogger.resetLoggerConfiguration();
		System.out.println("");
	}
}
