import 'package:flutter/foundation.dart' show kIsWeb;  // Für Plattform-Check
import 'package:flutter/material.dart';
import 'package:hive_flutter/hive_flutter.dart';  // Für initFlutter
import 'package:kanban_board/kanban_board.dart' as kb;  // Alias für Konflikt-Auflösung
import 'package:path_provider/path_provider.dart' as path_provider;
import 'models/board_group.dart';
import 'models/board_item.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Konditionale Hive-Init: Auf Web ohne Pfad (IndexedDB), sonst mit path_provider
  if (kIsWeb) {
    await Hive.initFlutter();  // Für Web: Kein Pfad nötig
  } else {
    final appDocumentDir = await path_provider.getApplicationDocumentsDirectory();
    await Hive.initFlutter(appDocumentDir.path);
  }
  
  Hive.registerAdapter(BoardGroupAdapter());
  Hive.registerAdapter(BoardItemAdapter());
  await Hive.openBox('rmbr_boards');
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Rmbr - Notiz App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final kb.KanbanBoardController _controller = kb.KanbanBoardController();  // Mit Alias
  late Box _box;
  List<BoardGroup> _groups = [];

  @override
  void initState() {
    super.initState();
    _box = Hive.box('rmbr_boards');
    _loadData();
  }

  void _loadData() {
    final savedGroups = _box.get('main_board');
    if (savedGroups is List && savedGroups.isNotEmpty) {
      _groups = savedGroups.cast<BoardGroup>();
    } else {
      _groups = [
        BoardGroup(id: 'group1', name: 'To Do', items: [
          BoardItem(itemId: 'item1', title: 'Notiz 1: Einkaufen gehen'),
          BoardItem(itemId: 'item2', title: 'Notiz 2: Anruf tätigen'),
        ]),
        BoardGroup(id: 'group2', name: 'In Progress', items: [
          BoardItem(itemId: 'item3', title: 'Notiz 3: Projekt starten'),
        ]),
        BoardGroup(id: 'group3', name: 'Done', items: []),
      ];
      _saveData();
    }
    setState(() {});
  }

  void _saveData() {
    _box.put('main_board', _groups);
  }

  // Neue Funktion: Notiz bearbeiten via Dialog
  void _editItem(BoardItem item, BoardGroup group) async {
    final TextEditingController _titleController = TextEditingController(text: item.title);
    final newTitle = await showDialog<String>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Notiz bearbeiten'),
        content: TextField(
          controller: _titleController,
          decoration: const InputDecoration(hintText: 'Neuer Titel'),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Abbrechen'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, _titleController.text),
            child: const Text('Speichern'),
          ),
        ],
      ),
    );
    if (newTitle != null && newTitle.isNotEmpty) {
      setState(() {
        item.title = newTitle;  // Update Title
        _saveData();  // Persistiere
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Rmbr - Dein Notiz-Board'),
      ),
      body: kb.KanbanBoard(  // Mit Alias
        controller: _controller,
        groups: _groups,  // Unsere erweiterte Klasse ist kompatibel
        groupItemBuilder: (context, groupId, itemIndex) {
          final group = _groups.firstWhere((g) => g.id == groupId);
          final item = group.items[itemIndex] as BoardItem;
          return GestureDetector(  // Neu: onTap für Bearbeiten
            onTap: () => _editItem(item, group),
            child: Card(
              child: ListTile(
                title: Text(item.title),
              ),
            ),
          );
        },
        onGroupItemMove: (int? oldGroupIndex, int? oldItemIndex, int? newGroupIndex, int? newItemIndex) {
          if (oldGroupIndex == null || oldItemIndex == null || newGroupIndex == null || newItemIndex == null) {
            return;
          }
          setState(() {
            final movedItem = _groups[oldGroupIndex].items.removeAt(oldItemIndex);
            _groups[newGroupIndex].items.insert(newItemIndex, movedItem);
            _saveData();
          });
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          setState(() {
            final newId = 'new_item_${DateTime.now().millisecondsSinceEpoch}';
            _groups[0].items.add(BoardItem(itemId: newId, title: 'Neue Notiz'));
            _saveData();
          });
        },
        child: const Icon(Icons.add),
      ),
    );
  }
}