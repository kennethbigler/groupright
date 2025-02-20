package net.groupright.android.groupright;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;
import android.support.v4.app.FragmentTransaction;
import android.support.v4.app.ListFragment;
import android.support.v4.view.ViewPager;
import android.support.v7.app.ActionBar;
import android.support.v7.app.ActionBarActivity;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ExpandableListView;
import android.widget.ListView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.ExecutionException;


public class MainActivity extends ActionBarActivity implements ActionBar.TabListener {

    /**
     * The {@link android.support.v4.view.PagerAdapter} that will provide
     * fragments for each of the sections. We use a
     * {@link FragmentPagerAdapter} derivative, which will keep every
     * loaded fragment in memory. If this becomes too memory intensive, it
     * may be best to switch to a
     * {@link android.support.v4.app.FragmentStatePagerAdapter}.
     */
    SectionsPagerAdapter mSectionsPagerAdapter;

    /**
     * The {@link ViewPager} that will host the section contents.
     */
    ViewPager mViewPager;
    // Adding items to arrayList
    static List<String> updatesList = new ArrayList<String>();
    // Lists used for tasks
    static ArrayList<String> groupItem = new ArrayList<String>();
    static HashMap<String, List<String>> childItem = new HashMap<String, List<String>>();
    //static List<String> eventsList = new ArrayList<String>();
    String accessCode = "";
    String grEmail = "";
    String groupData = "";
    static JSONObject updateMap = new JSONObject();
    static JSONObject eventMap = new JSONObject();
    static JSONObject taskMap = new JSONObject();
    static JSONArray eventsList = new JSONArray();
    static JSONArray tasksList = new JSONArray();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        SharedPreferences shared = getSharedPreferences("shared", MODE_PRIVATE);
        if(!shared.contains("email") || !shared.contains("ac")) {
            // Launch the login activity as the first activity
            Intent loginIntent = new Intent(MainActivity.this, LoginActivity.class);
            MainActivity.this.startActivityForResult(loginIntent, 1);
        } else {
            grEmail = shared.getString("email", "");
            accessCode = shared.getString("ac", "");
        }

        // Set up the action bar.
        final ActionBar actionBar = getSupportActionBar();
        actionBar.setNavigationMode(ActionBar.NAVIGATION_MODE_TABS);

        // Create the adapter that will return a fragment for each of the three
        // primary sections of the activity.
        mSectionsPagerAdapter = new SectionsPagerAdapter(getSupportFragmentManager());

        // Set up the ViewPager with the sections adapter.
        mViewPager = (ViewPager) findViewById(R.id.pager);
        mViewPager.setAdapter(mSectionsPagerAdapter);

        // When swiping between different sections, select the corresponding
        // tab. We can also use ActionBar.Tab#select() to do this if we have
        // a reference to the Tab.
        mViewPager.setOnPageChangeListener(new ViewPager.SimpleOnPageChangeListener() {
            @Override
            public void onPageSelected(int position) {
                actionBar.setSelectedNavigationItem(position);
            }
        });

        // For each of the sections in the app, add a tab to the action bar.
        for (int i = 0; i < mSectionsPagerAdapter.getCount(); i++) {
            // Create a tab with text corresponding to the page title defined by
            // the adapter. Also specify this Activity object, which implements
            // the TabListener interface, as the callback (listener) for when
            // this tab is selected.
            actionBar.addTab(
                    actionBar.newTab()
                            .setText(mSectionsPagerAdapter.getPageTitle(i))
                            .setTabListener(this));
        }

