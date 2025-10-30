// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'leave_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LeaveRequest _$LeaveRequestFromJson(Map<String, dynamic> json) => LeaveRequest(
  id: (json['id'] as num).toInt(),
  reason: json['reason'] as String,
  status: json['status'] as String,
);

Map<String, dynamic> _$LeaveRequestToJson(LeaveRequest instance) =>
    <String, dynamic>{
      'id': instance.id,
      'reason': instance.reason,
      'status': instance.status,
    };
