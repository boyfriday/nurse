import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../utils/date_helper.dart';

class WeekSelectorWidget extends StatelessWidget {
  final DateTime selectedWeek;
  final VoidCallback onPreviousWeek;
  final VoidCallback onNextWeek;

  const WeekSelectorWidget({
    super.key,
    required this.selectedWeek,
    required this.onPreviousWeek,
    required this.onNextWeek,
  });

  @override
  Widget build(BuildContext context) {
    final startOfWeek = DateHelper.getStartOfWeek(selectedWeek);
    final endOfWeek = DateHelper.getEndOfWeek(selectedWeek);

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          IconButton(
            icon: const Icon(Icons.chevron_left),
            onPressed: onPreviousWeek,
          ),
          Text(
            '${DateFormat('dd MMM').format(startOfWeek)} - ${DateFormat('dd MMM yyyy').format(endOfWeek)}',
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          IconButton(
            icon: const Icon(Icons.chevron_right),
            onPressed: onNextWeek,
          ),
        ],
      ),
    );
  }
}
