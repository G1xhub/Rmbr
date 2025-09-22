// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'board_item.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class BoardItemAdapter extends TypeAdapter<BoardItem> {
  @override
  final int typeId = 1;

  @override
  BoardItem read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return BoardItem(
      itemId: fields[0] as String,
      title: fields[1] as String,
    );
  }

  @override
  void write(BinaryWriter writer, BoardItem obj) {
    writer
      ..writeByte(2)
      ..writeByte(0)
      ..write(obj.itemId)
      ..writeByte(1)
      ..write(obj.title);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is BoardItemAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
