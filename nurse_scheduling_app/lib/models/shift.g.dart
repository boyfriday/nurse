// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'shift.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Shift _$ShiftFromJson(Map<String, dynamic> json) => Shift(
  id: (json['id'] as num).toInt(),
  dateStartTime: DateTime.parse(json['date_start_time'] as String),
  dateEndTime: DateTime.parse(json['date_end_time'] as String),
  leaveRequest: json['leaveRequest'] == null
      ? null
      : LeaveRequest.fromJson(json['leaveRequest'] as Map<String, dynamic>),
);

Map<String, dynamic> _$ShiftToJson(Shift instance) => <String, dynamic>{
  'id': instance.id,
  'date_start_time': instance.dateStartTime.toIso8601String(),
  'date_end_time': instance.dateEndTime.toIso8601String(),
  'leaveRequest': instance.leaveRequest,
};
