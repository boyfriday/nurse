import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../models/shift.dart';
import '../../utils/date_helper.dart';

class ApiService {
  final String baseUrl =
      'http://localhost:5000/api'; // เปลี่ยน IP เป็นของคุณ
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  Future<Map<String, String>> _getHeaders() async {
    final token = await _storage.read(key: 'token');
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    };
  }

  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to login: ${response.body}');
    }
  }

  Future<List<Shift>> getScheduleForWeek(DateTime weekStart) async {
    final weekEnd = DateHelper.getEndOfWeek(weekStart);
    final startDate = DateHelper.formatDateForApi(weekStart);
    final endDate = DateHelper.formatDateForApi(weekEnd);

    final headers = await _getHeaders();
    final response = await http.get(
      Uri.parse('$baseUrl/my-schedule?startDate=$startDate&endDate=$endDate'),
      headers: headers,
    );

    if (response.statusCode == 200) {
      final List<dynamic> scheduleJson = jsonDecode(
        response.body,
      )['data']['schedule'];
      return scheduleJson.map((json) => Shift.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load schedule');
    }
  }

  Future<void> requestLeave(int shiftAssignmentId, String reason) async {
    final headers = await _getHeaders();
    final response = await http.post(
      Uri.parse('$baseUrl/leave-requests'),
      headers: headers,
      body: jsonEncode({
        'shift_assignment_id': shiftAssignmentId,
        'reason': reason,
      }),
    );

    if (response.statusCode != 201) {
      throw Exception('Failed to request leave');
    }
  }
}
