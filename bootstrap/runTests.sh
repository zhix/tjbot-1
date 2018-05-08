#!/bin/bash
TJBOT_DIR=$1

if [ -z "${TJBOT_DIR// }" ]; then
    TJBOT_DIR='/home/pi/Desktop/tjbot'
fi

#----test hardware
cd $TJBOT_DIR/bootstrap/tests
echo "Installing support libraries for TJBot. This may take few minutes."

npm install > install.log 2>&1

#echo "Running camera test"
#sudo node test.camera.js

read -p "Are you using NEOpixel as your light? [Y/n] " choice </dev/tty
case "$choice" in
    "" | "y" | "Y")
		echo "Running LED test for NEOpixel"
		sudo node test.led.js
        ;;
    "n" | "N")
		echo "skipping"
		;;
    *) ;;
esac

read -p "Are you using tricolor LED as your light? [Y/n] " choice </dev/tty
case "$choice" in
    "" | "y" | "Y")
		echo "Running LED test for NEOpixel"
		sudo node test.led2.js
        ;;
    "n" | "N")
		echo "skipping"
		;;
    *) ;;
esac

echo "Running servo test"
sudo node test.servo.js

echo "Running speaker test"
sudo node test.speaker.js

echo "Running microphone test. Don't forget to speak loud and clear."
sudo node test.mic.js 

read -p "Did it speak what you say? [Y/n] " choice </dev/tty
case "$choice" in
    "" | "y" | "Y")
		echo "-------------------------------------------------------------------"
		echo "Tests complete. Have fun! ;)"
		echo "-------------------------------------------------------------------"
		echo "**config.js has been copied to ../../recipes/speech_to_text/**"
		cp config.js /home/pi/Desktop/tjbot/recipes/speech_to_text/.
        ;;
    "n" | "N")
		echo "Please check your username and password in the config.js file."
		echo "Else, your USB microphone via alsamixer. "
		;;
    *) ;;
esac
