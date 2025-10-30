import 'package:json_annotation/json_annotation.dart';

part 'leave_request.g.dart';

@JsonSerializable()
class LeaveRequest {
  final int id;
  final String reason;
  final String status; // pending, approved, rejected

  LeaveRequest({required this.id, required this.reason, required this.status});

  factory LeaveRequest.fromJson(Map<String, dynamic> json) =>
      _$LeaveRequestFromJson(json);
  Map<String, dynamic> toJson() => _$LeaveRequestToJson(this);
}
