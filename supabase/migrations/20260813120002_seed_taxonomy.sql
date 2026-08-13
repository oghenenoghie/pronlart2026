-- Seed the thirteen movements ("art classes") and the base medium list.

insert into movements (slug, name, era, summary, blurb, sort) values
  ('renaissance', 'Renaissance', '14th–17th century', 'Realism, proportion and the study of human anatomy.', 'A rebirth of classical ideals — artists turned to anatomy, perspective and proportion to render the human figure with a fidelity the medieval world had set aside. Light and form became tools of observation as much as devotion.', 1),
  ('baroque', 'Baroque', '17th–18th century', 'Drama, rich detail and emotional movement.', 'Baroque painters chased motion and feeling — deep shadow, theatrical light and dense, gestural composition pull the eye through a scene the way a stage direction would.', 2),
  ('rococo', 'Rococo', '18th century', 'Light, elegant, ornamental and decorative.', 'A lighter, more playful successor to Baroque grandeur — pastel palettes, curling ornament and scenes of leisure replaced high drama with charm and wit.', 3),
  ('impressionism', 'Impressionism', '1860s–1880s', 'Fleeting light and everyday scenes in open brushwork.', 'Painted outdoors, fast, in pursuit of a moment of light before it changed — visible brushwork and everyday subject matter broke with the academy''s polish in favour of sensation.', 4),
  ('post-impressionism', 'Post-Impressionism', '1880s–1900s', 'Personal expression, symbolism and structured form.', 'Where Impressionism chased the optical moment, its successors pushed toward structure, symbol and interior feeling — colour and form used expressively rather than descriptively.', 5),
  ('expressionism', 'Expressionism', 'early 20th century', 'Raw feeling through bold colour and distortion.', 'Distortion, saturated colour and urgent mark-making in service of emotional truth over optical accuracy — the world rendered as it feels, not as it looks.', 6),
  ('cubism', 'Cubism', '1907–1920s', 'Geometric form and simultaneous viewpoints.', 'Objects broken into geometric facets and reassembled from multiple viewpoints at once — a rejection of the single fixed perspective that had governed painting since the Renaissance.', 7),
  ('surrealism', 'Surrealism', '1920s–1950s', 'Dream logic and unexpected juxtaposition.', 'The logic of dreams rendered with painterly precision — familiar objects in impossible arrangements, drawing on the unconscious as a source of imagery.', 8),
  ('abstract-art', 'Abstract Art', '20th century–present', 'Non-representational form — colour and shape first.', 'Colour, shape and gesture stand on their own, without reference to the visible world — meaning built from composition and material rather than depiction.', 9),
  ('contemporary-art', 'Contemporary Art', '1970s–present', 'Present-day practice across many media and ideas.', 'A living, plural practice spanning painting, installation and beyond — contemporary work engages the present moment directly, in whatever medium the idea demands.', 10),
  ('sculpture', 'Sculpture', 'Ongoing', 'Three-dimensional work in varied materials.', 'Form realised in space rather than on a plane — stone, wood, metal and cast material shaped by hand, chisel and mould across every era of art history.', 11),
  ('woodwork', 'Woodwork / Carving', 'Ongoing', 'Traditional carving and woodworking craft.', 'A craft tradition of carving, joinery and grain — patient, tool-driven work that treats wood''s own character as part of the finished piece.', 12),
  ('bronze', 'Bronze', 'Ongoing', 'Bronze casting and patination.', 'Lost-wax casting and hand-worked patina turn molten metal into permanent form — a process as old as antiquity, still central to sculptural practice today.', 13)
on conflict (slug) do nothing;

insert into mediums (slug, name) values
  ('painting', 'Painting'),
  ('sculpture', 'Sculpture'),
  ('bronze', 'Bronze'),
  ('carving', 'Carving')
on conflict (slug) do nothing;
