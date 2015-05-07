package net.groupright.android.groupright;

import android.app.Activity;
import android.content.Context;
import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;

/**
 * Created by kennethbigler on 4/24/15.
 */
public class EventsArrayAdapter extends ArrayAdapter {
    private final Context context;
    private final JSONArray eventsList;
    private final JSONObject eventMap;

    static class ViewHolder {
        public TextView day;
        public TextView month;
        public TextView etitle;
        public TextView time;
        public ImageView groupId;
    }

    public EventsArrayAdapter(Activity context, List values, JSONArray eventsList, JSONObject eventMap) {
        super(context, R.layout.event_layout, values);
        this.context = context;
        this.eventsList = eventsList;
        this.eventMap = eventMap;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        View rowView = convertView;
        String day = "??";
        String month = "ydk";
        String etitle = "";
        String time = "undecided - undecided";
        String myDate = "";
        String ending = "";
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "June",
                "July", "Aug", "Sept", "Oct", "Nov", "Dec"};

        // reuse views
        if (rowView == null) {
            LayoutInflater inflater = LayoutInflater.from(context);
            rowView = inflater.inflate(R.layout.event_layout, null);
            // configure view holder
            ViewHolder viewHolder = new ViewHolder();
            viewHolder.day = (TextView) rowView.findViewById(R.id.day);
            viewHolder.month = (TextView) rowView.findViewById(R.id.month);
            viewHolder.etitle = (TextView) rowView.findViewById(R.id.eventTitle);
            viewHolder.time = (TextView) rowView.findViewById(R.id.timeSlot);
            viewHolder.groupId = (ImageView) rowView.findViewById(R.id.groupId);
            rowView.setTag(viewHolder);

            // I commented this out, idk why it was here
            // rowView.setTag(viewHolder);
        }

        // fill data
        ViewHolder holder = (ViewHolder) rowView.getTag();
        //String s = values.get(position).toString();
        try {
            myDate = eventsList.getJSONObject(position).getString("start_time");
            etitle = eventsList.getJSONObject(position).getString("name");
            ending = eventsList.getJSONObject(position).getString("end_time");
        } catch (JSONException e) {
            e.printStackTrace();
        }

        if (myDate.length() > 11)
            day = myDate.substring(8,10);
        if (myDate.length() > 8)
            month = months[Integer.parseInt(myDate.substring(5,7))];
        if (myDate.length() > 12 && ending.length() > 12)
            time = myDate.substring(11) + " - " + ending.substring(11);

        /*for (int i = 0; i < myDate.length(); i ++)
            System.out.println("index " + i + ": " + myDate.substring(i,i+1));*/

        //set view data
        holder.etitle.setText(etitle);
        holder.day.setText(day);
        holder.month.setText(month);
        holder.time.setText(time);

        try {
            holder.groupId.setBackgroundColor(Color.parseColor(eventMap.getString(Integer.toString(position))));
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return rowView;
    }
}
