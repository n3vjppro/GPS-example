package com.iamlost;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.BV.LinearGradient.LinearGradientPackage;
import com.robinpowered.react.battery.DeviceBatteryPackage;

import com.learnium.RNDeviceInfo.RNDeviceInfo;

import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.pilloxa.backgroundjob.BackgroundJobPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;


import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.airbnb.android.react.maps.MapsPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

   
  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new LinearGradientPackage(),
            new DeviceBatteryPackage(),
            new RNDeviceInfo(),
           new BatteryStatusPackage(),
            new SplashScreenReactPackage(),
            new BackgroundJobPackage(),
            new ReactNativePushNotificationPackage(),           
             new RCTCameraPackage(),            
              new MapsPackage()

      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
   // SplashScreen.show(this); 
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
   
 }
}
