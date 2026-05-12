-- Normalize newline runs in lesson.teaching so every paragraph break is
-- exactly two newlines. The original docx extraction stored body paragraphs
-- with a single \n between them, which caused the renderer (which splits
-- on /\n\s*\n/) to collapse consecutive paragraphs into one block and emit
-- a wall of text.
--
-- The regex is idempotent: any run of \n becomes exactly \n\n.
update public.lesson
set teaching = regexp_replace(teaching, E'\n+', E'\n\n', 'g')
where teaching is not null
  and module_id = (
    select id from public.module
      where number = '0'
        and track_id = (select id from public.track where slug='church-planting')
  );