        loadData();
    }

    /**
     * This is where all the data will be retrieved
     * it will then be loaded into the various data arrays
     *
     * get_user_info
     * Input
     * {
     * "function":"get_user_info"
     * "email":"[enter in email here]"
     * "ac":"<access_code>"
     * }
     * Output
     * events: Array[i]
     * first_name: String
     * last_name: String
     * memberships: Array[i]
     * photo_url: String
     * tasks: Array[i]
     * updates: Array[i]
     *
     * put Events Array into the events fragment
     * put Tasks Array into tasks fragment
     * put Updates Array into updates fragment
     *
     * options for the future
     *      names into action bar?
     *      photo into action bar?
     *      list of groups?
     */
    private void loadData() {

        /* This code is better practice than current method
         * Consider changing to this once more of the application is done
        Thread t = new Thread() {
            @Override
            public void run() {
                String URL = "https://www.groupright.net/dev/groupserve.php";
                System.out.println("Getting all the group data");

                Looper.prepare();

                try {
                    // 1. create HttpClient
                    HttpClient client = new DefaultHttpClient();
                    // 2. make Post request to given URL
                    HttpPost post = new HttpPost(URL);

                    // 4. load in the data from the view
                    List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>();
                    nameValuePairs.add(new BasicNameValuePair("function", "get_user_info"));
                    nameValuePairs.add(new BasicNameValuePair("email", grEmail.trim()));
                    nameValuePairs.add(new BasicNameValuePair("ac", accessCode.trim()));

                    // 5. make the call to the server
                    //post.setEntity(new UrlEncodedFormEntity(nameValuePairs));
                    post.setEntity(new UrlEncodedFormEntity(nameValuePairs, "UTF-8"));

                    // 6. get the response from the server
                    HttpResponse response = client.execute(post);

                    // 7. check the response
                    if(response!=null){
                        groupData = EntityUtils.toString(response.getEntity());
                        System.out.println("response: " + groupData);
                    }

                } catch(Exception e) {
                    e.printStackTrace();
                    System.out.println("Error - Cannot Estabilish Connection");
                }

                Looper.loop();
            }
        };

        t.start();*/

        /* {
            "first_name":"K",
            "last_name":"B",
            "photo_url":null,
            "memberships":[
                {
                    "group_name":"",
                    "group_color":"#",
                    "group_id":"",
                    "role":"leader",
                    "members":[...]
                },
                {
                    ...
                }
            ],
            "tasks":[
                {
                    "task_uid":"38",
                    "task_title":"Fix messages",
                    "task_description":"soon mandatory",
                    "group_id":"35",
                    "creator":"a@s",
                    "is_completed":"0",
                    "is_personal":"0",
                    "link_type":null,
                    "link_id":null
                },
                {
                    ...
                }
            ],
            "events":[
                {
                    "event_uid":"49",
                    "name":"Party",
                    "description":"",
                    "group_id":"35",
                    "creator":"z@g",
                    "start_time":"2015-04-12 21:00:00",
                    "end_time":"2015-04-12 22:45:00"
                },
                {
                    ...
                }
            ],
            "updates":[
                {
                    "update_uid":"59",
                    "email":"z@g",
                    "description":"created event \"Party\"",
                    "group_id":"35",
                    "timestamp":"2015-04-10 19:58:01",
                    "link_type":"",
                    "link_id":"0"
                },
                {
                    ...
                }
            ]
        } */

        GetGroupServeData git = new GetGroupServeData();
        try {
            groupData = git.execute(grEmail, accessCode).get();
            if (groupData == "badCookie") {
                // notify the user of bad cookie
                Toast toast = Toast.makeText(getApplicationContext(), "Session Expired, Sign in again.", Toast.LENGTH_LONG);
                toast.show();
                // launch sign in intent
                //Intent loginIntent = new Intent(MainActivity.this, LoginActivity.class);
                //MainActivity.this.startActivityForResult(loginIntent, 1);
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }

        //System.out.println(groupData);

        try {
            JSONObject json = new JSONObject(groupData);
            JSONArray jUpdates = json.getJSONArray("updates");
            //JSONArray jEvents = json.getJSONArray("events");
            eventsList = json.getJSONArray("events");
            tasksList = json.getJSONArray("tasks");
            JSONArray jMem = json.getJSONArray("memberships");
            String thisGroup;
            String thisColor;
            JSONObject colorMap = new JSONObject();
            String group;

            for (int i = 0; i < jMem.length(); i ++) {
                thisGroup = jMem.getJSONObject(i).getString("group_id");
                thisColor = jMem.getJSONObject(i).getString("group_color");
                colorMap.put(thisGroup, thisColor);
            }

            //System.out.println(jUpdates.getJSONObject(1).getString("description"));

            for (int i = 0; i < jUpdates.length(); i ++) {
                updatesList.add(jUpdates.getJSONObject(i).getString("description"));
                group = jUpdates.getJSONObject(i).getString("group_id");
                updateMap.put(Integer.toString(i), colorMap.getString(group));
                group = jUpdates.getJSONObject(i).getString("link_type");
                updateMap.put("t" + Integer.toString(i), group);
                //System.out.println(jUpdates.getJSONObject(i).getString("description"));
            }

            for (int i = 0; i < eventsList.length(); i ++) {
                group = eventsList.getJSONObject(i).getString("group_id");
                eventMap.put(Integer.toString(i), colorMap.getString(group));
            }

            for (int i = 0; i < tasksList.length(); i ++) {
                //groupItem.add(tasksList.getJSONObject(i).getString("task_title"));
                group = tasksList.getJSONObject(i).getString("group_id");
                taskMap.put(Integer.toString(i), colorMap.getString(group));
            }

            /*for (int i = 0; i < jTasks.length(); i ++) {
                jTasks.getJSONObject(i).getString("creator");
                List<String> child = new ArrayList<>();
                child.add("Created By: " + jTasks.getJSONObject(i).getString("creator"));
                child.add(jTasks.getJSONObject(i).getString("task_description"));
                childItem.put(groupItem.get(i), child);
            }*/

        } catch (Throwable t) {
            System.out.println("Could not parse string");
        }

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        // Check which request it is that we're responding to
        if (requestCode == 1) {
            // Make sure the request was successful
            if (resultCode == RESULT_OK) {
                // Get the access code from the Login call
                // will be returned as result
                accessCode = data.getStringExtra("result");
                grEmail = data.getStringExtra("email");
                //Intent i = new Intent(getBaseContext(), MainActivity.class);
                //i.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                //startActivity(i);
                //loadData();
            }
            if (resultCode == RESULT_CANCELED) {
                // code if there is no result, I do not know what to do here
                Toast toast = Toast.makeText(getApplicationContext(),
                        "You need to login or register at www.groupright.net",
                        Toast.LENGTH_SHORT);
                toast.show();
            }
        }
    }



    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        // TODO: Implement a logout functionality

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            Intent loginIntent = new Intent(MainActivity.this, LoginActivity.class);
            MainActivity.this.startActivityForResult(loginIntent, 1);
            return true;
        }

        return super.onOptionsItemSelected(item);
    }



    @Override
    public void onTabSelected(ActionBar.Tab tab, FragmentTransaction fragmentTransaction) {
        // When the given tab is selected, switch to the corresponding page in
        // the ViewPager.
        mViewPager.setCurrentItem(tab.getPosition());
    }

    @Override
    public void onTabUnselected(ActionBar.Tab tab, FragmentTransaction fragmentTransaction) {
        // do nothing
    }

    @Override
    public void onTabReselected(ActionBar.Tab tab, FragmentTransaction fragmentTransaction) {
        // should probably call appropriate function to update the view
    }

    /**
     * A {@link FragmentPagerAdapter} that returns a fragment corresponding to
     * one of the sections/tabs/pages.
     */
    public class SectionsPagerAdapter extends FragmentPagerAdapter {

        public SectionsPagerAdapter(FragmentManager fm) {
            super(fm);
        }

        @Override
        public Fragment getItem(int position) {
            // getItem is called to instantiate the fragment for the given page.
            // If error, Return a PlaceholderFragment (defined as a static inner class below).
            // otherwise loads all fragments
            if (position == 0) {
                //Toast toast = Toast.makeText(getApplicationContext(), "updates fragment loaded", Toast.LENGTH_SHORT);
                //toast.show();
                return UpdatesFragment.newInstance(position + 1);
            } else if (position == 1) {
                //Toast toast = Toast.makeText(getApplicationContext(), "tasks fragment loaded", Toast.LENGTH_SHORT);
                //toast.show();
                return TasksFragment.newInstance(position + 1);
            } else if (position == 2) {
                //Toast toast = Toast.makeText(getApplicationContext(), "events fragment loaded", Toast.LENGTH_SHORT);
                //toast.show();
                return EventsFragment.newInstance(position + 1);
            } else {
                //Toast toast = Toast.makeText(getApplicationContext(), "there was an error", Toast.LENGTH_SHORT);
                //toast.show();
                return PlaceholderFragment.newInstance(position + 1);
            }
        }

        @Override
        public int getCount() {
            // Show 3 total pages.
            return 3;
        }

        @Override
        public CharSequence getPageTitle(int position) {
            Locale l = Locale.getDefault();
            switch (position) {
                case 0:
                    return getString(R.string.title_section1).toUpperCase(l);
                case 1:
                    return getString(R.string.title_section2).toUpperCase(l);
                case 2:
                    return getString(R.string.title_section3).toUpperCase(l);
            }
            return null;
        }
    }

    /**
     * A placeholder fragment containing a simple view.
     */
    public static class PlaceholderFragment extends Fragment {
        /**
         * The fragment argument representing the section number for this
         * fragment.
         */
        private static final String ARG_SECTION_NUMBER = "section_number";

        /**
         * Returns a new instance of this fragment for the given section
         * number.
         */
        public static PlaceholderFragment newInstance(int sectionNumber) {
            PlaceholderFragment fragment = new PlaceholderFragment();
            Bundle args = new Bundle();
            args.putInt(ARG_SECTION_NUMBER, sectionNumber);
            fragment.setArguments(args);
            return fragment;
        }

        public PlaceholderFragment() {
        }

        @Override
        public View onCreateView(LayoutInflater inflater, ViewGroup container,
                                 Bundle savedInstanceState) {
            View rootView = inflater.inflate(R.layout.fragment_main, container, false);
            return rootView;
        }
    }

    public static class UpdatesFragment extends Fragment {
        /**
         * The fragment argument representing the section number for this
         * fragment.
         */
        private static final String ARG_SECTION_NUMBER = "section_one";

        /**
         * Returns a new instance of this fragment for the given section
         * number.
         */
        public static UpdatesFragment newInstance(int sectionNumber) {
            UpdatesFragment fragment = new UpdatesFragment();
            Bundle args = new Bundle();
            args.putInt(ARG_SECTION_NUMBER, sectionNumber);
            fragment.setArguments(args);
            return fragment;
        }

        public UpdatesFragment() {
        }

        @Override
        public View onCreateView(LayoutInflater inflater, ViewGroup container,
                                 Bundle savedInstanceState) {
            View rootView = inflater.inflate(R.layout.fragment_main, container, false);
            loadList(rootView);
            return rootView;
        }

        private void loadList(View rootView) {
            // put list item array on the screen
            //ListView lv = (ListView) rootView.findViewById(R.id.listView);
            //lv.setAdapter(new ArrayAdapter<String>(getActivity(), android.R.layout.simple_list_item_1, updatesList));

            ListView lv = (ListView) rootView.findViewById(R.id.listView);
            // get data from the table by the ListAdapter
            UpdatesArrayAdapter customAdapter = new UpdatesArrayAdapter(getActivity(), updatesList, updateMap);

            lv.setAdapter(customAdapter);

            // what happens on item click
            lv.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                @Override
                public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                    System.out.println(position + 1);
                }
            });
        }
    }

    public static class TasksFragment extends Fragment {

        ExpandableListView elv;
        TaskAdapter mTaskAdapter;

        /**
         * The fragment argument representing the section number for this fragment.
         */
        private static final String ARG_SECTION_NUMBER = "section_two";

        /**
         * Returns a new instance of this fragment for the given section number.
         */
        public static TasksFragment newInstance(int sectionNumber) {
            TasksFragment fragment = new TasksFragment();
            Bundle args = new Bundle();
            args.putInt(ARG_SECTION_NUMBER, sectionNumber);
            fragment.setArguments(args);
            return fragment;
        }

        public TasksFragment() {
        }

        @Override
        public View onCreateView(LayoutInflater inflater, ViewGroup container,
                                 Bundle savedInstanceState) {
            View rootView = inflater.inflate(R.layout.fragment_main, container, false);
            loadList(rootView);
            return rootView;
        }

        private void loadList(View rootView) {
            // put list item array on the screen
            //ListView lv = (ListView) rootView.findViewById(R.id.listView);
            //lv.setAdapter(new ArrayAdapter<String>(getActivity(), android.R.layout.simple_list_item_1, eventsList));

            ListView lv = (ListView) rootView.findViewById(R.id.listView);
            List<String> listData = new ArrayList<String>();
            if (tasksList != null) {
                for (int i=0;i<tasksList.length();i++){
                    try {
                        listData.add(tasksList.get(i).toString());
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }
            // get data from the table by the ListAdapter
            System.out.println("testing");
            TasksArrayAdapter customAdapter = new TasksArrayAdapter(getActivity(), listData, tasksList, taskMap);

            lv.setAdapter(customAdapter);

            // what happens on item click
            lv.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                @Override
                public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                    System.out.println(position + 1);
                }
            });
        }

        //This is the code for the old expandable list view
        /*@Override
        public View onCreateView(LayoutInflater inflater, ViewGroup container,
                                 Bundle savedInstanceState) {
            View rootView = inflater.inflate(R.layout.fragment_task, container, false);

            // put list item array on the screen
            elv = (ExpandableListView) rootView.findViewById(R.id.expandableListView);

            // create task
            mTaskAdapter = new TaskAdapter(getActivity(), groupItem, childItem/*, taskMap*//*);
            elv.setAdapter(mTaskAdapter);

            return rootView;
        }*/
    }

    public static class EventsFragment extends Fragment {
        /**
         * The fragment argument representing the section number for this
         * fragment.
         */
        private static final String ARG_SECTION_NUMBER = "section_one";

        /**
         * Returns a new instance of this fragment for the given section
         * number.
         */
        public static EventsFragment newInstance(int sectionNumber) {
            EventsFragment fragment = new EventsFragment();
            Bundle args = new Bundle();
            args.putInt(ARG_SECTION_NUMBER, sectionNumber);
            fragment.setArguments(args);
            return fragment;
        }

        public EventsFragment() {
        }

        @Override
        public View onCreateView(LayoutInflater inflater, ViewGroup container,
                                 Bundle savedInstanceState) {
            View rootView = inflater.inflate(R.layout.fragment_main, container, false);
            loadList(rootView);
            return rootView;
        }

        private void loadList(View rootView) {
            // put list item array on the screen
            //ListView lv = (ListView) rootView.findViewById(R.id.listView);
            //lv.setAdapter(new ArrayAdapter<String>(getActivity(), android.R.layout.simple_list_item_1, eventsList));

            ListView lv = (ListView) rootView.findViewById(R.id.listView);
            List<String> listData = new ArrayList<String>();
            if (eventsList != null) {
                for (int i=0;i<eventsList.length();i++){
                    try {
                        listData.add(eventsList.get(i).toString());
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }
            // get data from the table by the ListAdapter
            EventsArrayAdapter customAdapter = new EventsArrayAdapter(getActivity(), listData, eventsList, eventMap);

            lv.setAdapter(customAdapter);

            // what happens on item click
            lv.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                @Override
                public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                    System.out.println(position + 1);
                }
            });
        }
    }

}
