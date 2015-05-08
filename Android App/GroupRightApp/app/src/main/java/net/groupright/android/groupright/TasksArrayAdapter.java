package net.groupright.android.groupright;

import android.app.Activity;
import android.content.Context;
import android.graphics.Color;
import android.support.v4.app.FragmentActivity;
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
public class TasksArrayAdapter extends ArrayAdapter {

    private final Context context;
    private final JSONArray tasksList;
    private final JSONObject taskMap;

    static class ViewHolder {
        public TextView text;
        public ImageView image;
    }

    public TasksArrayAdapter(Activity context, List values, JSONArray tasksList, JSONObject taskMap) {
        super(context, R.layout.task_layout, values);
        this.context = context;
        this.tasksList = tasksList;
        this.taskMap = taskMap;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        View rowView = convertView;

        // reuse views
        if (rowView == null) {
            LayoutInflater inflater = LayoutInflater.from(context);
            rowView = inflater.inflate(R.layout.task_layout, null);
            // configure view holder
            ViewHolder viewHolder = new ViewHolder();
            viewHolder.text = (TextView) rowView.findViewById(R.id.taskText);
            viewHolder.image = (ImageView) rowView.findViewById(R.id.taskColor);
            rowView.setTag(viewHolder);

            rowView.setTag(viewHolder);
        }

        // fill data
        ViewHolder holder = (ViewHolder) rowView.getTag();

        String s = "";
        try {
            s = tasksList.getJSONObject(position).getString("task_title");
        } catch (JSONException e) {
            e.printStackTrace();
        }

        //set view data
        holder.text.setText(s);
        //holder.text.setText("hello world");
        //textView.setText(values.indexOf(position));
        try {
            holder.image.setBackgroundColor(Color.parseColor(taskMap.getString(Integer.toString(position))));
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return rowView;
    }
}
