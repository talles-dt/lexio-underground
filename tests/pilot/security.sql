-- Run only against the isolated fixture with the baseline and pilot migration.
\set ON_ERROR_STOP on
BEGIN;
INSERT INTO auth.users(id,email) VALUES ('aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa','a@example.test'), ('bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb','b@example.test');
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claim.sub = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa';
DO $$ BEGIN
 IF has_table_privilege('authenticated','public.users','TRUNCATE') OR has_table_privilege('authenticated','public.diagnostic_sessions','TRUNCATE') THEN RAISE EXCEPTION 'truncate bypass remains'; END IF;
END $$;
UPDATE public.users SET name='Allowed' WHERE id=auth.uid();
DO $$ BEGIN
 IF (SELECT count(*) FROM public.users) <> 1 THEN RAISE EXCEPTION 'cross-user profile leak'; END IF;
 BEGIN
  UPDATE public.users SET role='admin' WHERE id=auth.uid();
  RAISE EXCEPTION 'role escalation allowed';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN
  UPDATE public.users SET tier='pro_lifetime' WHERE id=auth.uid();
  RAISE EXCEPTION 'tier escalation allowed';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
INSERT INTO public.lexio_practice_events(user_id,id,component,activity_id,kind,payload,occurred_at) VALUES (auth.uid(),'cccccccc-cccc-4ccc-cccc-cccccccccccc','phonos','s01','reflection','{"reflection":"repeat"}',now());
-- Duplicate delivery must be harmless without UPDATE privileges.
INSERT INTO public.lexio_practice_events(user_id,id,component,activity_id,kind,payload,occurred_at) VALUES (auth.uid(),'cccccccc-cccc-4ccc-cccc-cccccccccccc','phonos','s01','reflection','{"reflection":"repeat"}',now()) ON CONFLICT (user_id,id) DO NOTHING;
DO $$ BEGIN
 IF (SELECT count(*) FROM public.lexio_practice_events) <> 1 THEN RAISE EXCEPTION 'duplicate event'; END IF;
 BEGIN
  INSERT INTO public.lexio_practice_events(user_id,id,component,activity_id,kind,payload,occurred_at) VALUES ('bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb',gen_random_uuid(),'phonos','s01','reflection','{}',now());
  RAISE EXCEPTION 'cross-user insert allowed';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN
  UPDATE public.lexio_practice_events SET payload='{}';
  RAISE EXCEPTION 'immutable event edited';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
SET LOCAL request.jwt.claim.sub = 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb';
DO $$ BEGIN IF (SELECT count(*) FROM public.lexio_practice_events) <> 0 THEN RAISE EXCEPTION 'cross-user event leak'; END IF; END $$;
DELETE FROM public.lexio_practice_events;
SET LOCAL request.jwt.claim.sub = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa';
DO $$ BEGIN IF (SELECT count(*) FROM public.lexio_practice_events) <> 1 THEN RAISE EXCEPTION 'cross-user delete allowed'; END IF; END $$;
DELETE FROM public.lexio_practice_events;
INSERT INTO public.lexio_practice_events(user_id,id,component,activity_id,kind,payload,occurred_at) VALUES (auth.uid(),gen_random_uuid(),'palace','item','move_item','{"room":"culture"}',now());
DO $$ BEGIN
 BEGIN
  INSERT INTO public.lexio_practice_events(user_id,id,component,activity_id,kind,payload,occurred_at) VALUES (auth.uid(),gen_random_uuid(),'palace','item','move_item','{"room":null}',now());
  RAISE EXCEPTION 'null room allowed';
 EXCEPTION WHEN check_violation THEN NULL; END;
 BEGIN
  INSERT INTO public.lexio_practice_events(user_id,id,component,activity_id,kind,payload,occurred_at) VALUES (auth.uid(),gen_random_uuid(),'pulse','item','move_item','{"room":"vocab"}',now());
  RAISE EXCEPTION 'invalid component allowed';
 EXCEPTION WHEN check_violation THEN NULL; END;
END $$;
SET LOCAL ROLE anon;
DO $$ BEGIN
 BEGIN PERFORM * FROM public.diagnostic_sessions; RAISE EXCEPTION 'anonymous diagnostic leak'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN PERFORM * FROM auth.users; RAISE EXCEPTION 'anonymous auth leak'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN PERFORM * FROM public.lexio_practice_events; RAISE EXCEPTION 'anonymous practice leak'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
ROLLBACK;
