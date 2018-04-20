package com.iamlost;
import com.pilloxa.backgroundjob.BackgroundJobPackage;
import com.facebook.react.ReactActivity;
import android.content.Intent;     // <--- import
import android.os.Bundle;
import org.devio.rn.splashscreen.SplashScreen; // here




public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */

      @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this,true);  // here
        super.onCreate(savedInstanceState);
    }
    @Override
    protected String getMainComponentName() {
       // SplashScreen.show(this);
        return "IamLost";
    }
     @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
    }
   @Override
    public void onNewIntent(Intent intent) {
       super.onNewIntent(intent);
      setIntent(intent);
   }
}
