import 'package:hive/hive.dart';  // Standard Import
import 'package:kanban_board/kanban_board.dart' as kb;  // Alias für Konflikt-Auflösung

part 'board_item.g.dart';

@HiveType(typeId: 1)
class BoardItem extends kb.KanbanBoardGroupItem {  // Erweitere mit Alias
  @HiveField(0)
  final String itemId;

  @HiveField(1)
  String title;  // Non-final, damit bearbeitbar (z. B. via Dialog)

  BoardItem({required this.itemId, required this.title});

  @override
  String get id => itemId;
}