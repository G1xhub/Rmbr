import 'package:hive/hive.dart';  // Standard Import
import 'package:kanban_board/kanban_board.dart' as kb;  // Alias für Konflikt-Auflösung
import 'board_item.dart';

part 'board_group.g.dart';

@HiveType(typeId: 0)
class BoardGroup extends kb.KanbanBoardGroup {  // Erweitere mit Alias
  @HiveField(0)
  @override
  final String id;

  @HiveField(1)
  @override
  final String name;

  @HiveField(2)
  List<BoardItem> _items;  // Privates Field für Hive (spezifischer Typ)

  BoardGroup({
    required this.id,
    required this.name,
    List<BoardItem> items = const [],
  }) : _items = items,
       super(id: id, name: name, items: items);

  // Override Getter (covariant return type: Erlaubt Subtyp-Return)
  @override
  List<kb.KanbanBoardGroupItem> get items => _items;

  // Override Setter mit covariant (erlaubt engeren Parameter-Typ)
  @override
  set items(covariant List<BoardItem> items) {
    _items = items;
  }
}