import java.net.URL;
import java.net.HttpURLConnection;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.lang.Exception;
import java.net.URLEncoder;

public class WeatherAPI {
    static String apiURL = "http://api.openweathermap.org/data/2.5/weather?zip=";
    static String appKey = "";
    public static void main(String[] args) {
        try {
            weatherRequest("02703");
        }
        catch(Exception e) {
            System.out.println(e.toString());
        }
    }

    public static void weatherRequest(String zip) throws Exception{
        String reqURL = apiURL + zip + "&appid=" + appKey;
        System.out.println(reqURL.toString());
        URL url = new URL(reqURL);
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setRequestMethod("GET");


        int responseCode = con.getResponseCode();
		System.out.println("GET Response Code: " + responseCode);
		if (responseCode == HttpURLConnection.HTTP_OK) { // success
			BufferedReader in = new BufferedReader(new InputStreamReader(
					con.getInputStream()));
			String inputLine;
			StringBuffer response = new StringBuffer();

			while ((inputLine = in.readLine()) != null) {
				response.append(inputLine);
			}
            in.close();
            //System.out.println(response.toString());
            return response.toString();
        } 
        else {
			System.out.println("GET request ERROR");
        }
    }
}