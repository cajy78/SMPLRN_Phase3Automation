package stepdef;

import java.util.List;

import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import domain.ProjectLogger;
import domain.UserDetails;
import io.restassured.RestAssured;
import io.restassured.response.Response;
import io.restassured.response.ValidatableResponse;
import io.restassured.specification.RequestSpecification;
import static org.hamcrest.Matchers.equalTo;

public class REQRESUserList
{	
	RequestSpecification httpRequest = null;
	Response response = null;
	ValidatableResponse json = null;
	
	@Given("^List of users in Page 2$")
	public void list_of_users_in_Page_2() throws Exception
	{
		System.out.println("");
		ProjectLogger.setLoggerConfiguration();
		ProjectLogger.logger.info("***** Starting REQRES API GET USER LIST OPERATION TEST *****");
		//System.out.println("Entered Given Condition");
    	RestAssured.baseURI = "https://reqres.in";
    	httpRequest = RestAssured.given();
    	httpRequest.given().
		param("page", 2);
	}

	@When("^user requests user list via GET request$")
	public void user_requests_user_list_via_GET_request() throws Exception
	{
    	//System.out.println("Entered when Condition");
    	response = httpRequest.when().get("/api/users");
	}

	@Then("^site should provide response code (\\d+)$")
	public void site_should_provide_response_code(int arg1) throws Exception
	{
	    //System.out.println("Entered then assert Condition");
    	json = response.then().assertThat().statusCode(200);
	}
	
	@Then("^response from Page should contain the following user details$")
	public void response_from_Page_should_contain_the_following_user_details(List<UserDetails> users) throws Exception
	{
	   // System.out.println("Number of users in the Page List :"+ users.size());
		for(int i = 0;i< users.size();i++)
		{
//			int page = response.jsonPath().get("page");
//			int userID = response.jsonPath().get("data["+i+"].id");
//			String userEmail = response.jsonPath().get("data["+i+"].email");
//			String userFirstName = response.jsonPath().get("data["+i+"].first_name");
//			String userLastName = response.jsonPath().get("data["+i+"].last_name");
//			System.out.println("Values from Response: Page Number: "+ page+ " ID: "+ userID+ " Email: "+ userEmail+" First Name: " + userFirstName + " Last Name: " + userLastName);
			UserDetails user = users.get(i);
//			System.out.println("Values from Data Table: id = " + user.id + " email = " + user.email + " first_name = " + user.firstname + " last_name = " + user.lastname);
			
			json = response.then().assertThat().body("page", equalTo(2)).and().
					body("per_page", equalTo(6)).and().
					body("total", equalTo(12)).and().
					body("data["+i+"].id", equalTo(Integer.parseInt(user.id))).and().
					body("data["+i+"].email", equalTo(user.email)).and().
					body("data["+i+"].first_name", equalTo(user.firstname)).and().
					body("data["+i+"].last_name", equalTo(user.lastname)).and();
			ProjectLogger.logger.info("***** REQRES API GET USER LIST OPERATION TEST COMPLETED WITH STATUS CODE: "+response.statusCode()+" *****");
			ProjectLogger.resetLoggerConfiguration();
			System.out.println("");
		}
	}
}
