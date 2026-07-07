import 'package:flutter/material.dart';
import '../services/supabase_service.dart';
import '../models/clinic_models.dart';

class ResultsScreen extends StatefulWidget {
  const ResultsScreen({super.key});

  @override
  State<ResultsScreen> createState() => _ResultsScreenState();
}

class _ResultsScreenState extends State<ResultsScreen> {
  List<GalleryItem> _galleryItems = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadGallery();
  }

  Future<void> _loadGallery() async {
    try {
      final data = await SupabaseService.getGalleryItems();
      setState(() {
        _galleryItems = data;
        _loading = false;
      });
    } catch (_) {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'معرض النتائج والتحولات',
          style: TextStyle(fontWeight: FontWeight.w900, fontSize: 16),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF7A8F6A)))
          : ListView.builder(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.fromLTRB(20, 10, 20, 120),
              itemCount: _galleryItems.length,
              itemBuilder: (context, index) {
                final item = _galleryItems[index];
                if (item.mediaType == 'before_after' && item.beforeImage != null && item.afterImage != null) {
                  return BeforeAfterCaseCard(item: item);
                } else {
                  return RegularGalleryCard(item: item);
                }
              },
            ),
    );
  }
}

class BeforeAfterCaseCard extends StatefulWidget {
  final GalleryItem item;
  const BeforeAfterCaseCard({super.key, required this.item});

  @override
  State<BeforeAfterCaseCard> createState() => _BeforeAfterCaseCardState();
}

class _BeforeAfterCaseCardState extends State<BeforeAfterCaseCard> {
  double _sliderValue = 0.5;

  @override
  Widget build(BuildContext context) {
    final primaryColor = const Color(0xFF7A8F6A);
    final beforeImg = widget.item.beforeImage ?? '';
    final afterImg = widget.item.afterImage ?? '';

    return Container(
      margin: const EdgeInsets.only(bottom: 24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: Colors.black.withOpacity(0.04)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.01),
            blurRadius: 15,
            offset: const Offset(0, 8),
          )
        ],
      ),
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Dynamic Interactive Before/After Comparison Image
          ClipRRect(
            borderRadius: BorderRadius.circular(24),
            child: AspectRatio(
              aspectRatio: 1.15,
              child: Stack(
                children: [
                  // After Image (Base)
                  Positioned.fill(
                    child: Image.network(
                      afterImg,
                      fit: BoxFit.cover,
                    ),
                  ),
                  
                  // Before Image (Clipped overlay)
                  Positioned.fill(
                    child: LayoutBuilder(
                      builder: (context, constraints) {
                        return Align(
                          alignment: Alignment.centerLeft,
                          child: FractionallySizedBox(
                            widthFactor: _sliderValue,
                            heightFactor: 1.0,
                            child: Image.network(
                              beforeImg,
                              fit: BoxFit.cover,
                              alignment: Alignment.centerLeft,
                              width: constraints.maxWidth,
                              height: constraints.maxHeight,
                            ),
                          ),
                        );
                      },
                    ),
                  ),

                  // "Before" Badge
                  Positioned(
                    bottom: 12,
                    left: 12,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, py: 4),
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.4),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Text(
                        'قبل',
                        style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),

                  // "After" Badge
                  Positioned(
                    bottom: 12,
                    right: 12,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, py: 4),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.7),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Text(
                        'بعد',
                        style: TextStyle(color: Colors.black, fontSize: 10, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),

                  // Draggable Gesture Area
                  Positioned.fill(
                    child: GestureDetector(
                      onHorizontalDragUpdate: (details) {
                        final RenderBox box = context.findRenderObject() as RenderBox;
                        final localOffset = box.globalToLocal(details.globalPosition);
                        setState(() {
                          _sliderValue = (localOffset.dx / box.size.width).clamp(0.0, 1.0);
                        });
                      },
                    ),
                  ),

                  // Vertical Line Indicator & Slider Thumb Icon
                  Align(
                    alignment: Alignment(_sliderValue * 2 - 1, 0),
                    child: Container(
                      width: 2.5,
                      color: Colors.white.withOpacity(0.9),
                      child: Center(
                        child: Container(
                          width: 32,
                          height: 32,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.15),
                                blurRadius: 8,
                                offset: const Offset(0, 2),
                              )
                            ],
                          ),
                          child: Icon(Icons.swap_horiz, size: 18, color: primaryColor),
                        ),
                      ),
                    ),
                  )
                ],
              ),
            ),
          ),
          
          // Card Details
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  widget.item.title,
                  textDirection: TextDirection.rtl,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFF1B1C19),
                  ),
                ),
                if (widget.item.description != null && widget.item.description!.isNotEmpty) ...[
                  const SizedBox(height: 4),
                  Text(
                    widget.item.description!,
                    textDirection: TextDirection.rtl,
                    style: const TextStyle(
                      fontSize: 11,
                      color: Color(0xFF8C8C8C),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class RegularGalleryCard extends StatelessWidget {
  final GalleryItem item;
  const RegularGalleryCard({super.key, required this.item});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: Colors.black.withOpacity(0.04)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.015),
            blurRadius: 15,
            offset: const Offset(0, 8),
          )
        ],
      ),
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(24),
            child: AspectRatio(
              aspectRatio: 1.2,
              child: Image.network(
                item.fileUrl,
                fit: BoxFit.cover,
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  item.title,
                  textDirection: TextDirection.rtl,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFF1B1C19),
                  ),
                ),
                if (item.description != null && item.description!.isNotEmpty) ...[
                  const SizedBox(height: 4),
                  Text(
                    item.description!,
                    textDirection: TextDirection.rtl,
                    style: const TextStyle(
                      fontSize: 11,
                      color: Color(0xFF8C8C8C),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}
