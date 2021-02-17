package domain;

import org.apache.log4j.BasicConfigurator;
import org.apache.log4j.Logger;

public class ProjectLogger
{
	public static final Logger logger =  Logger.getLogger(ProjectLogger.class);
	
	public static void setLoggerConfiguration()
	{
		BasicConfigurator.configure();
	}
	
	public static void resetLoggerConfiguration()
	{
		BasicConfigurator.resetConfiguration();
	}
}
