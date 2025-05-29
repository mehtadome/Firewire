import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart'; // To format the timestamp

Future<String> postData({
  required String name,
  required String lat,
  required String lon,
  required String message,
}) async {
  final String apiUrl = 'http://ec2-44-236-44-204.us-west-2.compute.amazonaws.com:5000/api/v1/transcript';

  try {
    // Get current timestamp
    String timestamp = DateFormat('HH:mm:ss').format(DateTime.now().toUtc());
    print("TS: $timestamp");

    final response = await http.post(
      Uri.parse(apiUrl),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        'Access-Control-Allow-Headers': 'Origin, *',
      },
      body: jsonEncode(<String, dynamic>{
        'date': timestamp,
        'author': name,
        'location': {
          'lat': lat,
          'lon': lon,
        },
        'message': message,
      }),
    );

    if (response.statusCode == 201) {
      print("posted succesfully");
      // Successful POST request, handle the response here
      final responseData = jsonDecode(response.body);
      return 'Author: ${responseData['author']}\n'
          'date: ${responseData['timestamp']}\n'
          'Location: Lat ${responseData['location']['lat']}, Lon ${responseData['location']['lon']}\n'
          'Message: ${responseData['message']}';
    } else {
      // If the server returns an error response, throw an exception
      print("Failed to post");
      throw Exception('Failed to post data');
    }
  } catch (e) {
    return 'Error: $e';
  }
}
