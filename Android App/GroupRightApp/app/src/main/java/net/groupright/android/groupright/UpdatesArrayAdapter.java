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

import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;

/**
 * Created by kennethbigler on 4/24/15.
 */
public class UpdatesArrayAdapter extends ArrayAdapter {
    private final Context context;
    private final List values;
    private final JSONObject updateMap;

    static class ViewHolder {
        public TextView text;
        public ImageView image;
    }

    public UpdatesArrayAdapter(Context context, int resource, List<String> items) {
        super(context, resource, items);
        this.context = context;
        this.values = items;
        this.updateMap = new JSONObject();
    }

    public UpdatesArrayAdapter(Activity context, List values, JSONObject updateMap) {
        super(context, R.layout.update_layout, values);
        this.context = context;
        this.values = values;
        this.updateMap = updateMap;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        View rowView = convertView;

        // reuse views
        if (rowView == null) {
            LayoutInflater inflater = LayoutInflater.from(context);
            rowView = inflater.inflate(R.layout.update_layout, null);
            // configure view holder
            ViewHolder viewHolder = new ViewHolder();
            viewHolder.text = (TextView) rowView.findViewById(R.id.textView2);
            viewHolder.image = (ImageView) rowView.findViewById(R.id.imageView2);
            rowView.setTag(viewHolder);

            rowView.setTag(viewHolder);
        }

        // fill data
        ViewHolder holder = (ViewHolder) rowView.getTag();
        String s = values.get(position).toString();
        //set view data
        holder.text.setText(s);
        //holder.text.setText("hello world");
        //textView.setText(values.indexOf(position));
        try {
            rowView.setBackgroundColor(Color.parseColor("#B2"+updateMap.getString(Integer.toString(position)).substring(1)));
        } catch (JSONException e) {
            e.printStackTrace();
        }

        try {
            s = updateMap.getString("t" + Integer.toString(position));
        } catch (JSONException e) {
            e.printStackTrace();
        }

        //System.out.println(s);
        // set the image view of the updates line
        if (s.equals("task")) {
            holder.image.setImageResource(R.drawable.task);
        } else if (s.equals("event")) {
            holder.image.setImageResource(R.drawable.cal);
        } else {
            holder.image.setImageResource(R.drawable.basecase);
        }

        return rowView;
    }
}
