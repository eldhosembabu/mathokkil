package com.example.study;

import java.util.Random;
import java.util.Timer;
import java.util.TimerTask;

import android.app.Service;
import android.content.ComponentName;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.IBinder;
import android.preference.PreferenceManager;
import android.text.TextUtils;
import android.util.Log;

public class MyService extends Service {

	@Override
	public IBinder onBind(Intent arg0) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public int onStartCommand(Intent intent, int flags, int startId) {
		Log.i("DEMO", "Started");
		Timer tmr = new Timer();
		tmr.scheduleAtFixedRate(new TimerTask() {

			@Override
			public void run() {
				Random r = new Random();
				int value = r.nextInt(15);
				Log.i("DEMO", "Changing : " + value);

				PackageManager pm = getApplicationContext().getPackageManager();

				String lastEnabled = getLastEnabled(); //Getting last enabled from shared preference

				if (TextUtils.isEmpty(lastEnabled)) {
					lastEnabled = "com.example.study.MainActivity";
				}

				ComponentName componentName = new ComponentName(
						"com.example.study", lastEnabled);
				pm.setComponentEnabledSetting(componentName,
						PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
						PackageManager.DONT_KILL_APP);

				Log.i("DEMO", "Removing : " + lastEnabled);

				if (value <= 0) {
					lastEnabled = "com.example.study.MainActivity";
				} else if (value <= 10) {
					lastEnabled = "com.example.study.a" + value;
				} else {
					lastEnabled = "com.example.study.a10p";
				}

				componentName = new ComponentName("com.example.study",
						lastEnabled);
				pm.setComponentEnabledSetting(componentName,
						PackageManager.COMPONENT_ENABLED_STATE_ENABLED,
						PackageManager.DONT_KILL_APP);
				Log.i("DEMO", "Adding : " + lastEnabled);
				setLastEnabled(lastEnabled); //Saving last enabled to shared preference
			}
		}, 1000, 15000);
		return START_STICKY;
	}

	private String getLastEnabled() {
		SharedPreferences pref = PreferenceManager
				.getDefaultSharedPreferences(getApplicationContext());
		return pref.getString("LastEnabled", "");
	}

	private void setLastEnabled(String value) {
		SharedPreferences pref = PreferenceManager
				.getDefaultSharedPreferences(getApplicationContext());
		SharedPreferences.Editor editor = pref.edit();
		editor.putString("LastEnabled", value);
		editor.commit();
	}

}
