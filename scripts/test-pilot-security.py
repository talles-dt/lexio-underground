"""Runs SQL regression checks in a disposable, network-isolated PostgreSQL container."""
from pathlib import Path
import subprocess
import time
import uuid

root = Path(__file__).resolve().parents[1]
name = 'lexio-security-' + uuid.uuid4().hex[:10]

def command(args, **kwargs):
    return subprocess.run(args, check=True, capture_output=True, text=True, **kwargs)

def sql(content):
    return command(['docker', 'exec', '-i', name, 'psql', '-h', '127.0.0.1', '-U', 'postgres', '-v', 'ON_ERROR_STOP=1'], input=content)

try:
    command(['docker', 'run', '--name', name, '--network', 'none', '-e', 'POSTGRES_HOST_AUTH_METHOD=trust', '-d', 'postgres:16-alpine'])
    for attempt in range(30):
        if subprocess.run(['docker', 'exec', name, 'pg_isready', '-h', '127.0.0.1', '-U', 'postgres'], capture_output=True).returncode == 0:
            break
        time.sleep(0.5)
    else:
        raise RuntimeError('Test database did not start')
    sql('''CREATE EXTENSION pgcrypto;
CREATE ROLE anon NOLOGIN;
CREATE ROLE authenticated NOLOGIN;
CREATE ROLE service_role NOLOGIN BYPASSRLS;
CREATE SCHEMA auth;
CREATE TABLE auth.users(id uuid PRIMARY KEY, email text, raw_user_meta_data jsonb DEFAULT '{}');
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub', true),'')::uuid $$;
GRANT USAGE ON SCHEMA auth,public TO anon,authenticated,service_role;
GRANT EXECUTE ON FUNCTION auth.uid() TO anon,authenticated,service_role;''')
    for migration in ['20260528000000_create_diagnostic_sessions.sql', '20260528000001_create_users_table.sql', '20260618000000_admin_system.sql', '20261009043723_lexio_pilot_security_events.sql', '20261011030938_palace_room_events.sql', '20261011031404_close_legacy_profile_privileges.sql']:
        sql((root / 'supabase/migrations' / migration).read_text())
    sql((root / 'tests/pilot/security.sql').read_text())
    print('PASS: SQL permissions, account isolation, immutable events, deduplication and anonymous denial')
except subprocess.CalledProcessError as error:
    print(error.stderr)
    raise
finally:
    subprocess.run(['docker', 'stop', name], capture_output=True)
    subprocess.run(['docker', 'rm', name], capture_output=True)
