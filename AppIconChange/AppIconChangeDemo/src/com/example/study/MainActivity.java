package com.example.study;

import java.util.Iterator;
import java.util.List;

import android.app.Activity;
import android.app.ActivityManager;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.TextView;

public class MainActivity extends Activity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.main);

		TextView tv = (TextView) findViewById(R.id.tvTitle);
		tv.setText(getClass().getSimpleName());

		if (!isServiceRunning(MyService.class.getClass().getName())) {
			Intent intSer = new Intent(getApplicationContext(), MyService.class);
			startService(intSer);
		}
	}

	private boolean isServiceRunning(String serviceName) {
		boolean serviceRunning = false;
		ActivityManager am = (ActivityManager) this
				.getSystemService(ACTIVITY_SERVICE);
		List<ActivityManager.RunningServiceInfo> l = am.getRunningServices(50);
		Iterator<ActivityManager.RunningServiceInfo> i = l.iterator();
		while (i.hasNext()) {
			ActivityManager.RunningServiceInfo runningServiceInfo = (ActivityManager.RunningServiceInfo) i
					.next();

			if (runningServiceInfo.service.getClassName().equals(serviceName)) {
				serviceRunning = true;
			}
		}
		Log.i("DEMO", "Is " + serviceName + " Service Running : "
				+ serviceRunning);
		return serviceRunning;
	}

}
