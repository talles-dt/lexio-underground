BEGIN;
ALTER TABLE public.lexio_practice_events DROP CONSTRAINT lexio_practice_events_kind_check;
ALTER TABLE public.lexio_practice_events ADD CONSTRAINT lexio_practice_events_kind_check CHECK (kind IN ('attempt','reflection','save_item','review','move_item'));
ALTER TABLE public.lexio_practice_events ADD CONSTRAINT practice_move_room_check CHECK (
  kind <> 'move_item' OR COALESCE((component = 'palace' AND payload ? 'room' AND payload->>'room' IN ('grammar','vocab','logic','culture','comm')), false)
);
COMMIT;
