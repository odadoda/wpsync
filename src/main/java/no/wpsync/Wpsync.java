package no.wpsync;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Created by oda on 02.10.2015.
 */

public class Wpsync {


    private String urlEndpoint;

    public void importFromXml(){
        System.out.println("WP PEWPEW");
    }

    public String getAllPosts(String urlEndpoint){

        String getPostsRestUri = "/posts";
        String restApiUrl = urlEndpoint + getPostsRestUri;
        String result = "";
        try {
            result = HttpConnection.sendGetRequest(restApiUrl);
        } catch (Exception e) {
            e.printStackTrace();
        }

        System.out.println(result);

        return result;
    }
}



class HttpConnection {

    static public String sendGetRequest(String url) throws Exception {
        return sendGetRequest( url, null);
    }

    static public String sendGetRequest(String url, String params) throws Exception {

        // create new URL object with the incoming url and query. To get searchblox to pass the data back as json I set the parameter "xml" to "json"
        URL obj;
        if(params != null) {
            obj = new URL(url + params);
        }else {
            obj = new URL(url);

        }

        HttpURLConnection connection = (HttpURLConnection) obj.openConnection();

        // take care of the response code (not using it atm)
        int responseCode = connection.getResponseCode();

        // Opening a stream
        BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));

        // Read input from stream
        String inputLine;
        StringBuffer resultText = new StringBuffer();

        while((inputLine = in.readLine()) != null){
            resultText.append(inputLine);
        }
        // return the result as text. This will be json format since the xml parameter in the request was set to json
        return resultText.toString();
    }
}