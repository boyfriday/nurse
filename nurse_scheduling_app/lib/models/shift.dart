import 'package:json_annotation/json_annotation.dart';
import 'leave_request.dart';

part 'shift.g.dart';

@JsonSerializable()
class Shift {
  final int id;
  @JsonKey(name: 'date_start_time')
  final DateTime dateStartTime;
  @JsonKey(name: 'date_end_time')
  final DateTime dateEndTime;
  @JsonKey(name: 'leaveRequest')
  final LeaveRequest? leaveRequest;

  Shift({
    required this.id,
    required this.dateStartTime,
    required this.dateEndTime,
    this.leaveRequest,
  });

  factory Shift.fromJson(Map<String, dynamic> json) => _$ShiftFromJson(json);
  Map<String, dynamic> toJson() => _$ShiftToJson(this);
}
