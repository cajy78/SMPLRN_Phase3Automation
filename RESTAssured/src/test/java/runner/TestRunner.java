package runner;

import org.testng.annotations.Test;

import cucumber.api.CucumberOptions;
import cucumber.api.testng.AbstractTestNGCucumberTests;

@CucumberOptions(
		//monochrome = true,
		//plugin = {"pretty", "html:target/cucumber-html"},
		features = "src/test/java/features",
		glue = {"stepdef"}
		//tags ={"@OpenWeatherCityID"}
		)

@Test
public class TestRunner extends AbstractTestNGCucumberTests
{
}
