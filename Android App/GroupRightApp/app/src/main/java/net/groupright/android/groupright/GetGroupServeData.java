package net.groupright.android.groupright;

import android.content.Intent;
import android.os.AsyncTask;
import android.widget.Toast;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;

import java.util.ArrayList;
import java.util.List;

/**
 * This is a really screwy function
 * The goal is to get all the user data from GroupServe into android
 * We recieve the email and access code via the params string array
 * We then have to instantiate new intances of strings, and then call toString
 *      to get the correct value that needs to be passed to the server
 * From there, all the data we need is put in groupData and returned
 */
public class GetGroupServeData extends AsyncTask<String, Void, String> {

    static String groupData = "Some data";

    @Override
    protected String doInBackground(String... params) {

        String URL = "https://www.groupright.net/dev/groupserve.php";
        System.out.println("Getting Group Data");

        try {
            // 1. create HttpClient
            HttpClient client = new DefaultHttpClient();
            // 2. make Post request to given URL
            HttpPost post = new HttpPost(URL);

            // 3. load in the data from the view
            List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>();
            nameValuePairs.add(new BasicNameValuePair("function", "get_user_info"));
            nameValuePairs.add(new BasicNameValuePair("email", params[0].trim()));
            nameValuePairs.add(new BasicNameValuePair("ac", params[1].trim()));
            //System.out.println(params[0].trim());
            //System.out.println(params[1].trim());

            // 4. make the call to the server
            post.setEntity(new UrlEncodedFormEntity(nameValuePairs, "UTF-8"));

            // 5. get the response from the server
            HttpResponse response = client.execute(post);

            // 6. check the response
            if(response.getStatusLine().getStatusCode()!= 200)
                return "badCookie";

            // 7. get needed info and return it to the view controller
            if(response!=null){
                groupData = EntityUtils.toString(response.getEntity());
                //System.out.println("response: " + groupData);
                return groupData;
            }

        } catch(Exception e) {
            e.printStackTrace();
            System.out.println("Error - Cannot Estabilish Connection");
        }

        return groupData;
    }
}
