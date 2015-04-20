package net.groupright.android.groupright;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;

import android.content.Intent;
import android.graphics.drawable.ColorDrawable;
import android.net.Uri;
import android.support.v7.app.ActionBarActivity;
import android.support.v7.app.ActionBar;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.support.v4.app.FragmentPagerAdapter;
import android.os.Bundle;
import android.support.v4.view.ViewPager;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ExpandableListView;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;


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
    static List<String> eventsList = new ArrayList<String>();
    String accessCode = "no data";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        grLogin();

        // Set up the action bar.
        final ActionBar actionBar = getSupportActionBar();
        actionBar.setNavigationMode(ActionBar.NAVIGATION_MODE_TABS);
        //ActionBar bar = getActionBar();
        //bar.setBackgroundDrawable(new ColorDrawable("COLOR"));
        //actionBar.setBackgroundDrawable(new ColorDrawable(R.string.GRLightBlue));


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
    private void grLogin() {

        //load in Update Data
        updatesList.add("Update 1");
        updatesList.add("Update 2");
        updatesList.add("Update 3");

        //load in Task Data
        groupItem.add("Website");
        groupItem.add("Android");
        groupItem.add("iOS");

        /**
         * Add Data For Website
         */
        List<String> child = new ArrayList<String>();
        child.add("Created By: Scott Sarsfield");
        child.add("https://www.groupright.net/dev/home.html is the best");
        childItem.put(groupItem.get(0), child);

        /**
         * Add Data For Android
         */
        List<String> child1 = new ArrayList<String>();
        child1.add("Created By: Kenneth Bigler");
        child1.add("It is essential to reach the global markets");
        childItem.put(groupItem.get(1), child1);
        /**
         * Add Data For iOS
         */
        List<String> child2 = new ArrayList<String>();
        child2.add("Created By: Zachary Wilson");
        child2.add("It is essential to reach the business markets");
        childItem.put(groupItem.get(2), child2);

        //load in Event Data
        eventsList.add("Event 1");
        eventsList.add("Event 2");
        eventsList.add("Event 3");

        //toast for testing
        Toast toast = Toast.makeText(getApplicationContext(), "Initialize Data", Toast.LENGTH_LONG);
        toast.show();
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
                Toast toast = Toast.makeText(getApplicationContext(), accessCode, Toast.LENGTH_SHORT);
                toast.show();
            }
            if (resultCode == RESULT_CANCELED) {
                // code if there is no result, I do not know what to do here
                Toast toast = Toast.makeText(getApplicationContext(),
                        "You do not have an account, please register at www.groupright.net",
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
                Toast toast = Toast.makeText(getApplicationContext(), "updates fragment loaded", Toast.LENGTH_SHORT);
                toast.show();
                return UpdatesFragment.newInstance(position + 1);
            } else if (position == 1) {
                Toast toast = Toast.makeText(getApplicationContext(), "tasks fragment loaded", Toast.LENGTH_SHORT);
                toast.show();
                return TasksFragment.newInstance(position + 1);
            } else if (position == 2) {
                Toast toast = Toast.makeText(getApplicationContext(), "events fragment loaded", Toast.LENGTH_SHORT);
                toast.show();
                return EventsFragment.newInstance(position + 1);
            } else {
                Toast toast = Toast.makeText(getApplicationContext(), "there was an error", Toast.LENGTH_SHORT);
                toast.show();
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
            ListView lv = (ListView) rootView.findViewById(R.id.listView);
            lv.setAdapter(new ArrayAdapter<String>(getActivity(), android.R.layout.simple_list_item_1, updatesList));

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
            View rootView = inflater.inflate(R.layout.fragment_task, container, false);

            // put list item array on the screen
            elv = (ExpandableListView) rootView.findViewById(R.id.expandableListView);

            // create task
            mTaskAdapter = new TaskAdapter(getActivity(), groupItem, childItem);
            elv.setAdapter(mTaskAdapter);

            // what happens on item click
            /*elv.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                @Override
                public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                    System.out.println(position + 1);
                }
            });*/

            //elv.setOnChildClickListener((ExpandableListView.OnChildClickListener) this);
            return rootView;
        }
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
            ListView lv = (ListView) rootView.findViewById(R.id.listView);
            lv.setAdapter(new ArrayAdapter<String>(getActivity(), android.R.layout.simple_list_item_1, eventsList));

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
