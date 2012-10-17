package org.t2.adcompanion;

import org.apache.cordova.DroidGap;
//import org.t2.adcompanion.plugins.VideoPlayer;
//import org.t2.adcompanion.phonegap.T2DroidGap;
//import org.t2.adcompanion.PhonegapModifications;
import org.t2.adcompanion.plugins.pluginFlurry;
import android.app.Dialog;
import android.os.Bundle;
import android.os.Handler;
import com.flurry.android.FlurryAgent;

public class ADCompanionActivity extends DroidGap {
	 
	private static int SPLASH_DELAY = 3000;
	
	/**   
	 * Simple Dialog used to show the splash screen 
	 */
	protected Dialog mSplashDialog;	

    /** Called when the activity is first created. */
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		super.setIntegerProperty("loadUrlTimeoutValue", 60000);
		super.setStringProperty("errorUrl", "file:///android_asset/www/error.html"); // if error loading file in super.loadUrl().
		super.init();
		super.appView.setHorizontalScrollBarEnabled(false);
		Eula.show(this);
		super.loadUrl("file:///android_asset/www/index.html"); // show splash screen 3 sec before loading app
		showSplashScreen(SPLASH_DELAY);
	}
    
    /**
     * Shows the splash screen over the full Activity
     * Annoying side effect of using Dialog is that accessibility announces the page:  "Alert!"
     */
    protected void showSplashScreen(int duration) {
        mSplashDialog = new Dialog(this, R.style.splashstyle);
        mSplashDialog.setContentView(R.layout.splash);
        mSplashDialog.setCancelable(false);
        mSplashDialog.show();
     
        // Set Runnable to remove splash screen
        final Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
          public void run() {
            removeSplashScreen();
          } 
        }, duration);
    }

    /**
     * Removes the Dialog that is the splash screen
     */
    public void removeSplashScreen() {
        if (mSplashDialog != null) {
            mSplashDialog.dismiss();
            mSplashDialog = null; //gc
        } 
    }

	@Override
	public void onStart() {
		super.onStart();
	       FlurryAgent.onStartSession(this, "ALZXTBTKG2LINE7BRZRL");
	}

	@Override
	public void onStop() {
		super.onStop();
			FlurryAgent.onEndSession(this);
	}
	
	@Override
	public void onPause() {
		super.onPause();
		//sendJavascript("text_to_speech('stop');");
	}
	
	@Override
	public void onResume() {
		super.onResume();
		//Log.d("PhoneGapLog", "Application Resumed.");
		//sendJavascript("onResume();");
		//sendJavascript("logAnalytics('')");
	}
}
