-- Convert the 5 "Asked and confirmed?" intercessor fields in WS5 from a
-- shorttext input to a proper boolean toggle (Yes/No switch).
--
-- Schema stays unchanged — `kind` is a free text column on worksheet_field
-- whose value the renderer dispatches on. We just add 'boolean' as a new
-- recognized kind.

update public.worksheet_field
set kind = 'boolean', max_chars = null
where field_key in (
  'intercessor1.asked','intercessor2.asked','intercessor3.asked',
  'intercessor4.asked','intercessor5.asked'
)
and worksheet_id = (
  select id from public.worksheet where code = 'WS5'
    and module_id = (select id from public.module where number='0'
                       and track_id = (select id from public.track where slug='church-planting'))
);

-- Any legacy text values become NULL — coerce to clean boolean state.
delete from public.worksheet_response
where field_key in (
  'intercessor1.asked','intercessor2.asked','intercessor3.asked',
  'intercessor4.asked','intercessor5.asked'
);

-- Tighten the prompt — the "(Y / N)" suffix was a hint for a text input.
-- A toggle makes it redundant.
update public.worksheet_field
set prompt = regexp_replace(prompt, ' \(Y / N\)$', '')
where field_key in (
  'intercessor1.asked','intercessor2.asked','intercessor3.asked',
  'intercessor4.asked','intercessor5.asked'
);
