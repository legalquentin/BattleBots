package bot

import rpio "github.com/stianeikeland/go-rpio"

var laserLocked = false
var pwmFreq = 10000

// pin defined to control pi peripherics

// pins motor A
var pinPwma = rpio.Pin(18)
var pinAin1 = rpio.Pin(23)
var pinAin2 = rpio.Pin(24)

// pins motor B
var pinPwmb = rpio.Pin(19)
var pinBin1 = rpio.Pin(27)
var pinBin2 = rpio.Pin(22)

//  pin Standby
var pinStby = rpio.Pin(25)

// pin laser
var pinLaser = rpio.Pin(26)

// SetUpPins will define initial states of the raspi pins
// PWM is for analog control over the pins
func SetUpPins() {
	pinPwma.Mode(rpio.Pwm)
	pinPwmb.Mode(rpio.Pwm)

	pinPwma.Freq(pwmFreq)
	pinPwmb.Freq(pwmFreq)

	pinPwma.DutyCycle(0, 100)
	pinPwmb.DutyCycle(0, 100)

	pinAin1.Output()
	pinAin2.Output()
	pinBin1.Output()
	pinBin2.Output()
	pinStby.Output()
	pinLaser.Output()
}
