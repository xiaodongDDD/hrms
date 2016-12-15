package com.hand.face.utils;

import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;

/**
 * Created by xiang.wang on 2016/12/9.
 * 加速传感器
 */
public class Accelerometer {
    private SensorManager a = null;
    private boolean b = false;
    private static CLOCKWISE_ANGLE c;
    private SensorEventListener d = new SensorEventListener() {
        public void onAccuracyChanged(Sensor var1, int var2) {
        }

        public void onSensorChanged(SensorEvent var1) {
            if(var1.sensor.getType() == 1) {
                float var2 = var1.values[0];
                float var3 = var1.values[1];
                float var4 = var1.values[2];
                if(Math.abs(var2) > 3.0F || Math.abs(var3) > 3.0F) {
                    if(Math.abs(var2) > Math.abs(var3)) {
                        if(var2 > 0.0F) {
                            Accelerometer.c = CLOCKWISE_ANGLE.Deg0;
                        } else {
                            Accelerometer.c = CLOCKWISE_ANGLE.Deg180;
                        }
                    } else if(var3 > 0.0F) {
                        Accelerometer.c = CLOCKWISE_ANGLE.Deg90;
                    } else {
                        Accelerometer.c = CLOCKWISE_ANGLE.Deg270;
                    }
                }
            }

        }
    };

    public Accelerometer(Context var1) {
        this.a = (SensorManager)var1.getSystemService("sensor");
        c = CLOCKWISE_ANGLE.Deg0;
    }

    public void start() {
        if(!this.b) {
            this.b = true;
            c = CLOCKWISE_ANGLE.Deg0;
            this.a.registerListener(this.d, this.a.getDefaultSensor(1), 3);
        }
    }

    public void stop() {
        if(this.b) {
            this.b = false;
            this.a.unregisterListener(this.d);
        }
    }

    public static int getDirection() {
        return c.getValue();
    }

    public static enum CLOCKWISE_ANGLE {
        Deg0(0),
        Deg90(1),
        Deg180(2),
        Deg270(3);

        private int value;

        private CLOCKWISE_ANGLE(int var3) {
            this.value = var3;
        }

        public int getValue() {
            return this.value;
        }
    }
}
