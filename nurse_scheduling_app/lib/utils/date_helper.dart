import 'package:intl/intl.dart';

class DateHelper {
  // คำนวณหาวันแรกของสัปดาห์ (จันทร์)
  static DateTime getStartOfWeek(DateTime date) {
    return date.subtract(Duration(days: date.weekday - 1));
  }

  // คำนวณหาวันสุดท้ายของสัปดาห์ (อาทิตย์)
  static DateTime getEndOfWeek(DateTime date) {
    return getStartOfWeek(date).add(const Duration(days: 6));
  }

  // จัดรูปแบบวันที่เป็น yyyy-MM-dd
  static String formatDateForApi(DateTime date) {
    return DateFormat('yyyy-MM-dd').format(date);
  }

  // จัดรูปแบบวันที่และเวลาสำหรับแสดงผล
  static String formatDateTimeDisplay(DateTime dateTime) {
    return DateFormat('EEE, dd MMM HH:mm').format(dateTime);
  }
}
