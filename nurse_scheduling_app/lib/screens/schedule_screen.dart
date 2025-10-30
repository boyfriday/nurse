// ignore_for_file: library_private_types_in_public_api

import 'package:flutter/material.dart';
import 'package:nurse_scheduling_app/widgets/loading_widget.dart';
import 'package:provider/provider.dart';
import '../models/shift.dart';
import '../../services/auth_service.dart';
import '../../services/api_service.dart';
import '../../utils/date_helper.dart';
import '../../widgets/week_selector_widget.dart';
import '../../widgets/shift_item_widget.dart';

class ScheduleScreen extends StatefulWidget {
  const ScheduleScreen({super.key});

  @override
  _ScheduleScreenState createState() => _ScheduleScreenState();
}

class _ScheduleScreenState extends State<ScheduleScreen> {
  final ApiService _apiService = ApiService();
  List<Shift> _shifts = [];
  bool _isLoading = true;
  DateTime _selectedWeek = DateHelper.getStartOfWeek(DateTime.now());

  @override
  void initState() {
    super.initState();
    _loadSchedule();
  }

  Future<void> _loadSchedule() async {
    setState(() => _isLoading = true);
    try {
      final shifts = await _apiService.getScheduleForWeek(_selectedWeek);
      setState(() {
        _shifts = shifts;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Failed to load schedule: $e')));
    }
  }

  void _changeWeek(int direction) {
    setState(() {
      _selectedWeek = _selectedWeek.add(Duration(days: 7 * direction));
    });
    _loadSchedule();
  }

  void _showLeaveRequestDialog(Shift shift) {
    final reasonController = TextEditingController();
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Request Leave'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Shift: ${DateHelper.formatDateTimeDisplay(shift.dateStartTime)}',
            ),
            const SizedBox(height: 16),
            TextField(
              controller: reasonController,
              decoration: const InputDecoration(hintText: 'Reason for leave'),
              maxLines: 3,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () async {
              if (reasonController.text.isNotEmpty) {
                Navigator.pop(context);
                try {
                  await _apiService.requestLeave(
                    shift.id,
                    reasonController.text,
                  );
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Leave request submitted!')),
                  );
                  _loadSchedule(); // โหลดข้อมูลใหม่
                } catch (e) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Failed to submit request: $e')),
                  );
                }
              }
            },
            child: const Text('Submit'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final authService = Provider.of<AuthService>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text('Welcome, ${authService.user?.name}'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              authService.logout();
              Navigator.of(
                context,
              ).pushReplacementNamed('/login'); // ใช้ named route หรือ popUntil
            },
          ),
        ],
      ),
      body: Column(
        children: [
          WeekSelectorWidget(
            selectedWeek: _selectedWeek,
            onPreviousWeek: () => _changeWeek(-1),
            onNextWeek: () => _changeWeek(1),
          ),
          Expanded(
            child: _isLoading
                ? const LoadingWidget(message: 'Loading your schedule...')
                : _shifts.isEmpty
                ? const Center(child: Text('No shifts this week.'))
                : ListView.builder(
                    itemCount: _shifts.length,
                    itemBuilder: (context, index) {
                      final shift = _shifts[index];
                      return ShiftItemWidget(
                        shift: shift,
                        onRequestLeave: () => _showLeaveRequestDialog(shift),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
