import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;
import 'package:speech_to_text/speech_recognition_error.dart';
import 'package:speech_to_text/speech_recognition_result.dart';
import 'package:geolocator/geolocator.dart';
import './post.dart';

void main() {
  runApp(const MainApp());
}

class MainApp extends StatefulWidget {
  const MainApp({super.key});
  @override
  AppState createState() => AppState();
}

class AppState extends State<MainApp> {
  // speech to text state
  stt.SpeechToText speechListener = stt.SpeechToText();
  bool isListening = false;
  String text = "";

  // ID state
  String username = "";

  // Location State
  String latitude = "";
  String longitude = "";

  @override
  void initState() {
    super.initState();
    initPermissions();
  }

  // asks for microphone permission/geolocation and initializes speech to text
  void initPermissions() async {

    PermissionStatus status = await Permission.microphone.request();
    if (!status.isGranted) {
      print("Microphone permission denied.");
    }

    PermissionStatus status2 = await Permission.location.request();
    if (!status2.isGranted) {
      print("Location permission denied");
    }

    bool available = await speechListener.initialize( onStatus: statusListener, onError: errorListener);
    if (!available) {
      print("Please enable speech recognition.");
    }

    startSTT();
  }

  // starts listening to the microphone
  void startSTT() async {
    if (!isListening) {
      setState(() {
        isListening = true;
      });
      await speechListener.listen(onResult: resultListener, pauseFor: const Duration(seconds: 10), listenFor: const Duration(days: 1) );
    }
  }

  // handles STT errors when they occur
  void errorListener(SpeechRecognitionError error) {
    // print("Speech recognition error: ${error.errorMsg}");
  }

  // updates STT text state to spoken words
  void resultListener(SpeechRecognitionResult result) {
    setState(() {
      text = result.recognizedWords;
    });
  }

  // detects when the status changes to "done" and restarts the speech listener after a short delay
  Future<void> statusListener(String status) async {
    // print("Status update: $status");

    if (status == "done") {
      print("end of speech received: $text");

      LocationSettings accuracySettings = LocationSettings(
        accuracy: LocationAccuracy.high,
        distanceFilter: 10,  
      );

      Position position = await Geolocator.getCurrentPosition(
          locationSettings: accuracySettings,
      );

      setState(() {
        latitude = position.latitude.toString();
        longitude = position.longitude.toString();
      });
      
      if(text != '' && username != ''){
        postData(
          name: username,
          lat: latitude,
          lon: longitude,
          message: text,
        );
      }

      setState(() {
        isListening = false;
        text = "";
      });

      Future.delayed(const Duration(milliseconds: 300), () {
        startSTT();
      });
    }
  }

  @override
  void dispose() {
    speechListener.stop();
    super.dispose();
  }

  // UI goes here
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          toolbarHeight: 200,
          title: const SizedBox(
            height: 200,
            child: Text("Firewire"),
          ),

          actions: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.fromLTRB(0, 5, 20, 5),
                    child: SizedBox(
                      width: 200,
                      child: TextField(
                        decoration: const InputDecoration(
                          labelText: ('Username'),
                          alignLabelWithHint: true,
                          border: OutlineInputBorder(
                            borderSide: BorderSide(color: Colors.grey, width: 1.0),
                          )
                        ),
                        onSubmitted: (value) => setState(() {
                          username = value;
                          print(username);
                        }),
                      ),
                    ),
                  ),
                  Text ("Username: $username"),
                  Text("Latitude: $latitude"),
                  Text("Longitude: $longitude"),
                ],
              )
          ],
        ),
        body:Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Padding(
                padding: const EdgeInsets.all(20.0),
                child: Text((isListening) ? '🟢' : '🔴'),
              ),
              Padding(
                padding: const EdgeInsets.all(20.0),
                child: Text((text == "") ? 'Say something' : text),
              ),
            ]
          ),
        ),
      ),
    );
  }
} // end of appstate