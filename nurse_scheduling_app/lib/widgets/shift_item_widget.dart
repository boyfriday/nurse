import 'package:flutter/material.dart';
import '../models/shift.dart';
import '../utils/date_helper.dart';

class ShiftItemWidget extends StatelessWidget {
  final Shift shift;
  final VoidCallback onRequestLeave;

  const ShiftItemWidget({
    super.key,
    required this.shift,
    required this.onRequestLeave,
  });

  Color _getStatusColor(String? status) {
    switch (status) {
      case 'approved':
        return Colors.green;
      case 'rejected':
        return Colors.red;
      case 'pending':
      default:
        return Colors.orange;
    }
  }

  @override
  Widget build(BuildContext context) {
    final hasLeaveRequest = shift.leaveRequest != null;
    final leaveStatus = hasLeaveRequest ? shift.leaveRequest!.status : null;

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  DateHelper.formatDateTimeDisplay(shift.dateStartTime),
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                if (hasLeaveRequest)
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: _getStatusColor(leaveStatus),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      leaveStatus!.toUpperCase(),
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              'End: ${DateHelper.formatDateTimeDisplay(shift.dateEndTime)}',
              style: const TextStyle(fontSize: 14, color: Colors.grey),
            ),
            if (!hasLeaveRequest) const SizedBox(height: 16),
            if (!hasLeaveRequest)
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: onRequestLeave,
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
                  child: const Text('Request Leave'),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
